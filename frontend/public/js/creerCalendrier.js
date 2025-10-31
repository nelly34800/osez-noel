// Récupération des éléments
const nameInput = document.getElementById("name");
const bgSelect = document.getElementById("bgSelect");
const previewBackground = document.getElementById("previewBackground");
const generateBtn = document.getElementById("generateBtn");
const addColorBtn = document.getElementById("AddColor");
const deleteColorBtn = document.getElementById("DeleteColor");
const emptyBoxBtn = document.getElementById("emptyBox");
const addPatternColorBtn = document.getElementById("AddColorPattern");
const deletePatternColorBtn = document.getElementById("DeleteColorPattern");
const patternColorsContainer = document.getElementById("patternColors");
const boxColorsContainer = document.getElementById("boxColors");
const previewBoxes = document.getElementById("previewBoxes");
const iconsButtonsContainer = document.getElementById("iconsButtons");
const layoutSelect = document.getElementById("layoutSelect");

// bouton est désactivé par défaut
generateBtn.disabled = true;

// Vérifie le champ du nom 
//écoute des événements
nameInput.addEventListener("keyup", validateForm);
// écoute changement de disposition
layoutSelect.addEventListener("change", updateBoxesPreview);

//fonction permettant de valider le formulaire
function validateForm(){
const nameOk = validateRequired(nameInput);

  if (nameOk){
    generateBtn.disabled = false;
  }
  else{
    generateBtn.disabled = true;
  }
}

function validateRequired(input){
  //trim() pour enlever les espaces avant et après la chaine
  if(input.value.trim() != ''){
      // c'est ok
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
      return true;
  }
  else{
    //c'est pas ok
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Change le fond en fonction du choix
bgSelect.addEventListener("change", () => {
  const value = bgSelect.value;
  let bgUrl = "";

  if (value === "flocon") bgUrl = "/img/flocons.png";
  if (value === "stars") bgUrl = "/img/stars.jpg";
  if (value === "neige") bgUrl = "/img/neige.jpg";
  if (value === "decor2") bgUrl = "/img/decor2.jpg";
  if (value === "etoiles") bgUrl = "/img/etoiles.jpg";
  if (value === "multi") bgUrl = "/img/multi.jpg";
  if (value === "christmas") bgUrl = "/img/christmas.png";
  if (value === "boules") bgUrl = "/img/boules.jpg";
  if (value === "boules2") bgUrl = "/img/boules2.jpg";

  // Effet fondu: baisse l'opacité avant de changer l'image
  previewBackground.style.opacity = "0";

  // attend que l'effet soit presque fini (300ms)
  setTimeout(() => {
    if (bgUrl) {
      previewBackground.style.backgroundImage = `url('${bgUrl}')`;
  } else {
    previewBackground.style.backgroundImage = "none";
  }
    // remet l'opacité à 1 (le fondu s’inverse)
    previewBackground.style.opacity = "1";
  }, 300);
});

//mode transparent est faux par défaut
let transparentMode = false;

//gestion des icones
let selectedIcons = [];

iconsButtonsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".icon-btn");
  if (!btn) return;

  const iconClass = btn.dataset.icon;

  // Toggle de sélection
  if (selectedIcons.includes(iconClass)) {
    selectedIcons = selectedIcons.filter(icon => icon !== iconClass);
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-light");
  } else {
    selectedIcons.push(iconClass);
    btn.classList.remove("btn-outline-light");
    btn.classList.add("btn-primary");
  }

  updateBoxesPreview();
});

