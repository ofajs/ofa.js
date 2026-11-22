# Injecter le style de l'hôte

Dans les Web Components, en raison des limitations des slots, il n'est pas possible de définir directement le style des éléments à plusieurs niveaux à l'intérieur d'un slot. Pour résoudre ce problème, ofa.js fournit le composant `<inject-host>`, qui permet d'injecter des styles dans l'élément hôte depuis l'intérieur du composant, permettant ainsi de contrôler le style des éléments à plusieurs niveaux dans le contenu du slot.

> Remarque : il est recommandé d'utiliser d'abord le sélecteur [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) pour styliser le contenu du slot. Utilisez le composant `<inject-host>` uniquement si cela ne répond pas aux besoins.

## Utilisation de base

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Définit le style des éléments enfants directs */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* Il est également possible de définir des styles pour plusieurs niveaux d'imbrication */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Cas

L'exemple ci-dessous montre comment utiliser `<inject-host>` pour styliser les éléments imbriqués dans un emplacement. Nous créons deux composants : le composant `user-list` comme conteneur de liste, et le composant `user-list-item` comme élément de liste. Grâce à `<inject-host>`, nous pouvons dans le composant `user-list` définir le style de `user-list-item` et de ses éléments internes.

<o-playground name="Injecter le style hôte" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Zhang San</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Li Si</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Âge : <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

On peut voir dans les résultats d'exécution :- La couleur de fond du composant `user-list-item` est aqua (définie via `<inject-host>` du composant `user-list`)
- La couleur du texte du nom est rouge (définie via `<inject-host>` du composant `user-list` en appliquant le style `user-list-item .item-name`)

## Principe de fonctionnement

`<inject-host>` composant injecte le contenu de la balise `<style>` qu'il contient dans l'élément hôte du composant. Ainsi, les règles de style injectées peuvent traverser les limites du composant et s'appliquer aux éléments à l'intérieur des slots.

De cette manière, vous pouvez :- Définir le style des éléments à n'importe quelle profondeur dans le contenu d'un emplacement (slot)
- Utiliser un chemin de sélecteur complet pour garantir que le style ne s'applique qu'à l'élément cible
- Maintenir l'encapsulation des styles des composants tout en réalisant une pénétration de style flexible

## Points d'attention

⚠️ **Risque de pollution de styles** : puisque les styles injectés s’appliquent au scope de l’élément hôte, ils peuvent affecter des éléments dans d’autres composants. Lors de l’utilisation, respectez impérativement les principes suivants :

1. **Utiliser des sélecteurs spécifiques** : Essayez d'utiliser des chemins de composants complets et évitez les sélecteurs trop génériques.
2. **Ajouter un préfixe d'espace de noms** : Ajoutez un préfixe unique à vos classes de style pour réduire les risques de conflit avec d'autres composants.
3. **Éviter d'utiliser des sélecteurs d'étiquettes génériques** : Préférez les sélecteurs de classes ou d'attributs aux sélecteurs d'étiquettes.
4. **Reconsidérer la conception du composant** : Réfléchissez à la possibilité d'éviter l'utilisation de `<inject-host>` en optimisant la conception du composant. Par exemple, l'utilisation de la combinaison du sélecteur [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) sur les composants enfants est souvent plus élégante.

```html
<!-- Recommandé ✅ : Utiliser un sélecteur spécifique -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- Non recommandé ❌ : Utiliser un sélecteur trop générique -->
<inject-host>
    <style>
        .content {  /* Risque de conflit avec d'autres composants */
            color: red;
        }
    </style>
</inject-host>
```

### Astuces de performance

Étant donné que `<inject-host>` déclenche une réinjection des styles de l'hôte, ce qui peut entraîner un réordonnancement ou un repeint des composants, veuillez l'utiliser avec prudence dans les scénarios où les mises à jour sont fréquentes.  
Si vous avez uniquement besoin de styliser les éléments de premier niveau dans le slot, privilégiez le sélecteur de pseudo-classe [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted), ce qui permet d'éviter les surcoûts de rendu supplémentaires liés à une injection pénétrante et d'obtenir de meilleures performances.