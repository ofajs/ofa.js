# Composants non explicites

ofa.js intègre deux types de composants non explicites :

* Composants de rendu conditionnel : `x-if`, `x-else-if`, `x-else`
* Composants de remplissage : `x-fill`

La fonctionnalité de ces deux composants est identique à celle des composants `o-if` et `o-fill`, mais ils ne sont pas réellement rendus dans le DOM ; ils transmettent leurs éléments internes directement à la zone correspondante.

Par exemple：

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- Le style n'est pas rouge, car le composant o-if existe lui-même dans le DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- Le style est rouge, car le composant x-if n'est pas rendu dans le DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Composant non explicite" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* sélectionne les éléments .item de premier niveau en rouge */
            color:red;
        }
        /* nécessite de sélectionner les éléments .item à l’intérieur du composant o-if */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- le style n’est pas rouge, car le composant o-if existe dans le DOM -->
                <div class="item">ne s’affichera pas en rouge</div>
            </o-if>
            <x-if :value="true">
                <!-- le style est rouge, car le composant x-if n’est pas rendu dans le DOM -->
                <div class="item">s’affiche en rouge</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## Composant de rendu conditionnel x-if

`x-if` a exactement la même fonctionnalité que [o-if](./conditional-rendering.md) ; il sert à décider si le contenu doit être rendu ou non selon la valeur vraie ou fausse de l’expression conditionnelle. La différence est que `x-if` n’existe pas lui-même comme élément du DOM, son contenu interne est directement rendu dans le conteneur parent.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Bienvenue de retour, utilisateur !</p>
    </x-if>
</div>
```

`x-if` peut également être utilisé avec `x-else-if` et `x-else` :

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Panneau d'administration</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>Centre utilisateur</p>
    </x-else-if>
    <x-else>
        <p>Veuillez vous connecter</p>
    </x-else>
</div>
```

## x-fill composant de remplissage

`x-fill` a exactement la même fonction que [o-fill](./list-rendering.md) : il sert à rendre des données de tableau sous forme de multiples éléments DOM. Comme `x-if`, `x-fill` ne se rend pas lui-même dans le DOM ; son template interne est rendu directement dans le conteneur parent.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Exemple d'utilisation d'un template nommé :

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Description des performances

En plus des différences fonctionnelles, les composants non explicites ont des performances de rendre **nettement inférieures** à celles des composants explicites (`o-if`, `o-fill`). Cela tient au fait que les composants non explicites ne sont pas réellement rendus dans le DOM et nécessitent une logique de rendu simulé supplémentaire pour gérer le positionnement et la mise à jour des éléments internes.

De plus, les composants non explicites peuvent provoquer des bugs subtils : comme ils n'entrent pas vraiment dans le DOM, les opérations qui dépendent de la structure DOM (comme la liaison d'événements, le calcul de styles ou les requêtes de bibliothèques tierces) peuvent échouer ou se comporter de manière anormale.

Par conséquent, il est recommandé d’**utiliser en priorité les composants explicites** (`o-if`, `o-else-if`, `o-else`, `o-fill`) et de n’employer les composants non explicites que dans des cas précis.

## Scénarios d'utilisation

Bien que les composants non explicites aient des performances médiocres, ils peuvent être utilisés dans les scénarios suivants :

1. **Éviter les niveaux DOM supplémentaires** : lorsque vous ne voulez pas que les éléments `o-if` ou `o-fill` fassent partie de la structure DOM
2. **Héritage des styles** : lorsque vous avez besoin que les éléments internes héritent directement des styles du conteneur parent, sans être affectés par les éléments du composant intermédiaire
3. **Restrictions des sélecteurs CSS** : lorsque vous devez utiliser le sélecteur enfant direct du parent (par exemple `.container > .item`) pour contrôler précisément le style, mais que vous ne voulez pas d'éléments d'emballage supplémentaires entre eux