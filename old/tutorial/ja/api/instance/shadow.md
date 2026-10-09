# shadow



`shadow` プロパティを使用すると、要素のシャドウルートノードインスタンスを取得できます。

<o-playground name="shadow - 影子ノード" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

注意すべき点は、テンプレート構文を持つ要素内でシャドウノード内の要素を直接変更しないことです。これにより、操作の一貫性と保守性を確保します。

## 外部からコンポーネントのシャドウ要素内の要素インスタンスを取得する

また、外部からカスタム要素のインスタンスを取得し、`shadow` プロパティを介してシャドウノード内の要素にアクセスすることもできます。以下に示します：

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - 外部アクセス" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = '外部からターゲットを変更 - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'ターゲットを変更';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

