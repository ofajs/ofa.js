# Routage et navigation

La navigation entre les pages dans l'application est une fonctionnalité essentielle d'une application monopage. Ce chapitre explique comment utiliser la navigation programmatique, gérer l'historique des routes et écouter les changements de route.

## allowForward - Fonction d'avance

Par défaut, l'application ne prend en charge que la navigation arrière. Après avoir défini `allowForward` sur `true` dans `app-config.js`, vous pouvez activer la fonction de navigation avant de l'application.

```javascript
// app-config.js
export const allowForward = true;
```

Après activation:

- Les utilisateurs peuvent utiliser les boutons avant/arrière du navigateur pour naviguer
- La méthode `forward()` de l'application fonctionne correctement

## Navigation programmatique

En plus des liens utilisant l'attribut `olink`, vous pouvez également appeler des méthodes de navigation en JavaScript.

> **Remarque importante** :
> - Les méthodes `goto`, `replace`, `back` sont disponibles sur **l'instance de page (page)** et sur **l'instance d'application (app)**
> - La méthode `forward` est disponible uniquement sur **l'instance d'application (app)**
> - Dans une page, utilisez : `this.goto()` ou `this.app.goto()`
> - Dans un composant, utilisez : `this.app.goto()` (doit être appelé via l'instance app)
> 
> **Remarque sur la relativité des chemins** :
> - Lorsque `goto` ou `replace` est utilisé sur un **module de page**, le chemin est relatif à l'adresse du **module de page actuel**
> - Lorsque `goto` ou `replace` est utilisé sur l'**instance d'application (app)**, le chemin est relatif à la **navigation actuelle de l'application**

### goto - Aller à la page

Aller à la page spécifiée et l'ajouter à l'historique :

```javascript
// Aller à la page spécifiée
this.goto("./about.html");

// Aller à la page avec paramètres
this.goto("./detail.html?id=123");
```

### replace - Remplacer la page

Remplacer la page actuelle, sans l'ajouter à l'historique :

```javascript
// Remplacer la page actuelle
this.replace("./login.html");
```

Souvent utilisé pour la redirection après la connexion, afin d'éviter que l'utilisateur ne clique sur le bouton retour pour revenir à la page de connexion.

### back - retour

Retour à la page précédente :

```javascript
this.back();
```

### forward - avancer

Passer à la page suivante (nécessite de définir `allowForward: true`) :

```javascript
// Appeler dans une page ou un composant
this.app.forward();
```

> **Attention**：la méthode `forward` doit être appelée sur l'instance de l'application (`app`), et non sur l'instance de la page. Par exemple, utilisez `this.app.forward()` au lieu de `this.forward()`.

### Comparaison des méthodes de navigation

| Méthode      | Historique     | Scénario d'utilisation           |
| --------- | ------------ | ------------------ |
| `goto`    | Ajouter un nouvel enregistrement   | Navigation normale de page       |
| `replace` | Remplacer l'enregistrement actuel | Navigation après connexion, redirection |
| `back`    | Revenir à l'enregistrement précédent | Opération de retour           |
| `forward` | Avancer à l'enregistrement suivant | Opération d'avance（doit être activée） |## Historique des routes

### Obtenir l'historique des itinéraires

Récupérez tout l'historique des routes via la propriété `routers` :

```javascript
const history = app.routers;
// Format de retour: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### Obtenir la page actuelle

Obtenez l'instance de page actuelle via la propriété `current` :

```javascript
const currentPage = app.current;
console.log("Page actuelle :", currentPage.src);
```

### Exemple d'historique de routage

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // Nécessite d'être utilisé avec allowForward
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## Écouter les changements de route

Réagissez aux changements de route en écoutant l'événement `router-change`.

### Utilisation de base

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Changement de route :", data.name);
  console.log("Adresse de la page :", data.src);
});
```

### Données d'événement

L'objet de données de l'événement `router-change` contient：

| Attribut | Description | Valeurs possibles |
| ------- | ----------- | ------------------------------------ |
| `name`  | Type de navigation | `goto`, `replace`, `forward`, `back` |
| `src`   | Adresse de la page cible | Chemin de la page |### Exemples d'utilisation

```javascript
export const ready = function () {
  // Écouter les changements de route
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // Enregistrer la visite de page
    console.log(`[${name}] Naviguer vers : ${src}`);

    // Mettre à jour le titre de la page
    this.updateTitle(src);

    // Envoyer les données statistiques
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "Accueil",
      "about.html": "À propos de nous",
      "contact.html": "Nous contacter",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "Application";
  },

  trackPageView(src) {
    // Envoyer les statistiques de visite de page
    console.log("Statistiques de visite de page :", src);
  },
};
```

## Gardes de navigation de page

En combinant la surveillance de la route, il est possible d'implémenter une fonction de garde de navigation :

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // Vérifie si l'authentification est requise
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## Exemple complet

<o-playground name="Exemple de routage et de navigation" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    export const allowForward = true;
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
      this.on("router-change", (e) => {
        console.log("Changement de route :", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
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
      <p>Nombre d'historique de routage : {{app.routerCount}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="gotoAbout">Navigation programmatique</button>
      <br><br>
      <button on:click="goForward()">Avancer</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
              goForward() {
                this.app.forward();
              },
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
      <div style="padding: 8px;">
        <button on:click="back()">Reculer</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>Nombre d'historique de routage : {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">Astuce : après avoir cliqué sur "Reculer", vous pouvez cliquer sur "Avancer" sur la page d'accueil pour revenir ici.</p>
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

