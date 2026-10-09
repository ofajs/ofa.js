# Configuration de l'application

Le fichier de configuration `app-config.js` prend en charge, en plus de l'adresse de la page d'accueil et de l'animation de transition entre pages, d'autres options de configuration pour contrôler l'état de chargement, la gestion des erreurs, la logique d'initialisation et les fonctionnalités de navigation de l'application.

```javascript
// app-config.js
// Contenu affiché lors du chargement
export const loading = () => "<div>Loading...</div>";

// Composant affiché en cas d'échec du chargement de la page
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Callback après l'initialisation de l'application
export const ready() {
  console.log("App is ready!");
}

// Méthodes et propriétés ajoutées au prototype de l'application
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="Exemple de configuration d'application" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    // Configuration de l'animation de changement de page
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>Aller à À propos</a>
      <br>
      <br>
      <button on:click="gotoAbout">Bouton Aller à À propos</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Démo d'application ofa.js",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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
      <div style="padding: 8px;"> <button on:click="back()">Retour</button> </div>
      <p> À propos de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Démo d'application ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## loading - état de chargement

Le composant affiché pendant le chargement de la page, peut être un modèle de chaîne ou une fonction retournant un modèle.

```javascript
// Modèle de chaîne simple
export const loading = "<div class='loading'>Loading...</div>";

// Généré dynamiquement avec une fonction
export const loading = () => {
  return `<div class='loading'>
    <span>Chargement en cours...</span>
  </div>`;
};
```

Voici une implémentation de loading belle et directement copiable dans un projet :

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - gestion des erreurs

Composant affiché en cas d’échec du chargement de la page ; la fonction reçoit un paramètre objet contenant `src` (l’adresse de la page ayant échoué) et `error` (le message d’erreur).

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Échec du chargement de la page</p>
    <p>Adresse: ${src}</p>
    <button on:click="back()">Retour</button>
  </div>`;
};
```

## proto - extension de prototype

Ajoutez des méthodes personnalisées et des propriétés calculées à l'instance de l'application, ces méthodes peuvent être accessibles dans les composants de page via `this.app`.

```javascript
export const proto = {
  // Méthode personnalisée
  navigateToHome() {
    this.goto("home.html");
  },
  // Propriété calculée
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

Appeler dans la page :

```html
<template page>
  <button on:click="app.navigateToHome()">Retour à l'accueil</button>
  <p>Êtes-vous sur la page d'accueil : {{app.isAtHome}}</p>
</template>
```

## ready - callback d'initialisation

Fonction de rappel exécutée après le chargement de la configuration de l'application, vous pouvez effectuer des opérations d'initialisation ici. Vous pouvez accéder aux méthodes et propriétés de l'instance de l'application via `this`.

```javascript
export const ready() {
  console.log("L'application est initialisée");
  // Peut accéder à this (instance de l'élément o-app)
  console.log(this.current); // Obtenir l'instance de l'élément o-page de la page actuelle
  // this.someMethod();
}
```

## allowForward - Fonction d'avance

Contrôle si la fonction de navigation avant du navigateur est activée. Lorsqu'elle est définie sur `true`, vous pouvez utiliser les boutons de retour et d'avance du navigateur pour naviguer.

```javascript
export const allowForward = true;
```

Lorsqu'il est activé, l'utilisateur peut naviguer à l'aide des boutons avant/arrière du navigateur, et la méthode de navigation `forward()` de l'application sera également effective.

## Navigation programmatique

En plus d'utiliser le lien `olink`, vous pouvez également appeler la méthode de navigation en JavaScript :

```javascript
// Aller à la page spécifiée (ajouté à l'historique)
this.goto("./about.html");

// Remplacer la page actuelle (non ajouté à l'historique)
this.replace("./about.html");

// Revenir à la page précédente
this.back();

// Aller à la page suivante (nécessite de définir allowForward: true)
this.forward();
```

## Historique des routes

L'attribut `routers` permet d'obtenir l'historique de navigation :

```javascript
// Obtenir tout l'historique des routes
const history = app.routers;
// Format de retour: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Obtenir la page actuelle
const currentPage = app.current;
```

## Écouter les changements de route

Vous pouvez répondre aux changements de route en écoutant l'événement `router-change` :

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Changement de route:", data.name); // goto, replace, forward, back
  console.log("Adresse de la page:", data.src);
});
```