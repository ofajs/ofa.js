# Créer un composant

Dans ofa.js, les composants sont le mécanisme central pour réaliser la réutilisation des pages et la modularisation. Un composant est essentiellement un Web Component personnalisé, qui permet de créer des éléments d'interface utilisateur réutilisables en définissant des templates, des styles et de la logique.

## Structure de base du composant

Contrairement aux modules de page, le module de composant utilise l’attribut `component` sur l’élément `<template>` et déclare l’attribut `tag` pour spécifier le nom de la balise du composant.

À l'emplacement où vous devez utiliser le composant, chargez de manière asynchrone le module du composant via la balise `l-m` ; le système effectuera automatiquement l'enregistrement. Ensuite, vous pouvez utiliser directement ce composant comme une balise HTML normale.

<o-playground name="Exemple de composant de base" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "Exemple de composant OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Concepts clés des composants

### tag - nom de l'étiquette du composant

`tag` est le nom de la balise du composant, **doit être identique au nom de la balise utilisée pour le composant**. Par exemple, si votre composant `tag` est défini comme `"demo-comp"`, alors lors de l'utilisation en HTML, vous devez écrire `<demo-comp></demo-comp>`.

Étant donné que les composants sont essentiellement des Web Components, **le nom du tag du composant doit contenir un trait d'union `-`**. Ceci est une exigence de la spécification Web Components, afin d'éviter les conflits avec les noms de balises des éléments HTML natifs. Par exemple, `demo-comp`, `my-button`, `user-card` sont des noms de balises valides, tandis que `democomp`, `button`, `card` sans trait d'union ne sont pas valides.

### Référence du module composant

En introduisant le module de composants via la balise `l-m`, le module de composants enregistre automatiquement les composants. Cela ressemble à l'utilisation de la balise `script` pour introduire un script, mais `l-m` est spécifiquement destiné au chargement et à l'enregistrement des modules de composants.

> Attention : la balise de référence `l-m` est une **référence asynchrone**, adaptée au chargement à la demande des composants lors du chargement de la page.

## Composant de référence synchrone

Dans certains scénarios, vous pouvez avoir besoin de charger un composant de manière synchrone (par exemple, pour vous assurer que le composant est bien enregistré avant utilisation). Vous pouvez alors utiliser la méthode `load` avec le mot-clé `await` pour réaliser une référence synchrone.

Dans les modules de composants et les modules de pages, la fonction `load` est automatiquement injectée pour permettre aux développeurs de charger de manière synchrone les ressources nécessaires.

<o-playground name="Exemple de composant de référence synchrone" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "Exemple de composant OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## référence asynchrone vs référence synchrone

| Mode de référence | Mot-clé | Caractéristique |
|---------|-------|------|
| Référence asynchrone | Balise `l-m` | Chargement non bloquant, adapté pour le chargement à la demande des composants |
| Référence synchrone | Méthode `load` avec le mot-clé `await` | Chargement bloquant, garantit que le composant est enregistré avant utilisation |Les références de balise `l-m` et la méthode `load` peuvent toutes deux charger des modules de composants ; en général, il est recommandé d’utiliser la référence asynchrone de composant via la balise `l-m` afin de réaliser un chargement non bloquant et à la demande.