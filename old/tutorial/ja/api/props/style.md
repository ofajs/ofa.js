# style



`style` 属性はネイティブと一貫性を保つ。

ご注意ください。`style` 属性はスタイルの実際の値を取得できず、`style` 属性で設定された値のみを取得できます。`style` メソッドは [css メソッド](./css.md) と似ていますが、全量のスタイルを上書きすることはできません。`css` と比較して、`style` メソッドの内部実行効率はより高くなっています。

以下は、`style`の使い方を示すサンプルです：

<o-playground name="style - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

`style` メソッドは `style` 属性の値を取得および設定するだけで、実際の計算されたスタイルではないことに注意してください。

## テンプレート構文方式での使用

テンプレート構文を使用して、ターゲット要素のスタイルを設定することもできます。

<o-playground name="style - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

