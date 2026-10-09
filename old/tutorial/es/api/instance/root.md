# root



Usar la propiedad `root` puede obtener el nodo raíz del elemento.

En la página, el nodo raíz de los elementos normales es siempre una instancia de `document`.

<o-playground name="root - nodo raíz" style="--editor-height: 320px">
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

## Elementos dentro de nodos de sombra

Dado que los elementos dentro del componente están aislados del entorno externo, el atributo `root` de los elementos dentro del nodo de sombra es el nodo raíz de sombra.


<o-playground name="root - nodo sombra" style="--editor-height: 600px">
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

