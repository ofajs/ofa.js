# css



`css` メソッドは、対象要素のスタイルを取得または設定するために使用されます。

## 直接使用

あなたは直接 `css` メソッドを使用して、要素のスタイルを取得または設定できます。

<o-playground name="css - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">元のテキスト</div>
      <br>
      <h4>ロガー</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## 全量設定

取得した `css` オブジェクトを使って、要素に直接 style 値を設定することができます。

<o-playground name="css - 全量設定" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

`css`オブジェクトの特性を利用することで、ターゲット要素のスタイルを素早く調整できます。

## テンプレート構文方式での使用

テンプレート構文を使用して、ターゲット要素のスタイルを設定することもできます。

<o-playground name="css - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">I am target</div>
      <script>
        export default {
          tag: "css-demo",
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

## CSS設定のコツ

`$ele.css = {...$ele.css, color:'red'}` という方法で、要素の特定のスタイルプロパティを変更でき、他のスタイルプロパティに影響を与えません。この方法では、スタイル全体を書き換えずに、1つのプロパティのみを変更できます。

### 例

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

上の例では、`{ ...myElement.css, color: 'red' }` を使用することで、要素の色のスタイルのみを変更し、他のスタイルプロパティはそのままにしています。これは便利なテクニックで、要素のスタイルを柔軟に変更できます。