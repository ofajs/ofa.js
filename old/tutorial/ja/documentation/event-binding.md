# イベントバインディング

ofa.jsでは、イベントバインディングはユーザーインタラクションを実現する重要なメカニズムです。複数の方法で要素にイベントハンドラをバインドし、ユーザーの操作に応答することができます。

## protoからイベントをバインドする

これは推奨されるイベントバインディング方法であり、複雑なイベント処理ロジックに適しています。イベント処理関数を `proto` オブジェクトに定義することで、コードロジックをより良く整理でき、保守や再利用が容易になります。

<o-playground name="protoからのイベントバインド" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 関数を直接実行する

簡単な操作（カウンターの増加、状態の切り替えなど）については、イベント属性内で簡潔な式を直接記述できます。この方法は明瞭で、シンプルなロジックの処理に適しています。

<o-playground name="直接実行関数" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">クリックしてね - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## サポートされているイベントタイプ

ofa.js はすべての標準 DOM イベントをサポートしています。以下を含みますがこれに限定されません：

- マウスイベント：`click`、`dblclick`、`mousedown`、`mouseup`、`mouseover`、`mouseout` 等
- キーボードイベント：`keydown`、`keyup`、`keypress` 等
- フォームイベント：`submit`、`change`、`input`、`focus`、`blur` 等
- タッチイベント：`touchstart`、`touchmove`、`touchend` 等

ofa.js でサポートされているイベントタイプは、ネイティブ DOM イベントと完全に同じです。詳細については、[MDN イベントドキュメント](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) を参照してください。

## イベントハンドラにパラメータを渡す

イベントハンドラーにパラメータを渡すこともできます：

<o-playground name="イベントハンドラへのパラメータ渡し" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">5を加算 - 現在: {{count}}</button>
      <button on:click="addNumber(10)">10を加算 - 現在: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## イベントオブジェクトへのアクセス

イベントハンドラ内では、`event` パラメータを通じてネイティブイベントオブジェクトにアクセスできます。

<o-playground name="イベントオブジェクトへのアクセス" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">任意の位置をクリックして座標を表示</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

式の中で `$event` パラメータを使用してネイティブイベントオブジェクトにアクセスすることもできます。例えば、マウスクリックの座標を取得する場合：

```html
<div class="container" on:click="handleClick($event)">どこかをクリックして座標を表示</div>
```

## カスタムイベントのリッスン

ネイティブDOMイベントのリッスンに加えて、コンポーネントが発するカスタムイベントを簡単にリッスンすることもできます：

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

カスタムイベントの詳細については、[カスタムイベント](custom-events.md)のセクションを参照してください。チュートリアルの順序に従って段階的に進めることをお勧めします。以降の内容は自然に展開されます。もちろん、随時確認して事前に把握していただいても構いません。