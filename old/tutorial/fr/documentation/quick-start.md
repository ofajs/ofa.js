# Démarrage rapide

Cette section explique comment démarrer rapidement avec ofa.js. Dans les tutoriels suivants, nous omettrons l'étape de création du fichier d'entrée index.html et ne montrerons que le code des fichiers de modules de page. Vous pouvez directement développer à partir du modèle.

## Préparer les fichiers de base

Pour démarrer rapidement avec ofa.js, il suffit de créer un **module de page** et de l'associer à un HTML d'entrée ; les fichiers essentiels sont les suivants :

- `index.html` : Le fichier d'entrée de l'application, responsable du chargement du framework ofa.js et de l'importation des modules de page
- `demo-page.html` : Le fichier du module de page, définissant le contenu spécifique, le style et la logique des données de la page

### index.html (point d'entrée de l'application)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Exemple</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

Le rôle principal de ce fichier est :- Introduction du framework ofa.js
- Utilisation du composant `<o-page>` pour charger et rendre le module de page

### demo-page.html (module de page)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

Ce fichier définit un composant de page simple, contenant :- la balise `<template page>` définit le module de page  
- styles CSS (sélecteur `:host` du Shadow DOM)  
- expression de liaison de données `{{val}}`  
- logique JavaScript retournant un objet contenant les données initiales


## Démonstration en ligne

Voici un exemple en direct dans l'éditeur en ligne, vous pouvez modifier le code directement et voir l'effet :

<o-playground name="Démonstration en ligne" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Bonjour, code de démonstration ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Nous définissons les styles via la balise `<style>` à l'intérieur du composant. Ces styles internes ne s'appliquent qu'à l'intérieur du composant, avec un bon encapsulage, et n'affectent pas les autres éléments de la page.

Le sélecteur `:host` est utilisé pour définir le style de l’élément hôte du composant ; ici, nous définissons le composant comme un élément de bloc, avec une bordure rouge et un remplissage de 10 px.

Grâce à l'expression `{{key}}`, les valeurs correspondantes dans les données du composant peuvent être rendues sur la page.

Vous avez maintenant créé avec succès votre première application ofa.js ! Ensuite, approfondissons la syntaxe de rendu des modèles d’ofa.js et ses fonctionnalités avancées.