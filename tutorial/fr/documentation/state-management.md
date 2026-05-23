# Gestion d'état

## Qu'est-ce que l'état

Dans ofa.js, **l'état** désigne l'attribut `data` propre au composant ou au module de page. Cet état ne peut être utilisé que dans le composant actuel, pour stocker et gérer les données internes de ce composant.

Lorsque plusieurs composants ou pages doivent partager les mêmes données, l'approche traditionnelle consiste à les transmettre via des événements ou des props de manière hiérarchique, ce qui, dans les applications complexes, rend le code difficile à maintenir. Il est donc nécessaire d'utiliser une **gestion d'état** — en définissant un objet d'état partagé, permettant à plusieurs composants ou modules de page d'accéder et de modifier ces données, réalisant ainsi le partage de l'état.

> **Indice** : La gestion d'état est adaptée aux scénarios nécessitant le partage de données entre composants et pages, tels que les informations utilisateur, le panier d'achat, la configuration du thème, la configuration globale, etc.

## Générer un objet d'état

Créez un objet d'état réactif via `$.stanz({})`. Cette méthode prend un objet ordinaire comme données initiales et renvoie un proxy d'état réactif.

### Utilisation de base (État global)

<o-playground name="Exemple de gestion d'état" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Adresse de la page d'accueil de l'application
    export const home = "./list.html";
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
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "Pete",
        info: "Chaque jour est un nouveau début, le soleil brille toujours après l'orage.",
    },{
        id: 10020,
        name: "Mike",
        info: "La vie est comme l'océan, seuls les hommes à la volonté forte atteignent l'autre rive.",
    },{
        id: 10030,
        name: "John",
        info: "Le secret du succès est de persévérer dans ses rêves et de ne jamais abandonner.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>Carnet d'adresses</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Nom : {{$data.name}} <button on:click="$host.gotoDetail($data)">Détail</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // Lors de la destruction du composant, vider les données d'état montées
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Retour</button> </div>
      <div class="user-info">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">
        Nom d'utilisateur : 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">ID utilisateur : {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // Lors de la destruction du composant, vider les données d'état montées
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Propriétés de l'objet d'état

### 1. Mises à jour réactives

`$.stanz()` crée un objet d'état réactif. Lorsque les données d'état changent, tous les composants qui référencent ces données sont automatiquement mis à jour.

```javascript
const store = $.stanz({ count: 0 });

// Dans le composant
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // Tous les composants qui font référence à store.count seront automatiquement mis à jour
    },
  },
  attached() {
    // Référence directe à la propriété de l'objet d'état
    this.store = store;
  },
  detached() {
    this.store = {}; // Lorsque le composant est détruit, effacez les données d'état montées
  },
};
```

### 2. Réactivité en profondeur

L'objet d'état prend en charge la réactivité profonde, les changements dans les objets imbriqués et les tableaux sont également surveillés.

```javascript
const store = $.stanz({
  user: {
    name: "ZhangSan",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// La modification de propriétés imbriquées déclenchera également la mise à jour
store.user.name = "LiSi";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "New Task" });
```

## Meilleures pratiques

### 1. Montage de l'état dans la phase attached du composant

Il est recommandé de monter l'état partagé dans le cycle de vie `attached` du composant :

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // Monter l'état partagé sur les données du composant
    this.list = data.list;
  },
  detached() {
    // Lorsque le composant est détruit, effacer les données d'état montées pour éviter les fuites de mémoire
    this.list = [];
  },
};
```

### 2. Gérer raisonnablement la portée de l'état

La portée d'un état dépend de **l'emplacement de sa définition et de la manière dont il est exporté** :

**État exporté via `export` dans un fichier JS indépendant** : état global, accessible et modifiable par toute l'application, utilisé après importation via `import` ou `load`.

```javascript
// boutique-utilisateur.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**État défini à l’intérieur d’une page ou d’un module composant** : état du module, utilisé uniquement en interne dans ce module.

```html
<template component>
  ...
  <script>
    const localStore = $.stanz({ total: 0 });

    export default async () => {
      return {
        data: {
          localStore: {}
        },
        attached() {
          this.localStore = localStore;
        },
        detached() {
          // Lorsque le composant est détruit, vider les données d'état montées
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## Gestion d'état au sein du module

<o-playground name="Exemple de gestion d'état dans le module" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">Ajouter un élément</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Ajouter le total du store</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // Lors de la destruction du composant, vider les données d'état montées
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Points d'attention

1. **Nettoyage de l'état**：Dans le cycle de vie `detached` du composant, nettoyez rapidement les références aux données d'état pour éviter les fuites de mémoire.

2. **Éviter les dépendances circulaires**：Ne créez pas de références circulaires entre les objets d'état, ce qui peut entraîner des problèmes dans le système réactif.

3. **Structures de données volumineuses**：Pour les grandes structures de données, envisagez d'utiliser des propriétés calculées ou une gestion fragmentée pour éviter des coûts de performance inutiles.

4. **Cohérence de l'état**：Dans les opérations asynchrones, veillez à la cohérence de l'état ; vous pouvez utiliser des transactions ou des mises à jour par lots pour garantir l'intégrité des données.