// Met à jour aperçu des boîtes
function updateBoxesPreview() {
  previewBoxes.innerHTML = ""; // vide l’aperçu
  const colors = document.querySelectorAll(".boxColor");
  const patternColors = document.querySelectorAll(".patternColor");

  const layout = layoutSelect.value;  // disposition boites
  const boxSize = 40; 
  const gap = 10; // espace min entre boîtes
  const positions = []; // stocke les positions

  for (let i = 1; i <= 6; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("data-number", i);

    // Couleur boîte
    const boxColor = colors[(i - 1) % colors.length]?.value || "#ccc";
    // Couleur motif 
    const patternColor = patternColors[(i - 1) % patternColors.length]?.value || "#000";

    if (transparentMode) {
      box.style.backgroundColor = "transparent";
      box.style.border = `2px solid ${selectedIcons.length > 0 ? patternColor : "#000"}`;
      box.style.color = selectedIcons.length > 0 ? patternColor : "#000";
    } else {
      box.style.backgroundColor = boxColor;
      box.style.border = `2px solid ${patternColor}`;
      box.style.color = patternColor;
    }

    // Ajout d’un motif si sélectionné
    if (selectedIcons.length > 0) {
      const icon = document.createElement("i");
      icon.classList.add("bi", selectedIcons[(i - 1) % selectedIcons.length]);
      icon.style.color = patternColors[(i - 1) % patternColors.length].value;
      icon.style.fontSize = "1.2em";
      icon.style.position = "absolute";
      icon.style.top = "50%";
      icon.style.left = "50%";
      icon.style.transform = "translate(-50%, -50%)";
      box.appendChild(icon);
    }

    // Disposition aléatoire
    if (layout === "aleatoire") {
      box.style.position = "absolute";

      let x, y;
      let attempts = 0;

      do {
        const maxX = previewBoxes.clientWidth - boxSize;
        const maxY = previewBoxes.clientHeight - boxSize;
        x = gap + Math.random() * (maxX - gap * 2);
        y = gap + Math.random() * (maxY - gap * 2);
        attempts++;
      } while (
        positions.some(pos => Math.abs(pos.x - x) < boxSize + gap && Math.abs(pos.y - y) < boxSize + gap) &&
        attempts < 200
      );

      positions.push({ x, y });
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
    }

    previewBoxes.appendChild(box);
  }
   // Ajuste le conteneur pour l’option aléatoire
  previewBoxes.style.position = layout === "aleatoire" ? "relative" : "unset";
}

// ajoute une couleur de boite
addColorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const existingColors = document.querySelectorAll(".boxColor");
  if (existingColors.length >= 6) return;

  const newInput = document.createElement("input");
  newInput.type = "color";
  newInput.classList.add("boxColor");
  newInput.value = "#ffffff";
  newInput.addEventListener("input", updateBoxesPreview);
  boxColorsContainer.appendChild(newInput);
  updateBoxesPreview();
});

// supprime une couleur de boite
deleteColorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const allColors = document.querySelectorAll(".boxColor");
  if (allColors.length > 1) {
    allColors[allColors.length - 1].remove();
    updateBoxesPreview();
  }
});

// change une couleur
boxColorsContainer.addEventListener("input", updateBoxesPreview);

// mode boite transparente
emptyBoxBtn.addEventListener("click", (e) => {
  e.preventDefault();
  transparentMode = !transparentMode;
  emptyBoxBtn.classList.toggle("btn-secondary");
  updateBoxesPreview();
});

// Ajoute une couleur de motif
addPatternColorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const existingPatternColors = document.querySelectorAll(".patternColor");
  if (existingPatternColors.length >= 6) return;

  const newInput = document.createElement("input");
  newInput.type = "color";
  newInput.classList.add("patternColor");
  newInput.value = "#ffffff";
  newInput.addEventListener("input", updateBoxesPreview);
  patternColorsContainer.appendChild(newInput);
  updateBoxesPreview();
});

// Supprime une couleur de motif
deletePatternColorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const allPatternColors = document.querySelectorAll(".patternColor");
  if (allPatternColors.length > 1) {
    allPatternColors[allPatternColors.length - 1].remove();
    updateBoxesPreview();
  }
});

// Met à jour les motifs quand on change une couleur
patternColorsContainer.addEventListener("input", updateBoxesPreview);

// Initialisation
updateBoxesPreview();