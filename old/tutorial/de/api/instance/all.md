# all



Mit der `all`-Methode kannst du alle Elemente auf der Seite abrufen, die dem CSS-Selektor entsprechen, und ein Array mit diesen Elementinstanzen zurückgeben.

<o-playground name="all - Alle Elemente abrufen" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$.all("li").forEach((item,index)=>{
            item.text = `Element ${index} ändern`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Untergeordnete Elemente abrufen

Instanzen besitzen ebenfalls die `all`-Methode; über die `all`-Methode der Instanz können untergeordnete Elemente ausgewählt und abgerufen werden.

<o-playground name="all - Holen Sie sich untergeordnete Elemente" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <ul>
          <li>I am 1</li>
          <li>I am 2</li>
          <li>I am 3</li>
        </ul>
      </div>
      <script>
        const tar = $("#target1");
        setTimeout(()=>{
          tar.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

