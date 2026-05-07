# Propriétés de l'objet retourné par le module

Dans ofa.js, que ce soit pour les modules de page ou de composant, il est nécessaire de retourner un objet via `export default async () => {}` pour définir la configuration et le comportement du module. Ce document répertorie toutes les propriétés que l'objet retourné peut contenir.

## Paramètres de la fonction async

La fonction asynchrone dans `export default async () => {}` reçoit un objet paramètre avec les propriétés suivantes：

### Liste des paramètres

| Paramètre | Type | Module de page | Module de composant | Description |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | Fonction pour charger d'autres modules ou ressources |
| `url` | `string` | ✅ | ✅ | Adresse du fichier de la page actuelle ou du module de composant |
| `query` | `object` | ✅ | ❌ | Objet des paramètres de requête de l'URL |### paramètre load

`load` est une fonction utilisée pour charger d'autres modules, composants ou ressources. Elle peut être utilisée à la fois dans les modules de composants et les modules de pages. L'effet de chargement de la fonction `load` est cohérent avec celui du composant `<l-m>`, principalement utilisé pour charger des fichiers HTML de pages ou de composants ofa.js.

**Chargement synchrone** : utilise le mot-clé `await`, bloque l'exécution jusqu'à ce que le module soit chargé.

```javascript
export default async ({ load }) => {
  const { someModule } = await load("./some-module.js");
  const component = await load("./my-component.html");
  
  return {
    data: {
      moduleData: someModule
    }
  };
};
```

**Chargement asynchrone** : n'utilise pas le mot-clé `await`, renvoie un objet Promise, ne bloque pas l'exécution. Convient aux scénarios de chargement à la demande.

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('Module chargé :', someModule);
  });
  
  return {
    data: {}
  };
};
```

Scénarios d'utilisation :- Charger les composants de manière synchrone pour garantir qu'ils sont enregistrés avant utilisation
- Charger le module de données partagées
- Charger le fichier de configuration
- Le chargement asynchrone est adapté aux scénarios de chargement à la demande

> Remarque :
> - L'utilisation de `await` avec le chargement synchrone bloquera l'exécution, il est conseillé de choisir entre synchrone et asynchrone selon les besoins réels
> - S'il n'y a pas de besoin de chargement à la demande, il est recommandé d'utiliser directement la balise `<l-m>` pour charger le composant

### Paramètres d'URL

Le paramètre `url` est disponible à la fois dans les modules de page et de composant, il représente l'adresse du fichier du module actuel.

```javascript
export default async ({ url }) => {
  console.log('Adresse du module actuel :', url);
  
  return {
    data: {
      moduleUrl: url
    }
  };
};
```

### paramètre query

Le paramètre `query` est uniquement disponible dans les modules de page et contient les paramètres de requête de l'URL. Via l'objet `query`, vous pouvez accéder directement aux paramètres de la chaîne de requête de l'URL.

```javascript
export default async ({ query }) => {
  console.log('Paramètres de requête:', query);
  
  return {
    data: {
      userId: query.id,
      page: query.page || 1
    }
  };
};
```

Exemple d'utilisation :

```html
<template page>
  <style>
    :host { display: block; padding: 20px; }
  </style>
  <div>
    <h1>Détails de l'utilisateur</h1>
    <p>ID utilisateur: {{userId}}</p>
    <p>Page: {{page}}</p>
  </div>
  <script>
    export default async ({ query }) => {
      return {
        data: {
          userId: query.id || 'Inconnu',
          page: query.page || '1'
        }
      };
    };
  </script>
</template>
```

Méthode d'accès :```html
<o-page src="./user.html?id=123&page=2"></o-page>
```

> Important : n'utilisez pas la méthode similaire à Vue `this.$route.query` pour obtenir les paramètres de requête, ofa.js ne prend en charge que l'obtention via les paramètres de fonction.

### Exemple complet des paramètres

```javascript
export default async ({ load, url, query }) => {
  const { config } = await load("./config.js");
  
  return {
    data: {
      configData: config,
      moduleUrl: url,
      queryParams: query
    },
    ready() {
      console.log('Module URL:', url);
      console.log('Paramètres de requête:', query);
    }
  };
};
```

## Aperçu des propriétés de retour

| Propriété | Type | Module de page | Module de composant | Description | Documentation associée |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ Obligatoire | Nom de balise du composant | [Créer un composant](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | Objet de données réactif | [Réactivité des propriétés](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | Définition des attributs du composant | [Héritage des attributs](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | Méthodes et propriétés calculées | [Propriétés calculées](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | Observateur | [Observateurs](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | Appelé lorsque le DOM est créé | [Cycle de vie](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | Appelé lors du montage dans le DOM | [Cycle de vie](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | Appelé lors du retrait du DOM | [Cycle de vie](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | Appelé lorsque le chargement est terminé | [Cycle de vie](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ Page parente | ❌ | Appelé lors du changement de route | [Pages imbriquées / Routes](../../documentation/nested-routes.md) |> **Export spécial** : `export const parent = "./layout.html"` - utilisé pour le routage imbriqué, spécifie le chemin de la page parent (pas dans l'objet retourné). Voir [Pages/routage imbriqués](../../documentation/nested-routes.md).

## Attributs fondamentaux

### tag



`tag` est le nom de balise du composant, **le module composant doit définir cette propriété**. Le module page n'a pas besoin de définir `tag`.

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> Note : La valeur de `tag` doit correspondre au nom du tag utilisé lors de l'utilisation du composant.

### data



`data` est un objet de données réactif utilisé pour stocker les données d'état d'un composant ou d'une page. Lorsque les données changent, la vue est automatiquement mise à jour.

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "Zhang San",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> Remarque : `data` est un objet et non une fonction, contrairement au framework Vue.

### attrs



`attrs` est utilisé pour définir les propriétés du composant, recevant les données passées de l'extérieur. Seul le module du composant a besoin de définir `attrs`.

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // Pas de valeur par défaut
      disabled: "",     // A une valeur par défaut
      size: "medium"    // A une valeur par défaut
    }
  };
};
```

