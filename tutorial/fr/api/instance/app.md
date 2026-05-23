# app



Les éléments à l'intérieur de `o-app`, y compris ceux à l'intérieur du nœud fantôme de `o-page` à l'intérieur de `o-app`, ou les composants enfants internes, leur attribut `app` pointe vers l'instance d'élément de ce `o-app`.

## Obtenir une instance d'application

Voici un exemple qui montre comment accéder à la propriété `app` dans un élément à l'intérieur de `o-app` :


<o-playground name="app - Obtenir l'instance de l'application" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    // Méthodes disponibles sur l'application
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
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
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Exemples d'utilisation de l'application

Après avoir obtenu l'instance `app`, vous pouvez :

### 1. Méthode personnalisée pour accéder à l'application

Les méthodes personnalisées ajoutées via la configuration `proto` dans `app-config.js` peuvent être appelées sur n'importe quelle page ou composant via `this.app` :

```javascript
// app-config.js
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  showMessage(message) {
    alert(message);
  },
};
```

```javascript
// Utiliser dans une page ou un composant
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("L'utilisateur est connecté");
}
```

### 2. Accéder aux propriétés de l'application

```javascript
// Obtenir la page actuelle
const currentPage = this.app.current;

// Obtenir l'historique des routes
const routers = this.app.routers;

// Accéder aux données globales
const user = this.app.globalData?.user;
```

### 3. Appeler la méthode de navigation

```javascript
// Saut de page
this.app.goto("./about.html");

// Revenir à la page précédente
this.app.back();

// Remplacer la page actuelle
this.app.replace("./login.html");
```

### 4. Écouter les événements d'application

```javascript
// Écouter les changements de route
this.app.on("router-change", (e) => {
  console.log("Changement de route :", e.data);
});
```

## Documentation détaillée

Pour savoir comment configurer la logique d'initialisation de l'application et ajouter des méthodes personnalisées dans `app-config.js`, veuillez vous référer à ：

- **[Initialisation de l'application](../../documentation/app-initialization.md)** - Décrit en détail la méthode d'utilisation des options de configuration `ready` et `proto`
- **[Routage et navigation](../../documentation/app-navigation.md)** - Décrit en détail les méthodes de navigation de l'application et l'écoute des routes

## Propriétés et méthodes courantes de l'instance d'application

| Propriété / Méthode | Description |
|----------|------|
| `current` | Instance de la page actuelle |
| `routers` | Historique des routes |
| `globalData` | Données globales（nécessite une initialisation dans `ready`） |
| `goto(src)` | Aller à la page spécifiée |
| `back()` | Revenir à la page précédente |
| `replace(src)` | Remplacer la page actuelle |
| `forward()` | Aller à la page suivante |
| `on(event, callback)` | Écouter un événement de l'application |
| Méthodes personnalisées | Méthodes ajoutées via la configuration `proto` |