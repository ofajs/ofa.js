# nexts



Mit der `nexts`-Eigenschaft können Sie problemlos alle benachbarten Elementinstanzen hinter dem aktuellen Element abrufen, die als Array zurückgegeben werden.

<o-playground name="nexts - Nachfolgende Elemente" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

