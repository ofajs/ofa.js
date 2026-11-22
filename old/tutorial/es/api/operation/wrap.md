# wrap



El método `wrap` se utiliza para envolver una capa de elemento alrededor del elemento objetivo. Antes de ejecutar la operación `wrap`, se ejecuta automáticamente la inicialización del método [$](../instance/dollar.md), por lo que se pueden especificar directamente cadenas de elementos u objetos concretos.

<o-playground name="wrap - elemento envolvente" style="--editor-height: 440px">
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

## Notas importantes

El elemento objetivo **debe tener un nodo padre**, de lo contrario la operación de envoltura fallará.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // Error, no hay elemento padre, no se puede envolver
$el.$('#target').wrap("<div>new div</div>"); // Correcto, hay elemento padre
```

**Tenga en cuenta, no opere dentro de los componentes de plantilla como o-fill o o-if.**