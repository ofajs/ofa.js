# 属性バインディング

ofa.jsは、データを要素のインスタンス化後のオブジェクトのプロパティにバインドすることをサポートしており、例えばinput要素のvalueやcheckedプロパティなどが該当します。

## 一方向プロパティバインディング

单向属性绑定使用 `:toKey="fromKey"` 语法，将组件数据“单向”同步到 DOM 元素的属性。组件数据变动时，元素属性即时更新；但元素自身的变动（如用户输入）不会反向写回组件，保持数据流的单一与可控。

<o-playground name="単方向属性バインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>現在の値: {{val}}</p>
      <input type="text" :value="val" placeholder="これは単方向バインディングの入力ボックスです">
      <p>注意：入力ボックスで直接内容を変更しても、上の表示値は変わりません</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 双方向プロパティバインディング

双方向属性バインディングは `sync:xxx` 構文を使用し、コンポーネントデータとDOM要素間の双方向同期を実現します。コンポーネントデータが変更されると、DOM 要素の属性が更新されます。DOM 要素の属性が変更されると（ユーザー入力など）、コンポーネントデータも同期して更新されます。

<o-playground name="双方向プロパティバインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>現在の値: {{val}}</p>
      <input type="text" sync:value="val" placeholder="これは双方向バインディングの入力ボックスです">
      <p>ヒント：入力ボックスの内容を変更すると、上の表示値がリアルタイムで更新されます</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 双方向バインディングの特徴

- データフロー: コンポーネント ↔ DOM要素（双方向）
- コンポーネントのデータ変更 → DOM要素の更新
- DOM要素の変更 → コンポーネントのデータ更新
- ユーザー入力とデータ同期が必要なシナリオに適しています

### オブジェクトの双方向バインディング

オブジェクトタイプのデータバインディングには、**`sync` 構文を使用する必要はありません**。`:` を使った単方向の受け渡しで十分です。これは、JavaScript のオブジェクトが参照で共有されるためで、親コンポーネントが子コンポーネントにオブジェクトを渡すと、子コンポーネントは同じオブジェクトの参照を取得し、オブジェクトの変更は元のデータに直接反映されます。

ofa.js は JavaScript のこの特性を保持しているため、オブジェクトの一方向の受け渡しは実際には双方向の受け渡しに相当する。例えば：

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "张三", age: 25 } }
      };
    };
  </script>
</template>
```

`child-comp` コンポーネント内で `userData.name` を直接変更すると、親コンポーネントの `userInfo.name` も同時に更新されます。これらは同じオブジェクト参照を指しているためです。

### よくある双方向バインディングのシナリオ

<o-playground name="フォーム双方向バインディングサンプル" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>フォーム双方向バインディングサンプル</h3>
      <div class="form-group">
        <label>テキスト入力:</label>
        <input type="text" sync:value="textInput" placeholder="テキストを入力">
      </div>
      <div class="form-group">
        <label>数値入力:</label>
        <input type="number" sync:value="numberInput" placeholder="数値を入力">
      </div>
      <div class="form-group">
        <label>複数行テキスト:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="複数行テキストを入力"></textarea>
      </div>
      <div class="form-group">
        <label>選択ボックス:</label>
        <select sync:value="selectedOption">
          <option value="">選択してください...</option>
          <option value="option1">オプション1</option>
          <option value="option2">オプション2</option>
          <option value="option3">オプション3</option>
        </select>
      </div>
      <div class="form-group">
        <label>チェックボックス:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> 同意します
        </label>
      </div>
      <div class="preview">
        <h4>リアルタイムプレビュー:</h4>
        <p>テキスト: {{textInput}}</p>
        <p>数値: {{numberInput}}</p>
        <p>複数行テキスト: {{textareaInput}}</p>
        <p>選択: {{selectedOption}}</p>
        <p>チェックボックス状態: {{isChecked ? 'チェック済み' : '未チェック'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

1. **パフォーマンス考慮**：双方向バインディングはデータリスナーを作成するため、多用するとパフォーマンスに影響を与える可能性があります
2. **データ一貫性**：双方向バインディングはデータとビューの一貫性を保証しますが、無限ループ更新を避けるよう注意が必要です
3. **初期値設定**：バインディングされたデータに適切な初期値があることを確認し、undefined表示の問題を回避します
4. **イベント競合**：同じ要素で双方向バインディングと手動イベント処理を同時に使用しないようにし、競合を防ぎます