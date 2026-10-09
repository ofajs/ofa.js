# Pages/routes imbriqués

Dans ofa.js, les pages imbriquées (également appelées routes imbriquées) sont une fonctionnalité puissante qui vous permet de créer une structure de pages avec une hiérarchie parent-enfant. La page parent sert de conteneur de mise en page et utilise le slot `<slot>` pour afficher le contenu de la page enfant.

## Concepts de base

- **Page parent (Layout)** : page servant de conteneur de mise en page, contenant les éléments d’interface communs tels que la barre de navigation et la barre latérale
- **Page enfant** : contenu de la page métier proprement dite, qui sera rendu à l’emplacement du `<slot>` de la page parent

## Écriture de la page parent

La page parent doit utiliser la balise `<slot></slot>` pour réserver l'emplacement de rendu à la page enfant.

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
    ...
  </style>
  ...
  <div class="content">
    <slot></slot>
  </div>
  ...
</template>
```

## Écriture des sous-pages

La sous-page spécifie le chemin de la page parente en exportant la propriété `parent`.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export const parent = 'layout.html'; // ⚠️ Code clé

    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Code de démonstration",
        },
      };
    };
  </script>
</template>
```

## Exemple de page imbriquée

Voici un exemple complet de routage imbriqué, comprenant une disposition racine, une page parent et une page enfant :

<o-playground name="Exemple de page imbriquée" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Adresse de la page d'accueil de l'application
    export const home = "./sub-page01.html";
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
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>Page 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>Page 2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>Je suis la sous-page 1</h1>
      <p>Route actuelle : {{src}}</p>
      <a href="./sub-page02.html" olink>Aller à la page 2</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>Je suis la sous-page 2</h1>
      <p>Route actuelle : {{src}}</p>
      <a href="./sub-page01.html" olink>Aller à la page 1</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Surveillance du routage de la page parente

La page parente peut écouter les changements de route via le hook de cycle de vie `routerChange`, ce qui est utile lorsque vous devez mettre à jour l’état de la navigation en fonction de la route actuelle.

```html
<template page>
  ...
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## Points d'attention

- La valeur de l'attribut `parent` peut être un chemin relatif (par exemple `./layout.html`) ou un chemin absolu (par exemple `/pages/layout.html`)
- La page parente doit contenir une balise `<slot></slot>`, sinon le contenu de la page enfant ne pourra pas s'afficher
- Les styles de la page parente sont hérités par la page enfant, et la page enfant peut également définir ses propres styles
- Utiliser le hook `routerChange` permet d'écouter les changements de route et de réaliser des fonctionnalités comme la mise en surbrillance de la navigation

## Imbrication multiniveaux

La page parent peut également avoir sa propre page parent, formant une structure d'imbrication à plusieurs niveaux.

```html
<!-- Sous-page -->
<template page>
  <p>Contenu de la sous-page</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- Page parente -->
<template page>
  <div class="layout">
    <nav>Barre de navigation</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## Exemple d'imbrication multi-niveaux

<o-playground name="Exemple complet de routage imbriqué" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Adresse de la page d'accueil de l'application
    export const home = "./sub-page01.html";
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
  <code path="root-layout.html">
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
          border: 1px dashed gray;
        }
        .root {
          height: 100%;
          word-break: break-word;
          padding: 10px;
        }
      </style>
      <div style="text-align: center;font-weight: bold;">Root Layout</div>
      <div class="root">
        <slot></slot>
      </div>
      <script>
        export default () => {
          return { data: {} };
        };
      </script>
    </template>
  </code>
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>Page 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>Page 2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export const parent = "./root-layout.html";
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>Je suis la sous-page 1</h1>
      <p>Route actuelle : {{src}}</p>
      <a href="./sub-page02.html" olink>Aller à la page 2</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>Je suis la sous-page 2</h1>
      <p>Route actuelle : {{src}}</p>
      <a href="./sub-page01.html" olink>Aller à la page 1</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

