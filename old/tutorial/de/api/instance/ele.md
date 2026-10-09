# ele



Über das `ele`-Attribut können Sie das tatsächliche [Element](https://developer.mozilla.org/de/docs/Web/API/Element) der Instanz abrufen und so auf native Eigenschaften oder Methoden zugreifen.

<o-playground name="ele - Element holen" style="--editor-height: 320px">
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

