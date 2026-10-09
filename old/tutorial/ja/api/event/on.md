# on



使用 `on` 方法，你可以为目标元素注册事件处理程序。这使你能够轻松地捕获和响应用户的交互操作。

以下は、`on` メソッドを使用してボタン要素にクリックイベントハンドラを登録する方法を示す例です：

<o-playground name="on - click イベント" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

この例では、`on` メソッドを使用してボタン要素にクリックイベントハンドラを追加しています。ユーザーがボタンをクリックすると、イベントハンドラがトリガーされ、カウンターが増加し、その結果がページに表示されます。

## テンプレート構文方式での使用

テンプレート構文を使用して、ターゲット要素にメソッドをバインドすることもできます。

<o-playground name="on - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、ボタン要素に `on:click` を使って `addCount` というメソッドをバインドしています。ユーザーがボタンをクリックすると、このメソッドが呼び出され、カウンターの値が増加してページに表示されます。この方法により、イベントハンドラをコンポーネントのメソッドに関連付け、より複雑なインタラクションを実現できます。

## event



イベントを登録した後、トリガーされる関数にはeventが付与され、ネイティブと同様になります：

<o-playground name="on - event パラメータ" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

