# tag



`tag`-Attribut wird verwendet, um das Tag eines Elements zu erhalten und gibt eine Zeichenkette in Kleinbuchstaben zurück.

Im folgenden Beispiel zeigen wir, wie man die `tag`-Methode verwendet, um das Tag eines Elements zu erhalten:

<o-playground name="tag - Tag abrufen">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

