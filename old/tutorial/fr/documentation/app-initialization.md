# Initialisation de l'application

L'étape d'initialisation de l'application peut exécuter certains paramètres globaux, comme l'ajout de méthodes personnalisées, l'écoute d'événements, etc. `app-config.js` fournit deux options de configuration, `ready` et `proto`, pour gérer la logique d'initialisation.

## ready - callback d'initialisation

`ready` est la fonction de rappel exécutée une fois le chargement de la configuration de l'application terminé, vous pouvez y effectuer des opérations d'initialisation.

### Utilisation de base

```javascript
export const ready = function() {
  console.log("Application initialisée");
  // this pointe vers l'instance de l'élément o-app
  console.log("Page actuelle :", this.current);
};
```

> **Attention** : `ready` doit utiliser une déclaration de fonction ou une expression de fonction, pas une fonction fléchée (car elle nécessite une liaison correcte de `this`).

### Accéder à l'instance de l'application

Dans la fonction `ready`, `this` fait référence à l'instance de l'élément `o-app`, donnant accès à toutes les méthodes et propriétés de l'application :

```javascript
export const ready = function() {
  // Obtenir la page actuelle
  console.log("Page actuelle:", this.current);
  
  // Obtenir l'historique des routes
  console.log("Historique des routes:", this.routers);
  
  // Écouter les changements de route
  this.on("router-change", (e) => {
    console.log("Changement de route:", e.data);
  });
};
```

### Exemple d'initialisation

```javascript
export const ready = function() {
  // Initialiser l'état global
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // Restaurer les informations utilisateur depuis le stockage local
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // Écouter les changements de route
  this.on("router-change", (e) => {
    // Journaliser la visite de la page
    console.log("Page visitée:", e.data.src);
  });
};
```

## proto - extension de prototype

`proto` est utilisé pour ajouter des méthodes personnalisées et des propriétés calculées à l'instance de l'application, ces méthodes peuvent être accessibles dans toutes les pages via `this.app`.

### Ajouter des méthodes personnalisées

```javascript
export const proto = {
  // Méthodes personnalisées
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // Méthode avec paramètres
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### Ajouter une propriété calculée

```javascript
export const proto = {
  // propriétés calculées
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
  
  get routerCount() {
    return this.routers?.length || 0;
  },
};
```

### Exemple complet

```javascript
export const proto = {
  // Méthodes de navigation
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    if (this.globalData.user) {
      this.goto("./profile.html");
    } else {
      this.goto("./login.html");
    }
  },
  
  // Propriétés calculées
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // Méthodes utilitaires
  showMessage(message) {
    alert(message);
  },
};
```

## Utilisation dans la page

Dans les composants de page, vous pouvez accéder aux méthodes et propriétés personnalisées de l'instance d'application via `this.app` :

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">Retour à l'accueil</button>
  <button on:click="app.navigateToProfile()">Centre personnel</button>
  
  <p>Sur la page d'accueil : {{app.isAtHome}}</p>
  <p>Connecté : {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // Appeler la méthode de l'instance de l'application
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## Gestion de l'état global

En combinant `ready` et `proto`, il est possible d'implémenter une gestion simple de l'état global :

```javascript
// app-config.js

export const ready = function() {
  // Initialiser l'état global
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // Restaurer les données depuis le stockage local
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // Relatif aux utilisateurs
  get isLoggedIn() {
    return !!this.globalData.user;
  },
  
  login(userData) {
    this.globalData.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  },
  
  logout() {
    this.globalData.user = null;
    localStorage.removeItem("user");
    this.goto("./login.html");
  },
  
  // Relatif au panier
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // Relatif au thème
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## Exemple complet

<o-playground name="Exemple d'initialisation d'application" style="--editor-height: 500px">
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
    export const ready = function() {
      console.log("Application initialisée");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("Nombre de visites :", this.visitCount);
    };
    export const proto = {
      navigateToHome() {
        this.goto("./home.html");
      },
      get isAtHome() {
        return this.current?.src.includes("home.html");
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
      <p>Est à la page d'accueil : {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">Retour à l'accueil</button>
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
      <p>Est à la page d'accueil : {{app.isAtHome}}</p>
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

