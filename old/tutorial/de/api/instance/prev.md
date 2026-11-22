# prev



Mit dem `prev`-Attribut können Sie die vorherige, benachbarte Elementinstanz abrufen.

<o-playground name="prev - vorheriges Element" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">Ich bin 1</li>
        <li id="target">Ich bin Ziel</li>
        <li>Ich bin 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').prev.text = "ändere das vorherige Element des Ziels";
          \$("#logger1").text = \$('#first') === $('#target').prev
        },500);
      </script>
    </template>
  </code>
</o-playground>

