# ele



Grâce à la propriété `ele`, vous pouvez obtenir l'[élément Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) réel de l'instance, et ainsi utiliser ses propriétés ou méthodes natives.

<o-playground name="ele - obtenir l'élément" style="--editor-height: 320px">
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

