# index



Die `index`-Eigenschaft wird verwendet, um die Position eines Elements innerhalb seines übergeordneten Elements abzurufen. Diese Position wird ab 0 gezählt, d. h. das erste Element hat die Position 0, das zweite die Position 1 usw.

Im folgenden Beispiel zeigen wir, wie die Eigenschaft `index` verwendet wird, um die Position eines Elements innerhalb seines übergeordneten Elements zu erhalten:

<o-playground name="index - Position abrufen" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel wählen wir zunächst ein `<li>`-Element mit der `id` "target" aus. Dann verwenden wir die Eigenschaft `index`, um die Position dieses Elements innerhalb seines übergeordneten `<ul>`-Elements zu ermitteln, nämlich das zweite Element, also hat `index` den Wert 1. Dieser Wert wird dann im `<div>`-Element mit der `id` "logger" angezeigt.