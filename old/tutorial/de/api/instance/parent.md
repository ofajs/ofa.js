# parent



Mit der Eigenschaft `parent` können Sie die übergeordnete Elementinstanz einer Instanz abrufen.

<o-playground name="parent - Elternelement" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent ist das ul-Element
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>

