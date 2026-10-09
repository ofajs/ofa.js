# unwrap



El método `unwrap` se utiliza para eliminar el elemento de envoltura externo del elemento objetivo.

<o-playground name="unwrap - eliminar envoltura" style="--editor-height: 440px">
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

## Notas importantes

El elemento objetivo **debe tener un nodo padre**, de lo contrario no se puede realizar la operación unwrap.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // Error, no hay elemento padre, no se puede usar unwrap
$el.$('#target').unwrap(); // Correcto, elimina el elemento que envuelve
```

Cuando el elemento objetivo tiene otros elementos hermanos, tampoco se puede ejecutar unwrap.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>Soy hermano</div>
</div>
`);

$el.$('#target').unwrap(); // Error, porque tiene otros nodos adyacentes
```

**Tenga en cuenta, no opere dentro de los componentes de plantilla como o-fill o o-if.**