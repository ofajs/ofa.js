# ele



A través de la propiedad `ele`, puedes obtener el [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) real de la instancia, y así usar propiedades o métodos nativos.

<o-playground name="ele - obtener elemento" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">I am target</li>
      </ul>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=>{
          var ele = $("#target").ele;
          ele.innerHTML = '<b>change target</b>';
          \$("#logger").text = ele.clientWidth;
        },500);
      </script>
    </template>
  </code>
</o-playground>

