# Elemento hijo

Obtener la instancia de un elemento secundario es muy sencillo; solo necesitas tratar la instancia como un arreglo y acceder a la instancia de su elemento secundario mediante un índice numérico.

<o-playground name="children" style="--editor-height: 380px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="color:red;"></div>
      <div id="logger2" style="color:blue;"></div>
      <script>
        setTimeout(()=>{
          $("#logger1").text = $('ul').length;
          $("#logger2").text = $('ul')[1].text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## length



Obtener el número de elementos hijos del elemento objetivo, como se muestra en el ejemplo anterior:

```javascript
$("#logger1").text = $('ul').length;
```