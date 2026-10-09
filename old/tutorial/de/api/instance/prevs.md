# prevs



Mit der `prevs`-Eigenschaft können Sie problemlos alle benachbarten Elementinstanzen vor dem aktuellen Element abrufen, die als Array zurückgegeben werden.

<o-playground name="prevs - vorherige Elemente" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

