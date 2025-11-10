import Route from "./Route.js";
//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/home.html", []),
  new Route("/contact", "Contact", "/pages/contact.html", []),
  new Route("/creerCalendrier", "Créer un calendrier", "/pages/creerCalendrier.html", ["client"], "js/creerCalendrier.js"),
  new Route("/calendrier", "Calendrier", "/pages/calendrier.html", ["client"]),
  new Route("/signin", "Connexion", "/pages/auth/signin.html",["disconnected"], "js/auth/signin.js"),
  new Route("/signup", "Inscription", "/pages/auth/signup.html",["disconnected"], "js/auth/signup.js"),
  new Route("/account", "Mon compte", "/pages/auth/account.html", ["client", "admin"]),
  new Route("/editPassword", "Changer mot de passe", "/pages/auth/editPassword.html", ["client"], "js/auth/editPassword.js"),
  new Route("/editInfo","Modifier mes informations personnelles","/pages/auth/editInfo.html", ["client"], "js/auth/editInfo.js"),
];
//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Osez Noël";
