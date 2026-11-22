# clone



L'utilisation de la méthode `clone` permet de cloner et de générer une copie d'une instance d'élément.

<o-playground name="clone - élément cloné" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red;">I am target</div>
      <div>logger:</div>
      <div id="logger"></div>
      <script>
        setTimeout(()=>{
          const tar = $('#target').clone();
          \$('#logger').push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

