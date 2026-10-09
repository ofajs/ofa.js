# clone

Using the `clone` method, you can clone and generate a copy of an element instance.

<o-playground name="clone - clone element" style="--editor-height: 320px">
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

