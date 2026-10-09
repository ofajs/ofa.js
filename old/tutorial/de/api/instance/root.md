# root



Mit dem Attribut `root` kann der Wurzelknoten eines Elements abgerufen werden.

Auf der Seite ist der Wurzelknoten eines gewöhnlichen Elements immer eine Instanz von `document`.

<o-playground name="root - Stammknoten" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">Ich bin das Ziel</li>
      </ul>
      <div id="logger" style="padding:16px;color:green;"></div>
      <script>
        setTimeout(()=>{
          $('#logger').text = $("#target").root.ele === document;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Elemente innerhalb eines Schattenknotens

Da die Elemente innerhalb der Komponente von der äußeren Umgebung isoliert sind, ist die `root`-Eigenschaft der Elemente innerhalb des Shadow-Knotens der Shadow-Root-Knoten.


<o-playground name="root - Schattenknoten" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-root.html"></l-m>
      <test-root></test-root>
      <script>
        setTimeout(()=>{
          $("test-root").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-root.html" active>
    <template component>
        <ul>
            <li>item 1</li>
            <li id="target">item 2</li>
            <li>item 3</li>
        </ul>
        <h3>Logger1:</h3>
        <div id="logger1" style="color:red;">{{l1}}</div>
        <h3>Logger2:</h3>
        <div id="logger2" style="color:green;">{{l2}}</div>
        <script>
            export default {
                tag:"test-root",
                data:{
                    l1:"",
                    l2:""
                },
                ready(){
                    this.l1 = this.shadow.$("#target").root === this.shadow;
                    this.l2 = this.root.ele === document;
                }
            };
        </script>
    </template>
  </code>
</o-playground>

