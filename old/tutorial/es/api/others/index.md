# index



`index` atributo se utiliza para obtener la posición del elemento dentro de su elemento padre. Esta posición se cuenta desde 0, es decir, el primer elemento tiene posición 0, el segundo 1, y así sucesivamente.

En el siguiente ejemplo, demostramos cómo usar la propiedad `index` para obtener la posición de un elemento dentro de su elemento padre:

<o-playground name="index - obtener posición" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero seleccionamos un elemento `<li>` con el `id` "target". Luego, usamos el atributo `index` para obtener la posición de ese elemento dentro de su elemento padre `<ul>`, que es el segundo elemento, por lo que el valor de `index` es 1. A continuación, mostramos este valor en el elemento `<div>` con el `id` "logger".