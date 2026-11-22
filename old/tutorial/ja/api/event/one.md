# one



`one` 方法を使用すると、ターゲット要素に1回限りのイベントハンドラを登録できます。つまり、イベントハンドラは初回トリガー後に自動的にバインドが解除され、二度とトリガーされなくなります。

以下は、`one`メソッドを使用してボタン要素にクリックイベントハンドラを登録する方法を示す例です：

<o-playground name="one - click 一度限りのイベント" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

この例では、`one` メソッドを使用してボタン要素にクリックイベントハンドラを追加しています。ユーザーがボタンをクリックすると、イベントハンドラがトリガーされますが、その後はバインドが解除されるため、再度トリガーされることはありません。

## テンプレート構文方式での使用

テンプレート構文を使用して、対象要素に一度限りイベントハンドラをバインドすることもできます。

<o-playground name="one - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
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

この例では、ボタン要素に `one:click` を使用して `addCount` というメソッドをバインドしています。ユーザーがボタンをクリックすると、このメソッドが呼び出されますが、その後は一度だけのイベントハンドラであるため、再度トリガーされることはありません。