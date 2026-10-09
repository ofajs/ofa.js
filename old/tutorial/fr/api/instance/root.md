# root



L'utilisation de l'attribut `root` permet d'obtenir le nœud racine de l'élément.

Sur la page, le nœud racine des éléments ordinaires est toujours l'instance de `document`.

<o-playground name="root - nœud racine" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">I am target</li>
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

## Éléments dans les nœuds fantômes

Comme les éléments à l'intérieur du composant sont isolés de l'environnement extérieur, la propriété `root` d'un élément à l'intérieur d'un nœud fantôme est le nœud racine fantôme.


<o-playground name="root - nœud fantôme" style="--editor-height: 600px">
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
        <h3>logger1:</h3>
        <div id="logger1" style="color:red;">{{l1}}</div>
        <h3>logger2:</h3>
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

