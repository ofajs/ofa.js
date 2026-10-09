# unwrap



La méthode `unwrap` sert à supprimer l'élément d'emballage externe de l'élément cible.

<o-playground name="unwrap - supprimer l’enveloppe" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Points d'attention

L'élément cible **doit avoir un nœud parent**, sinon l'opération unwrap ne peut pas être exécutée.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // Erreur : pas d'élément parent, impossible de unwrap
$el.$('#target').unwrap(); // Correct : supprime l'élément englobant
```

Lorsque l'élément cible a d'autres éléments frères, il n'est pas non plus possible d'exécuter unwrap.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // Erreur, car il a d'autres nœuds adjacents
```

**Veuillez noter de ne pas manipuler à l’intérieur des composants de modèle tels que o-fill ou o-if.**