# 算出プロパティ

計算プロパティは、リアクティブデータに基づいて新しいデータを派生させる方法であり、依存するデータの変化に応じて自動的に更新されます。ofa.jsでは、計算プロパティは `proto` オブジェクト内で定義される特別なメソッドであり、JavaScriptの `get` または `set` キーワードを使用して定義します。

## 特徴と利点

- **キャッシング**：算出プロパティの結果はキャッシュされ、依存データが変更された場合にのみ再計算される
- **リアクティブ**：依存データが更新されると、算出プロパティは自動的に更新される
- **宣言的**：依存関係を宣言的に作成し、コードをより明確で理解しやすくする

## get 計算プロパティ

get 算出プロパティは、リアクティブなデータから新しい値を派生させるために使用されます。パラメーターを受け付けず、他のデータに基づいて計算された値のみを返します。

<o-playground name="get 計算プロパティの例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">クリックして - {{count}} - {{countDouble}}</button>
      <p>計算プロパティ countDouble の値：{{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble 被访问');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 実際の応用シナリオ例

算出プロパティは、配列のフィルタリングや表示テキストのフォーマットなど、複雑なデータ変換ロジックを処理するためによく使用されます：

<o-playground name="計算プロパティの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="名前をフィルタ...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['張3', '李4', '王54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set 計算プロパティ

set 計算プロパティを使用すると、代入操作によって基盤となるデータ状態を変更できます。これはパラメータを受け取り、通常はそれに依存する元のデータを逆方向に更新するために使用されます。

<o-playground name="set 計算プロパティの例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>基本値: {{count}}</p>
        <p>倍の値: {{countDouble}}</p>
        <button on:click="resetCount">カウントリセット</button>
        <button on:click="setCountDouble">倍の値を10に設定</button>
        <button on:click="incrementCount">基本値を増加</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // countが負にならないようにする
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 算出プロパティ vs メソッド

方法でも同様の機能を実現できますが、算出プロパティにはキャッシュの特性があり、依存するデータが変化した場合にのみ再評価されるため、パフォーマンスがより優れています。

```javascript
// 算出プロパティを使用（推奨） - キャッシュあり
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// メソッドを使用 - 呼び出しごとに実行
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## 注意事項

1. **非同期操作の回避**：算出プロパティは同期的かつ副作用のない状態を維持すべきであり、その中で非同期呼び出しを行ったり、直接コンポーネントの状態を変更してはなりません。  
2. **依存関係の追跡**：必ずリアクティブデータのみに依存してください。そうでなければ、更新は予期しないものになります。  
3. **エラー対策**：算出プロパティ内部で循環依存や異常な代入が発生した場合、レンダリングの失敗や無限ループにつながる可能性があるため、必ず事前に境界条件を設定し、例外処理を適切に行ってください。

## 実際の応用例

以下は簡単なフォーム検証の例で、計算属性の実用性を示しています。

<o-playground name="フォーム検証サンプル" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>簡単な検証サンプル</h3>
      <input type="text" sync:value="username" placeholder="ユーザー名を入力(最低3文字)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        ステータス: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'ユーザー名は有効です' : 'ユーザー名が短すぎます';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

