# next



En utilisant la propriété `next`, vous pouvez obtenir l'instance de l'élément adjacent suivant.

<o-playground name="next - élément suivant" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').next.text = "change target next element";
          \$("#logger1").text = \$('#first').next === $('#target')
        },500);
      </script>
    </template>
  </code>
</o-playground>

