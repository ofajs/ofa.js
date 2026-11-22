# Micro-application

`o-app` est le composant conteneur central d'ofa.js, utilisé pour créer des micro-applications indépendantes. Il charge le fichier de configuration `app-config.js` qui définit les différents comportements de l'application.

## Utilisation de base

Utilisez la balise `o-app` en HTML pour créer une micro-application :

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

## Créer un fichier de configuration

Créer le fichier `app-config.js`, définir la configuration de base de l'application :

```javascript
// app-config.js

// Adresse de la page d'accueil de l'application (obligatoire)
export const home = "./home.html";

// Configuration de l'animation de changement de page (optionnelle)
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

<o-playground name="Exemple de micro-application" style="--editor-height: 500px">
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Navigation de la page

### Utiliser l'attribut olink

Dans `o-app`, utilisez la balise `<a>` avec l'attribut `olink` pour changer de page :

```html
<a href="./about.html" olink>Aller à la page À propos</a>
```

`olink` déclenche le changement de route de l'application, avec une animation de transition, et sans rafraîchir la page entière.

### Navigation programmatique

Dans les composants de page, vous pouvez utiliser les méthodes de navigation :

```javascript
// Naviguer vers la page spécifiée
this.goto("./about.html");

// Remplacer la page actuelle (sans ajouter à l'historique)
this.replace("./about.html");

// Revenir à la page précédente
this.back();
```

## Passage de paramètres de page

Passez les paramètres via la chaîne de requête URL, la page cible les reçoit via le paramètre `query` de la fonction du module :

**Envoyer la page :**

```html
<a href="./detail.html?id=123" olink>Voir les détails</a>
```

**Page de réception :**

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## Détails du fichier de configuration

`app-config.js` prend en charge plusieurs options de configuration pour contrôler le comportement de l'application :

| Paramètre | Obligatoire ? | Description |
|--------|----------|------|
| `home` | Obligatoire | Adresse de la page d'accueil de l'application |
| `pageAnime` | Optionnel | Configuration de l'animation de transition de page |
| `loading` | Optionnel | Contenu affiché lors du chargement de la page |
| `fail` | Optionnel | Contenu affiché en cas d'échec de chargement de la page |
| `ready` | Optionnel | Callback après l'initialisation de l'application |
| `proto` | Optionnel | Méthodes et propriétés ajoutées au prototype de l'application |
| `allowForward` | Optionnel | Activer la navigation avant du navigateur |## Caractéristiques des micro-applications

### Indépendance

Chaque instance `o-app` est une micro-application indépendante, avec ses propres :- Historique des routes
- Pile de pages
- Gestion d'état
- Options de configuration

### Utilisation imbriquée

`o-app` peut être imbriqué pour réaliser des structures d'application complexes :

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### Différences avec les composants

Principales différences entre `o-app` et les composants ordinaires :

| Caractéristiques | o-app | Composant ordinaire |
|------|-------|----------|
| Gestion du routage | ✅ Système de routage intégré | ❌ Aucun |
| Pile de pages | ✅ Gère l'historique des pages | ❌ Aucun |
| Fichier de configuration | ✅ Configuration indépendante | ❌ Aucun |
| Animation de transition de page | ✅ Pris en charge | ❌ Aucun |
| Scénario d'utilisation | Conteneur au niveau application | Composant fonctionnel |