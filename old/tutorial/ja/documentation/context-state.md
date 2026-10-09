# コンテキスト状態

コンテキスト状態は、ofa.jsでコンポーネント間のデータ共有に使用されるメカニズムです。プロバイダー（Provider）とコンシューマー（Consumer）パターンにより、親子コンポーネントや階層を超えたコンポーネント間でのデータ受け渡しが可能となり、propsを何層にもわたって渡す必要がありません。

## 核心概念

- **o-provider**: データプロバイダー、共有する必要のあるデータを定義する
- **o-consumer**: データコンシューマー、最も近いプロバイダーからデータを取得する
- **watch:xxx**: コンシューマーデータの変化を監視し、コンポーネントまたはページモジュールのプロパティにバインドする

## o-provider プロバイダ

`o-provider` コンポーネントは、共有データのプロバイダーを定義するために使用されます。`name`属性で自身の名前を識別し、属性（例：`custom-a="value"`）によって共有するデータを定義します。

```html
<o-provider name="userInfo" custom-name="張三" custom-age="25">
  ...
</o-provider>
```

### 属性

- `name`: プロバイダーの一意の識別名で、コンシューマーが対応するプロバイダーを検索するために使用されます

### 特徴

1. **自動プロパティ継承**: provider 上のすべての非予約プロパティは共有データとして渡されます。
2. **リアクティブ更新**: provider のデータが変更されると、その provider を消費する対応する name の consumer が自動的に更新されます。
3. **階層検索**: 消費者は最も近い上位の provider から対応する name のデータを検索します。

## o-consumer コンシューマ

`o-consumer` コンポーネントは、プロバイダーのデータを消費（使用）するために使用されます。それは `name` 属性で消費するプロバイダー名を指定します。

```html
<o-consumer name="userInfo"></o-consumer>
```

### 属性

- `name`: 消費するプロバイダー名

### 特徴

1. **自動データ取得**: consumerは最近の上位providerにおける対応するnameのデータを自動的に取得する
2. **属性マージ**: 複数の同じnameを持つproviderが特定の属性を持っている場合、consumerに最も近いproviderの属性が優先される
3. **属性リスニング**: `watch:xxx`を使って特定の属性の変化を監視できる

## データの変化を監視する

`watch:xxx` を使って、プロバイダーのデータの変化を監視できます：

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## 基本例

<o-playground name="基本例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>ユーザーID: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      {{userId}}アバター
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      User-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider ルートプロバイダー

`o-root-provider` はルートレベルのグローバルプロバイダーであり、そのスコープはドキュメント全体です。親プロバイダーが存在しない場合でも、コンシューマーはルートプロバイダーのデータを取得できます。

```html
<!-- グローバルルートプロバイダを定義します -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- ページの任意の場所で消費できます -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### 特徴

1. **グローバルスコープ**: ルートプロバイダのデータはページ全体で利用可能です
2. **優先順位**: 同じnameのproviderとroot-providerが同時に存在する場合、消費者に最も近いproviderが優先されます
3. **削除可能**: root-providerを削除すると、消費者は他のproviderを探すようにフォールバックします

## root-provider サンプル

<o-playground name="root-provider サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>テーマ: {{theme}}</div>
        <div>言語: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Header - テーマ: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Content - 言語: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### 優先順位の例

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- ここ👇で取得したcustom-valueは "parent" です -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- ここ👇で取得したcustom-valueは "root" です -->
<o-consumer name="test"></o-consumer>

```

### 優先度の例示デモ

<o-playground name="優先順位の例デモ" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>親Providerの値: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>ルートProviderの値: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        子コンポーネントの値: {{customValue}} (最も近いのは {{customValue}} provider)
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## getProvider(name) メソッド

`getProvider(name)` はインスタンスメソッドであり、対応する name のプロバイダ要素を取得するために使用されます。DOM を上方向に辿り、最も近い上位の provider を検索し、見つからない場合は root-provider を返します。

### コンポーネントまたはページモジュール内で getProvider(name) メソッドを使用する

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "新しい値";
  }
}
...
</script>
```

## getProvider サンプル

<o-playground name="getProvider サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="張三" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Provider データを取得</button>
      <div>現在の名前: {{currentName}}</div>
      <div>現在の年齢: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Provider データを変更</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider が見つかりました:", provider);
                console.log("名前:", provider.customName);
                console.log("年齢:", provider.customAge);
                alert(`Provider データ: ${provider.customName}, ${provider.customAge}歳`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "李四";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### 要素からプロバイダーを取得する

```javascript
// 現在の要素の上位にあるプロバイダーを取得
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("プロバイダーが見つかりました:", provider.customName);
}

// グローバルな root-provider を直接取得
const globalProvider = $.getRootProvider("globalConfig");
```

### 使用シーン

1. **手動でデータを取得**: プロバイダーのデータに直接アクセスする必要があるシナリオで使用
2. **Shadow DOM を横断**: Shadow DOM の内部で上位プロバイダーを検索
3. **イベント処理**: イベントコールバック内で対応するプロバイダーを取得

## dispatch イベントのディスパッチ

providerは、それを消費するすべてのconsumerにイベントを配信できます：

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// イベントを発火する
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## イベントディスパッチのサンプル

<o-playground name="イベント発信サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["チャットルームへようこそ"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>チャットルーム</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="メッセージを入力...">
      <button on:click="sendMessage">送信</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## ベストプラクティス

1. **合理的な命名**: provider および consumer に意味のある name を付け、追跡とメンテナンスを容易にする  
2. **過度な使用を避ける**: コンテキスト状態はコンポーネント間でデータを共有する場合に適しており、通常の親子コンポーネントには props の使用を推奨  
3. **ルートプロバイダーはグローバル設定に使用**: テーマ、言語、グローバル状態などは root-provider に適している  
4. **タイムリーなクリーンアップ**: provider が削除されると、consumer は自動的にデータをクリアするため、手動での処理は不要