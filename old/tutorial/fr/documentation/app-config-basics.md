# Bases de la configuration d'application

`app-config.js` Le fichier de configuration est utilisé pour définir les divers comportements de l'application. Ce chapitre présente la structure de base du fichier de configuration et tous les éléments de configuration disponibles.

## Structure du fichier de configuration

Créez le fichier `app-config.js`, utilisez la syntaxe de module ES6 pour exporter les éléments de configuration :

```javascript
// app-config.js

// Adresse de la page d'accueil de l'application (obligatoire)
export const home = "./home.html";

// Configuration de l'animation de transition de page (optionnel)
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};

// État de chargement (optionnel)
export const loading = () => {
  return "<div>Loading...</div>";
};

// Gestion des erreurs (optionnel)
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// Initialisation de l'application (optionnel)
export const ready = function() {
  console.log("App is ready");
};

// Extension du prototype (optionnel)
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// Activer la fonction de navigation vers l'avant (optionnel)
export const allowForward = true;
```

## Vue d'ensemble des éléments de configuration

`app-config.js` prend en charge les options de configuration suivantes :

| Option de configuration | Obligatoire | Description | Documentation détaillée |
|--------|----------|------|----------|
| `home` | ✅ Obligatoire | Adresse de la page d'accueil de l'application | Ce chapitre |
| `pageAnime` | Optionnel | Configuration de l'animation de transition entre pages | [Animation de transition de page](./page-transition-animation.md) |
| `loading` | Optionnel | Contenu affiché lors du chargement de la page | [Chargement et gestion des erreurs](./app-loading-error.md) |
| `fail` | Optionnel | Contenu affiché en cas d'échec de chargement de la page | [Chargement et gestion des erreurs](./app-loading-error.md) |
| `ready` | Optionnel | Rappel exécuté après l'initialisation de l'application | [Initialisation de l'application](./app-initialization.md) |
| `proto` | Optionnel | Méthodes et propriétés ajoutées au prototype de l'application | [Initialisation de l'application](./app-initialization.md) |
| `allowForward` | Optionnel | Activer ou non la fonction de navigation avant du navigateur | [Routage et navigation](./app-navigation.md) |## accueil - adresse de la page d'accueil

`home` est un élément de configuration obligatoire, spécifiant le chemin du module de la page d'accueil chargé au démarrage de l'application.

```javascript
export const home = "./pages/home.html";
```

**Règles de chemin :**- Prend en charge les chemins relatifs (par rapport au fichier `app-config.js`)
- Prend en charge les chemins absolus
- Le chemin pointe vers un fichier de module de page (fichier `.html`)

## pageAnime - Animation de changement de page

`pageAnime` est une option de configuration facultative utilisée pour contrôler l'effet d'animation de transition lors du changement de page.

### Utilisation de base

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

### Description de l'état de l'animation

L'animation de transition de page comporte trois états :

| État | Description | Moment de déclenchement |
|------|------|----------|
| `current` | Style de la page actuelle après la fin de l'animation | Une fois la commutation de page terminée |
| `next` | Style initial à l'entrée de la nouvelle page | Lorsque la nouvelle page commence à entrer |
| `previous` | Style cible à la sortie de l'ancienne page | Lorsque l'ancienne page commence à quitter |### Plus d'effets d'animation

Animation de transition de page prend en charge plusieurs effets, notamment :- Glissement gauche-droite (par défaut)
- Fondu enchaîné
- Glissement haut-bas
- Effet de zoom
- Effet de rotation
- Animation personnalisée

Pour des exemples détaillés de configuration et d'effets d'animation, veuillez vous référer au chapitre [Animation de transition de page](./page-transition-animation.md).

## Utiliser un fichier de configuration en HTML

Dans un fichier HTML, introduisez le fichier de configuration via la balise `o-app` :

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

<o-playground name="Exemple de base de configuration d'application" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    // Configuration de l'animation de transition de page
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

