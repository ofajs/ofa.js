# attr



Die Methode `attr` wird verwendet, um die Attribute eines Elements abzurufen oder festzulegen.

## Direkte Verwendung

Du kannst direkt die `attr`-Methode verwenden, um Attribute eines Elements zu erhalten oder zu setzen.

<o-playground name="attr - Direkte Verwendung" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div id="target1" test-attr="1">Ich bin Ziel 1</div>
      <div id="target2">Ich bin Ziel 2</div>
      <div id="logger" style="border:blue solid 1px;padding:8px;margin:8px;">logger</div>
      <script>
        $("#logger").text = $("#target1").attr('test-attr');
        setTimeout(()=> {
          $("#target1").attr('test-attr', '2')
          $("#logger").text = $("#target1").attr('test-attr');
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Verwendung der Vorlagensyntax

Du kannst auch die `attr:aaa="bbb"`-Methode verwenden, um das **aaa**-Attribut des Zielelements auf den Wert der Komponente **bbb** zu setzen. Diese Methode ist besonders nützlich für das Rendern von Komponenten.

<o-playground name="attr - Vorlagen-Syntax" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./attr-demo.html"></l-m>
      <attr-demo></attr-demo>
      <script>
        setTimeout(()=>{
          \$("attr-demo").txt = "2";
        },1000);
      </script>
    </template>
  </code>
  <code path="attr-demo.html" active>
    <template component>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div attr:test-attr="txt">Ich bin das Ziel</div>
      <script>
        export default {
          tag: "attr-demo",
          data: {
            txt: "1"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "2";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

