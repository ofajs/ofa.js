# Comprendre la liaison des propriétés

Dans le contenu précédent, nous avons présenté brièvement la méthode de base de la [liaison de propriétés](./property-binding.md). L’exemple précédent servait à lier l’attribut `value` d’un élément natif du navigateur (comme `textarea`). Cette section approfondira l’essence de la liaison de propriétés : il s’agit en réalité de lier une propriété JavaScript après l’instanciation du composant, et non un attribut HTML.

## Mécanisme de liaison des propriétés du composant

Dans ofa.js, lorsque nous utilisons la syntaxe `:toProp="fromProp"` dans le composant parent, nous définissons la propriété JavaScript de l’instance du composant enfant, et non un attribut HTML. Cela diffère de la définition directe d’un attribut HTML (comme `attr:toKey="fromKey"`), et cette distinction est importante.

L'exemple ci-dessous montre comment transmettre des données à un composant personnalisé via la liaison de propriétés :

<o-playground name="Compréhension de la liaison des propriétés" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple :- La donnée `val` du composant parent est liée à la propriété `fullName` du composant enfant `<demo-comp>`
- La syntaxe `:full-name="val"` est utilisée pour transmettre la valeur de `val` du composant parent à la propriété `fullName` du composant enfant
- Après avoir reçu cette valeur, le composant enfant l'affiche dans le template via `{{fullName}}`

## Liaison de propriétés vs héritage de propriétés caractéristiques

Il convient de noter que la liaison de propriété (`:`) et l’héritage des attributs de caractéristique (`attr:`) présentent les différences clés suivantes :

### Liaison de propriété (`:`)

- Propriétés JavaScript liées à l’instance du composant
- Les données transmises conservent leur type d’origine (chaîne, nombre, booléen, etc.)
- Accessibles et modifiables directement à l’intérieur du composant, sans même avoir à définir au préalable `data` dans le composant

### Héritage des attributs de caractéristiques (`attr:`)

- Définir des attributs HTML
- Toutes les valeurs sont converties en chaînes de caractères
- Principalement utilisé pour transmettre des attributs aux éléments DOM sous-jacents
- Nécessite un traitement spécial pour analyser les données complexes
- Il est nécessaire de définir `attrs` à l'intérieur du composant à l'avance pour pouvoir recevoir les valeurs d'attribut

Comparaison grammaticale :```html
<!-- Liaison de propriété : transmettre des valeurs JavaScript, en conservant le type de données -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Héritage d'attributs : définir des attributs HTML, toutes les valeurs sont converties en chaînes -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- en pratique, la chaîne de caractères "42" est transmise -->
```

## Comparaison des différences des cas

<o-playground name="Comparaison des différences de cas" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

où `vone` est une propriété de l'instance du composant, `vtwo` est un attribut HTML, la valeur de l'attribut sera sélectionnée par le sélecteur `[vtwo]` et un style lui sera appliqué, tandis que `vone` est une propriété de l'instance du composant et ne sera pas sélectionnée par le sélecteur `[vone]`.

## Liaison de données bidirectionnelle

Une fois instancié, le composant prend également en charge la liaison de données bidirectionnelle via la syntaxe `sync:toProp="fromProp"`. Cette liaison bidirectionnelle permet la synchronisation des données entre le composant parent et le composant enfant ; lorsque les données changent d’un côté, l’autre côté se met à jour en conséquence.

> Contrairement à Angular et Vue, ofa.js prend en charge nativement la syntaxe de liaison de données bidirectionnelle sans nécessiter de configuration spéciale ou d'opérations supplémentaires pour les composants.

### Exemple de liaison bidirectionnelle

L'exemple suivant montre comment établir une liaison de données bidirectionnelle entre un composant parent et un composant enfant :

<o-playground name="Exemple de liaison bidirectionnelle" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Valeur dans le composant parent: {{val}}</h3>
      <p>Modifier la valeur du composant parent via la zone de saisie :</p>
      <input type="text" sync:value="val" placeholder="Saisissez du texte dans la zone de saisie...">
      <p>Modifier la valeur du composant parent via le composant enfant :</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Valeur affichée dans le composant enfant : {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="Saisissez dans la zone de saisie du composant enfant...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple :- La propriété `val` du composant parent et la propriété `fullName` du composant enfant sont liées de manière bidirectionnelle via `sync:full-name="val"`
- Lorsque l'utilisateur saisit du contenu dans la zone de saisie du composant parent, le composant enfant affiche immédiatement la nouvelle valeur
- Lorsque l'utilisateur saisit du contenu dans la zone de saisie du composant enfant, le composant parent est également mis à jour immédiatement

### Différence entre la liaison bidirectionnelle et la liaison de propriété normale

| Caractéristique | Liaison de propriété normale (`:`) | Liaison bidirectionnelle (`sync:`) |
|------|-------------------|-------------------|
| Flux de données | Unidirectionnel : parent → enfant | Bidirectionnel : parent ↔ enfant |
| Syntaxe | `:prop="value"` | `sync:prop="value"` |
| Modification par l'enfant | N'affecte pas le parent | Affecte le parent |
| Cas d'utilisation | Parent transmet une configuration à l'enfant | Nécessite la synchronisation des données entre parent et enfant |### Remarques

1. **Considérations de performance** : la liaison bidirectionnelle déclenche un nouveau rendu lorsque les données changent ; elle doit être utilisée avec prudence dans des scénarios complexes  
2. **Contrôle du flux de données** : trop de liaisons bidirectionnelles peuvent rendre le flux de données difficile à suivre ; il est conseillé de concevoir rationnellement les modes de communication entre composants  
3. **Compatibilité des composants** : tous les composants ne sont pas adaptés à la liaison bidirectionnelle ; l’objectif de conception du composant doit être pris en compte