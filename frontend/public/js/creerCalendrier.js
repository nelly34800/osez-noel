// Récupération des éléments
const nameInput = document.getElementById("name");
const bgSelect = document.getElementById("bgSelect");
const fileInput = document.getElementById("file");
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


// fonction pour changer le fond avec effet de fondu
function changeBackground(url) {
  previewBackground.style.opacity = "0"; // baisse l'opacité

  setTimeout(() => {
    if (url) {
      previewBackground.style.backgroundImage = `url('${url}')`;
    } else {
      previewBackground.style.backgroundImage = "none";
    }
    previewBackground.style.opacity = "1"; // remet l'opacité
  }, 300);
}

// écoute des fonds prédéfinis
bgSelect.addEventListener("change", () => {
  const value = bgSelect.value;
  let bgUrl = "";

  switch (value) {
    case "flocon": bgUrl = "/img/flocons.png"; break;
    case "stars": bgUrl = "/img/stars.jpg"; break;
    case "neige": bgUrl = "/img/neige.jpg"; break;
    case "decor2": bgUrl = "/img/decor2.jpg"; break;
    case "etoiles": bgUrl = "/img/etoiles.jpg"; break;
    case "multi": bgUrl = "/img/multi.jpg"; break;
    case "christmas": bgUrl = "/img/christmas.png"; break;
    case "boules": bgUrl = "/img/boules.jpg"; break;
    case "boules2": bgUrl = "/img/boules2.jpg"; break;
    default: bgUrl = ""; break;
  }

  if (bgUrl) {
    // réinitialise l'input file pour éviter conflit
    fileInput.value = "";
    changeBackground(bgUrl);
  }
});

// écoute du téléchargement d'image
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    changeBackground(event.target.result);
    // réinitialise le select pour éviter conflit
    bgSelect.value = "";
  }
  reader.readAsDataURL(file);
});

//mode transparent est faux par défaut
let transparentMode = false;

//gestion des icones
let selectedIcons = [];

iconsButtonsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".icon-btn");
  if (!btn) return;

  const iconClass = btn.dataset.icon;

  // Toggle sélection icones
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

  const layout = layoutSelect.value;
  // disposition boites, taille des boîtes selon la largeur d'écran
  let boxSize;
  let gap;

if (window.innerWidth <= 680) {
  boxSize = 40;
  gap = 8;
} else {
  boxSize = 60;
  gap = 10;
}
  const positions = []; // stocke les positions

  for (let i = 1; i <= 24; i++) {
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

generateBtn.addEventListener("click", () => {
  const config = {
    colors: Array.from(document.querySelectorAll(".boxColor")).map(c => c.value),
    patternColors: Array.from(document.querySelectorAll(".patternColor")).map(c => c.value),
    icons: selectedIcons,
    transparentMode,
    layout: layoutSelect.value,
    name: nameInput.value
  };

  localStorage.setItem("calendarConfig", JSON.stringify(config));

  // Redirection classique vers la page calendrier
window.location.href = "pages/calendrier.html";
});