Lors de l'utilisation du composant, passez des attributs：

```html
<my-component title="Titre" disabled size="large"></my-component>
```

> Règles importantes :
> - La valeur de l'attribut transmis doit être une chaîne de caractères. Si ce n'est pas une chaîne, elle sera automatiquement convertie en chaîne.
> - Conversion de nom : `fullName` → `full-name` (format kebab-case)
> - Les clés de `attrs` et de `data` ne peuvent pas être dupliquées

### proto



`proto` est utilisé pour définir des méthodes et des propriétés calculées. Les propriétés calculées sont définies à l’aide des mots-clés JavaScript `get` et `set`.

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // Définition de méthode
      increment() {
        this.count++;
      },
      
      // Propriété calculée (getter)
      get doubleCount() {
        return this.count * 2;
      },
      
      // Propriété calculée
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

> Attention : ofa.js utilise les mots-clés `get`/`set` pour définir les propriétés calculées, et non l'option `computed` de Vue.

### watch



`watch` est utilisé pour définir un observateur, écouter les changements de données et exécuter la logique correspondante.

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // Surveiller une seule propriété
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // Surveiller plusieurs propriétés
      "count,name"() {
        console.log('count ou name a changé');
      }
    }
  };
};
```

La fonction de rappel du listener reçoit deux paramètres :- `newValue` : nouvelle valeur après modification
- `{ watchers }` : tous les objets observateurs du composant actuel

## Crochets de cycle de vie

Les hooks de cycle de vie vous permettent d’exécuter une logique spécifique à différentes étapes du composant.

### ready



Le hook `ready` est appelé lorsque le composant est prêt. À ce stade, le template du composant a été rendu, les éléments DOM ont été créés, mais ils n'ont peut-être pas encore été insérés dans le document.

```javascript
ready() {
  console.log('Le DOM a été créé');
  this.initDomElements();
}
```

### attached



Le hook `attached` est appelé lorsque le composant est inséré dans le document, indiquant que le composant a été monté sur la page.

```javascript
attached() {
  console.log('Monté dans le DOM');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached



`detached` est appelé lorsque le composant est retiré du document, indiquant qu'il va être démonté.

```javascript
detached() {
  console.log('Retiré du DOM');
  clearInterval(this._timer);
}
```

### loaded



Le hook `loaded` se déclenche une fois que le composant, tous ses sous-composants et les ressources asynchrones sont complètement chargés.

```javascript
loaded() {
  console.log('complètement chargé');
}
```

### routerChange



Le hook `routerChange` est appelé lorsque la route change, il est uniquement utilisé pour que la page parente écoute les changements de page enfant.

```javascript
routerChange() {
  this.refreshActive();
}
```

## Ordre d'exécution du cycle de vie

```
ready → attached → loaded
                 ↓
              detached（lors du retrait）
```

## Export spécial：parent

`parent` est utilisé pour les routes imbriquées, spécifiant le chemin de la page parent de la page actuelle. Il s'agit d'une exportation indépendante, qui ne fait pas partie de l'objet retourné.

```html
<template page>
  <style>:host { display: block; }</style>
  <div>Contenu de la sous-page</div>
  <script>
    // Spécifier la page parent
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## Exemple complet

### Module des composants

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>Compteur: {{count}}</p>
    <p>Double: {{doubleCount}}</p>
    <button on:click="increment">Incrémenter</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "Titre par défaut"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count modifié:', newVal);
          }
        },
        ready() {
          console.log('Composant prêt');
        },
        attached() {
          console.log('Composant attaché');
        },
        detached() {
          console.log('Composant détaché');
        }
      };
    };
  </script>
</template>
```

### Modules de page

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('Page prête');
        },
        
        attached() {
          console.log('Page montée');
          console.log('Paramètres de requête:', query);
        },
        
        detached() {
          console.log('Page démontée');
        }
      };
    };
  </script>
</template>
```

## Erreurs courantes

### 1. Clés en double entre attrs et data

```javascript
// ❌ Erreur
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // Duplication avec attrs
};

// ✅ Correct
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // Utiliser une clé différente
};
```

### 2. Utiliser le style Vue pour définir des propriétés calculées

```javascript
// ❌ Erreur
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ Correct
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data défini comme une fonction

```javascript
// ❌ Erreur
return {
  data() {
    return { count: 0 };
  }
};

// ✅ Correct
return {
  data: {
    count: 0
  }
};
```

### 4. Emplacement incorrect de la définition de méthode

```javascript
// ❌ Erreur
return {
  methods: {
    handleClick() {}
  }
};

// ✅ Correct
return {
  proto: {
    handleClick() {}
  }
};
```