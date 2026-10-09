# parent



En utilisant la propriété `parent`, vous pouvez obtenir l'instance de l'élément parent de l'instance.

<o-playground name="parent - élément parent" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent est l'élément ul
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>

