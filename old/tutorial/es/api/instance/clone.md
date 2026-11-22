# clone



El uso del método `clone` permite clonar y generar una copia de una instancia de elemento.

<o-playground name="clone - clonar elemento" style="--editor-height: 320px">
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

