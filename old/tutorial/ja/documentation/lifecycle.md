# ライフサイクル

ofa.js コンポーネントは完全なライフサイクルフック関数を備えており、コンポーネントの異なる段階で特定のロジックを実行できます。これらのフック関数を使用すると、コンポーネントの作成、マウント、更新、破棄などの重要なタイミングで介入し、対応する操作を実行できます。

## ライフサイクルフック関数

ofa.jsは、以下の主要なライフサイクルフック関数を提供しており、一般的に使用される順に並べられています。

### attached



`attached` フックは、コンポーネントがドキュメントに挿入されたときに呼び出され、コンポーネントがページにマウントされたことを示します。これは最も一般的に使用されるライフサイクルフックであり、コンポーネントがページに実際に表示された後に実行する必要がある初期化操作を実行するために使用され、コンポーネントが表示されていないときに不要な計算を回避します。このフックは、コンポーネントがレンダリングされたページに依存する操作（要素のサイズ測定、アニメーションの起動など）にも適しています。

- **呼び出しのタイミング**: コンポーネントがDOMツリーに追加される
- **主な用途**: タイマーを起動する、イベントリスナーを追加する、可視性を必要とする操作を実行する

### detached



`detached` フックは、コンポーネントがドキュメントから削除される際に呼び出され、コンポーネントがアンマウントされる直前を示します。このフックは、タイマーのクリアやイベントリスナーの削除など、リソースのクリーンアップに適しています。

- **呼び出しタイミング**: コンポーネントがDOMツリーから削除されたとき
- **主な用途**: リソースのクリーンアップ、サブスクリプションの解除、イベントリスナーの削除

### ready



`ready` フックはコンポーネントの準備ができた時に呼び出されます。この時、コンポーネントのテンプレートはレンダリング完了し、DOM要素は作成されていますが、まだドキュメントに挿入されていない可能性があります。このフックはDOM操作やサードパーティライブラリの初期化に適しています。

- **呼び出しタイミング**: コンポーネントテンプレートのレンダリングが完了し、DOM が作成されたとき
- **主な用途**: DOM に依存する初期化処理を実行する

### loaded



`loaded` フックは、コンポーネントとそのすべての子コンポーネント、非同期リソースがすべて読み込まれた後にトリガーされ、この時点でローディング状態を安全に削除したり、完全なコンポーネントツリーに依存する後続の操作を実行したりできます。依存がなければ、`ready` フックの後に呼び出されます。

- **呼び出しタイミング**: コンポーネントとその子コンポーネントが完全に読み込まれた後
- **主な用途**: 完全なコンポーネントツリーに依存する操作の実行

## ライフサイクル実行順序

コンポーネントのライフサイクルフックは以下の順序で実行されます：

2. `ready` - コンポーネントが準備完了（DOM が作成された）
3. `attached` - コンポーネントが DOM にマウントされた
4. `loaded` - コンポーネントが完全に読み込まれた

コンポーネントがDOMから削除されると、`detached`フックが呼び出されます。

## 使用例

以下の例は、コンポーネント内でライフサイクルフック関数を使用する方法を示しています。

<o-playground name="ライフサイクル例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>ライフサイクルデモ</h3>
      <div class="counter">カウンター: {{count}}</div>
      <button on:click="count += 10">10増加</button>
      <button on:click="removeSelf">コンポーネント削除</button>
      <div class="log">
        <h4>ライフサイクルログ:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // DOMから自身を削除し、detachedフックをトリガー
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: コンポーネントが準備完了、DOMが作成されました");
              console.log("コンポーネントが準備完了");
            },
            attached() {
              this.addLog("attached: コンポーネントがDOMにマウントされました");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("コンポーネントがマウントされました");
            },
            detached() {
              this.addLog("detached: コンポーネントがDOMから削除されました");
              // タイマーをクリアしてメモリリークを防ぐ
              clearInterval(this._timer); 
              console.log("コンポーネントがアンロードされました");
            },
            loaded() {
              this.addLog("loaded: コンポーネントが完全に読み込まれました");
              console.log("コンポーネントが完全に読み込まれました");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、異なるライフサイクルフックの実行順序とタイミングを観察できます。「コンポーネントを削除」ボタンをクリックすると、`detached` フックがトリガーされることがわかります。

## 実際の応用シーン

### 初期化操作

`ready` フックでデータの初期化を行います：

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOMの操作
      this.initDomElements();
    }
  };
};
```

### リソース管理

`attached` フックでタイマーを起動し、`detached` フックでリソースをクリーンアップします：

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // タイマーを起動
      this.timer = setInterval(() => {
        console.log('定期タスク実行');
      }, 1000);
    },
    detached() {
      // タイマーをクリア
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

ライフサイクルフック関数は ofa.js コンポーネント開発における重要な概念であり、それらを適切に使用することで、コンポーネントの状態とリソースをより適切に管理し、アプリケーションのパフォーマンスを向上させることができます。

