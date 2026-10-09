# カスタムイベント

ofa.jsでは、組み込みのDOMイベントに加えて、カスタムイベントを作成して使用することで、コンポーネント間の通信を実現することもできます。カスタムイベントは、コンポーネント指向開発における重要なメカニズムであり、コンポーネントがメッセージや状態の変化を上位にブロードキャストすることを可能にします。

## emit 方法 - カスタムイベントをトリガーする

`emit` メソッドはカスタムイベントをトリガーし、コンポーネント内部の状態変化やユーザー操作を外部のリスナーに通知するために使用されます。

### 基本的な使い方

```javascript
// シンプルなカスタムイベントを発火
this.emit('custom-event');

// データ付きのカスタムイベントを発火
this.emit('data-changed', {
  data: {
    // カスタムデータ、必要に応じて任意の構造
    newValue: 100,
    oldValue: 50
  }
});
```

### emit メソッドパラメータ

`emit` メソッドは2つの引数を受け取ります：

1. **イベント名**：文字列。トリガーするイベントの名前を指定します。
2. **オプションオブジェクト**（オプション）：イベント設定オプションを含む
   - `data`：渡すデータ
   - `bubbles`：ブール値。イベントがバブリングするかどうかを制御します（デフォルトはtrue）
   - `composed`：ブール値。イベントがShadow DOMの境界を越えられるかどうかを制御します
   - `cancelable`：ブール値。イベントがキャンセル可能かどうかを制御します

そして上位の要素は`on`メソッド[（イベントバインディング）](./event-binding.md)を使ってこのカスタムイベントをリッスンできる。

### emit 使用例

<o-playground name="emit 使用例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">クリックしてイベントを発火</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'ボタンがクリックされました',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - イベントバブリング機構

`bubbles` プロパティは、イベントが親要素へとバブリング（上方向に伝播）するかどうかを制御します。`true` に設定すると、イベントは DOM ツリーに沿って上方向に伝播します。デフォルト値は `true` です。`false` に設定すると、イベントはバブリングしません。

### バブリングメカニズム詳解

- **デフォルトの動作**：`emit` によって発行されるイベントはデフォルトでバブリングが有効（`bubbles: true`）
- **バブリングパス**：イベントはトリガー要素から始まり、階層を上へ伝播する
- **バブリングの阻止**：イベントハンドラ内で `event.stopPropagation()` を呼ぶとバブリングを阻止できる

### バブル例

<o-playground name="カスタムイベント例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>外側コンテナ（バブリングイベントをリッスン）: {{bubbledEventCount}} 回</p>
      <p>内側コンポーネント（直接イベントをリッスン）: {{directEventCount}} 回</p>
      <p>受け取ったデータ: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">非バブリングイベントをトリガー</button>
      <button on:click="triggerBubblingEvent">バブリングイベントをトリガー</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // 非バブリングイベント、直接のリスナーのみがキャッチ
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: '非バブリングイベントがトリガーされました', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // バブリングイベント、親要素へ伝播する
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'バブリングイベントがトリガーされました', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Shadow DOM 境界を貫通

`composed` 属性は、イベントが Shadow DOM の境界を越えるかどうかを制御します。これは Web Components の開発において特に重要であり、デフォルト値は `false` です。

### 貫通メカニズム詳解

- **Shadow DOM の分離**：デフォルトでは、イベントは Shadow DOM の境界を越えられません
- **透過の有効化**：`composed: true` を設定すると、イベントが Shadow DOM の境界を越えられるようになります
- **使用シーン**：コンポーネントがホスト環境にイベントを送信する必要がある場合、`composed: true` を設定する必要があります

### 透過例

<o-playground name="カスタムイベントとデータのサンプル" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>イベントを監視: {{bubbledEventCount}} 回</p>
      <p>受信したデータ: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>イベントを監視: {{bubbledEventCount}} 回</p>
      <p>受信したデータ: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">非貫通イベントをトリガー</button>
      <button on:click="triggerComposedEvent">貫通イベントをトリガー</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // 非貫通イベント、直接のリスナーのみキャプチャされます
                this.emit('child-event', {
                  data: { type: 'non-composed', message: '非貫通イベントがトリガーされました', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // 貫通イベント、Shadow DOM 境界を越えます
                this.emit('child-event', {
                  data: { type: 'composed', message: '貫通イベントがトリガーされました', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

