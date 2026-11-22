# html



`html` メソッドは、対象要素の内部のHTMLコードを取得または設定するために使用されます。

<o-playground name="html - 直接使用" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">target 1</span>
      </div>
      <div id="target2">origin text</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">new text</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

`html` は比較的危険な方法であり、`script` に埋め込まれると内部の JavaScript コードが自動的に実行されるため、使用時には XSS に注意してください。

## テンプレート構文方式での使用

あなたはまた `:html` 属性を使用して、ターゲット要素に対応するHTML値を設定することができます。これはコンポーネントのレンダリングに特に便利です。

<o-playground name="html - テンプレート構文" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>change txt from outside</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>Rendered html:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>change txt</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

