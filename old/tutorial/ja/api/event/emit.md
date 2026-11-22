# emit



`emit` メソッドを使用すると、イベントを自発的にトリガーでき、トリガーされたイベントにはバブリングメカニズムがあります。バブリングメカニズムとは、イベントが内部要素から外部要素へ、内側から外側の階層に沿ってイベントをトリガーすることを意味します。

以下は、`emit` メソッドを使ってカスタムイベントを発火し、バブリング機構を利用して外側の要素にイベントを伝える例です：

<o-playground name="emit - イベントをトリガーする" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

この例では、`<ul>` 要素と `<li>` 要素にそれぞれ同じカスタムイベント `custom-event` のハンドラを登録しています。`emit` メソッドでイベントをトリガーすると、そのイベントが `<li>` 要素から `<ul>` 要素にバブリングし、2つのイベントハンドラが実行されます。

## カスタムデータ

`data` パラメータを指定することで、カスタムデータをイベントハンドラに渡すことができます：

<o-playground name="emit - カスタムデータ" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          私はターゲットです
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ulがトリガーされました;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'targetがトリガーされました;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"私はデータです"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

この例では、`data` パラメータを介してカスタムデータをイベントハンドラに渡しています。イベントハンドラは `event.data` を介して渡されたデータを取得できます。

## バブリングを発生させないイベント

イベントのバブリングを防ぎたい場合は、イベントをトリガーする際に `bubbles: false` パラメータを指定します：

<o-playground name="emit - バブルしない" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们使用 `bubbles: false` 参数触发了自定义事件。这个事件不会冒泡到上层元素，所以只有 `<li>` 元素的事件处理程序被触发。

## ルートノードの貫通

デフォルトでは、イベントはカスタムコンポーネントのシャドーDOMを貫通しません。しかし、`composed: true` を設定することで、カスタムイベントがルートノードを貫通し、ルートノードの外側の要素をトリガーさせることができます。

<o-playground name="emit - ルートノードを透過" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、カスタムコンポーネント `composed-test` を作成しました。このコンポーネントは、シャドウ DOM 内の要素と、イベントをトリガーするボタンを含んでいます。デフォルトでは、イベントはシャドウ DOM を越えてルートノードに到達しません。しかし、イベントをトリガーする際に `composed: true` パラメータを使用することで、イベントがルートノードまで透過し、ルートノード外の要素をトリガーするようにしています。