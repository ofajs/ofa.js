# Chargement et gestion des erreurs

Pendant l'exécution de l'application, le chargement de la page prend du temps, et il peut également se produire un échec de chargement. `app-config.js` fournit les options de configuration `loading` et `fail` pour gérer ces scénarios.

## loading - état de chargement

`loading` L'option de configuration est utilisée pour afficher du contenu pendant le chargement de la page, améliorant ainsi l'expérience utilisateur.

### Modèle de chaîne simple

La manière la plus simple est d'utiliser un modèle de chaîne de caractères :

```javascript
export const loading = "<div class='loading'>Chargement...</div>";
```

### Génération dynamique de fonctions

En utilisant des fonctions, vous pouvez générer dynamiquement des composants de chargement plus complexes : 

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>Chargement...</span>
  </div>`;
};
```

### Exemple de barre de progression

Voici un bel effet de chargement de barre de progression :

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

Cette barre de progression est implémentée :- Pendant le chargement de la page, la barre de progression augmente lentement de 0 % à 98 %
- Une fois la page chargée, la barre de progression atteint rapidement 100 % puis disparaît
- Utilisez des animations de transition fluides

### Animation de chargement personnalisée

**Animation de chargement rotative：**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**Chargement du squelette d’écran :**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - gestion des erreurs

`fail` l'élément de configuration est utilisé pour afficher un composant d'indication d'erreur lorsque le chargement de la page échoue.

### Utilisation de base

`fail` La fonction reçoit un paramètre d'objet, comprenant :- `src` - Adresse de la page d'erreur
- `error` - Objet d'information d'erreur

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>Échec du chargement de la page</h3>
    <p>Adresse: ${src}</p>
    <p>Erreur: ${error.message}</p>
    <button on:click="back()">Retour à la page précédente</button>
  </div>`;
};
```

### Exemple de gestion complète des erreurs

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">Échec du chargement de la page</h2>
    <p style="color: #666; margin-bottom: 20px;">Impossible de charger la page : ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      Message d'erreur : ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        Retour à la page précédente
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        Retour à l'accueil
      </button>
    </div>
  </div>`;
};
```

### Gestion des types d’erreurs

Peut afficher différentes invites en fonction de différents types d'erreurs :

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "Erreur inconnue";
  
  if (error.message.includes("404")) {
    errorMessage = "Page introuvable";
  } else if (error.message.includes("timeout")) {
    errorMessage = "Délai d'attente dépassé, veuillez vérifier votre connexion réseau";
  } else if (error.message.includes("network")) {
    errorMessage = "Erreur réseau, veuillez réessayer plus tard";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>Une erreur est survenue</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">Retour</button>
  </div>`;
};
```

## Exemple complet

<o-playground name="Exemple de chargement et de gestion d'erreurs" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    // Configuration des animations de transition de page
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>Échec du chargement de la page</h3>
        <p>Adresse : ${src}</p>
        <p>Erreur : ${error.message}</p>
        <button on:click="back()">Revenir à la page précédente</button>
      </div>`;
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
      <br><br>
      <a href="./not-exist.html" olink>Go to Not Exist Page</a>
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

