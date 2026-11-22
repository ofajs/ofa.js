# parent

Using the `parent` property, you can get the parent element instance of an instance.

<o-playground name="parent - parent element" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent is the ul element
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>

