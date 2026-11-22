# Application à page unique

Une application monopage lie le composant `o-app` à la barre d’adresse du navigateur, synchronisant ainsi l’URL de la page avec le chemin des pages au sein de l’application. Après l’activation de l’application monopage :

- Actualiser la page web permet de conserver l’état actuel de la route
- Copier l’URL de la barre d’adresse et l’ouvrir dans un autre navigateur ou onglet permet également de restaurer l’état de l’application
- Les boutons Précédent/Suivant du navigateur fonctionnent normalement

## Utilisation de base

Enveloppez le composant `o-app` avec le composant officiel `o-router` pour réaliser une application à page unique.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body attribut

Après avoir ajouté l'attribut `fix-body`, `o-router` réinitialisera automatiquement les styles de `html` et `body`, éliminant les marges et le padding par défaut.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

Ceci est particulièrement utile dans les scénarios suivants：- nécessite que `o-app` remplisse complètement le viewport
- lorsque l'application constitue le seul contenu de la page

## Exemple

<o-playground name="Exemple d'application monopage" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil
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
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
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

## Principe de fonctionnement

Implémentation du mode Hash basé sur le navigateur pour une application monopage :

1. Lors du changement de page dans l'application, `o-router` met automatiquement à jour la valeur de hash dans la barre d'adresse (par exemple `#/about.html`)
2. Lorsque l'utilisateur actualise la page ou y accède via l'URL, `o-router` lit la valeur de hash et charge la page correspondante
3. Les boutons Précédent/Suivant du déclenchent un changement de hash, contrôlant ainsi la navigation dans l'application

## Exemples de changements d'URL

Supposons que l'application ait deux pages `home.html` et `about.html` :

| Action utilisateur | Changement de la barre d'adresse |
|-------------------|-----------------------------------|
| Ouvrir l'application | `index.html` → `index.html#/home.html` |
| Aller à la page À propos | `index.html#/home.html` → `index.html#/about.html` |
| Cliquer sur Retour | `index.html#/about.html` → `index.html#/home.html` |
| Actualiser la page | Conserver le hash actuel inchangé |## Limites d'utilisation

- Une application monopage ne peut fonctionner qu’avec **un seul** composant `o-app`