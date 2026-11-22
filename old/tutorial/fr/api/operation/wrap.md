# wrap



La méthode `wrap` sert à envelopper l’élément cible dans une couche d’éléments extérieurs. Avant l’exécution de l’opération `wrap`, l’initialisation de la méthode [$](../instance/dollar.md) est automatiquement effectuée, il est donc possible de renseigner directement une chaîne ou un objet d’élément spécifique.

<o-playground name="wrap - élément enveloppant" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>I am 1</div>
        <div id="target">I am 2</div>
        <div>I am 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Points d'attention

L'élément cible **doit avoir un nœud parent**, sinon l'opération d'encapsulation échouera.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // erreur, pas d'élément parent, impossible d'envelopper
$el.$('#target').wrap("<div>new div</div>"); // correct, il y a un élément parent
```

**Veuillez noter de ne pas manipuler à l’intérieur des composants de modèle tels que o-fill ou o-if.**