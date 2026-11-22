# $

La méthode `$` est la fonction centrale d'ofa.js, utilisée pour obtenir et manipuler des instances d'éléments DOM. Voici une présentation détaillée des principales fonctionnalités de `$` :

## Obtenir une instance d'élément

En utilisant la méthode `$` , vous pouvez obtenir la première instance d'élément sur la page qui correspond au [sélecteur CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) et effectuer des opérations dessus. Voici un exemple :

<o-playground name="$ - obtenir l'élément">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans l'exemple ci-dessus, nous avons utilisé le symbole `$` pour sélectionner l'instance de l'élément ayant l'`id` "target1", et nous avons modifié son contenu textuel en définissant la propriété `text`.

## Exemple de recherche d'élément enfant

L'instance possède également la méthode `$`, qui permet d'obtenir, via la méthode `$` de l'instance, la première instance d'élément enfant correspondant aux critères.

<o-playground name="$ - Rechercher les éléments enfants">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

Ne veuillez pas insérer directement l'instance d'élément obtenue dans un autre endroit, car une telle opération affectera l'élément d'origine. Si vous devez créer une copie, vous pouvez utiliser la méthode [clone](./clone.md).

<o-playground name="$ - Caractéristiques d'instance" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Obtenir les éléments enfants dans le nœud fantôme

On peut obtenir une instance via la propriété [shadow](./shadow.md), puis obtenir l'élément souhaité via la méthode `$`.

```javascript
$('my-component').shadow.$("sélecteur").méthode(xxx)
```

## Instanciation directe d'éléments

Vous pouvez initialiser un élément natif directement en tant qu’instance de `$` de la manière suivante :

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

Ainsi, vous pouvez facilement convertir les éléments HTML existants en instances `$` afin d'utiliser les fonctionnalités fournies par `$` pour les manipuler et les traiter.

## Générer une instance d'élément

En dehors de cela, `$` qui permet d'obtenir une instance d'élément existante peut également être utilisé pour créer une nouvelle instance d'élément et l'ajouter à la page.

### Génération via chaîne de caractères

Vous pouvez utiliser la fonction `$` pour créer une nouvelle instance d’élément à partir d’une chaîne, comme suit :

<o-playground name="$ - génération de chaîne" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">ajouter le texte cible 1</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la fonction `$` pour créer une nouvelle instance d'élément avec un style et un contenu textuel spécifiés, et l'ajoutons à l'intérieur d'une instance d'élément existante avec l'`id` "target1".

### Génération via objet

Vous pouvez également utiliser la fonction `$` pour générer une nouvelle instance d’élément sous forme d’objet, comme suit :

<o-playground name="$ - Génération d'objet" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "ajouter le texte target 1",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la fonction `$` pour définir une nouvelle instance d'élément via un objet, comprenant le type de balise, le contenu textuel et les attributs de style, et nous l'ajoutons à une instance d'élément existante avec l'`id` "target1".

## Relation entre les exemples obtenus et les instances de page/composant

La méthode `$` permet d'obtenir l'instance de la page ou d'un élément du composant depuis le contexte global ; elle possède la même fonctionnalité que le `this` utilisé dans les méthodes du cycle de vie du module de page ou de composant.

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => Exemple de composant OFAJS
  },300);
</script>
```

```html
<!-- test-comp.html -->
 <template component>
  <div>
    <p>{{title}}</p>
  </div>
  <script>
    export default async ({ load }) => {
      return {
        tag: "test-comp",
        data: {
          title: "Exemple de composant OFAJS",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
 </template>
```