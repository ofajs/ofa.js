# モジュールが返すオブジェクトの属性

ofa.jsでは、ページモジュールでもコンポーネントモジュールでも、`export default async () => {}` を使用してオブジェクトを返し、モジュールの設定や動作を定義する必要があります。本ドキュメントでは、返すオブジェクトに含めることができるすべてのプロパティをまとめています。

## async 関数のパラメータ

`export default async () => {}` 内の async 関数は、以下のプロパティを含む引数オブジェクトを受け取ります：

### パラメータリスト

| パラメータ | 型 | ページモジュール | コンポーネントモジュール | 説明 |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | 他のモジュールやリソースを読み込む関数 |
| `url` | `string` | ✅ | ✅ | 現在のページまたはコンポーネントモジュールのファイルアドレス |
| `query` | `object` | ✅ | ❌ | URL クエリパラメータオブジェクト |### load パラメータ

`load` は、他のモジュール、コンポーネント、またはリソースを読み込むための関数です。コンポーネントモジュールとページモジュールの両方で使用できます。`load` 関数の読み込み効果は `<l-m>` コンポーネントと同様で、主に ofa.js のページやコンポーネントの HTML ファイルを読み込むために使用されます。

**同期読み込み**: `await` キーワードを使用し、モジュールの読み込みが完了するまで実行をブロックします。

```javascript
export default async ({ load }) => {
  const { someModule } = await load("./some-module.js");
  const component = await load("./my-component.html");
  
  return {
    data: {
      moduleData: someModule
    }
  };
};
```

**非同期ロード**：`await`キーワードを使用せず、Promiseオブジェクトを返し、実行をブロックしません。必要なときに読み込むシーンに適しています。

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('モジュールロード完了:', someModule);
  });
  
  return {
    data: {}
  };
};
```

使用シーン：- コンポーネントを同期的に読み込み、使用前に登録されていることを確認する
- 共有データモジュールを読み込む
- 設定ファイルを読み込む
- 非同期読み込みは、オンデマンド読み込みに適した場面で行う

> 注意：
> - `await` を使用した同期的な読み込みは実行をブロックします。実際の要件に応じて同期または非同期の方式を選択することを推奨します
> - 必要に応じた読み込みの要件がない場合は、`<l-m>` タグを使用してコンポーネントを直接読み込むことを推奨します

### URLパラメータ

`url` パラメータはページモジュールとコンポーネントモジュールの両方で利用可能で、現在のモジュールのファイルアドレスを示します。

```javascript
export default async ({ url }) => {
  console.log('現在のモジュールアドレス:', url);
  
  return {
    data: {
      moduleUrl: url
    }
  };
};
```

### query パラメータ

`query` パラメータはページモジュールでのみ利用可能で、URL のクエリパラメータを含みます。`query` オブジェクトを通じて URL のクエリ文字列パラメータに直接アクセスできます。

```javascript
export default async ({ query }) => {
  console.log('クエリパラメータ:', query);
  
  return {
    data: {
      userId: query.id,
      page: query.page || 1
    }
  };
};
```

使用例：

```html
<template page>
  <style>
    :host { display: block; padding: 20px; }
  </style>
  <div>
    <h1>ユーザー詳細</h1>
    <p>ユーザーID: {{userId}}</p>
    <p>ページ: {{page}}</p>
  </div>
  <script>
    export default async ({ query }) => {
      return {
        data: {
          userId: query.id || '不明',
          page: query.page || '1'
        }
      };
    };
  </script>
</template>
```

アクセス方法：```html
<o-page src="./user.html?id=123&page=2"></o-page>
```

> 重要：Vue のような `this.$route.query` の方法でクエリパラメータを取得しないでください。ofa.js では関数のパラメータを通じてのみ取得できます。

### 完全なパラメータ例

```javascript
export default async ({ load, url, query }) => {
  const { config } = await load("./config.js");
  
  return {
    data: {
      configData: config,
      moduleUrl: url,
      queryParams: query
    },
    ready() {
      console.log('モジュールURL:', url);
      console.log('クエリパラメータ:', query);
    }
  };
};
```

## 返却属性の概要

| プロパティ | 型 | ページモジュール | コンポーネントモジュール | 説明 | 関連ドキュメント |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ 必須 | コンポーネントのタグ名 | [コンポーネントの作成](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | リアクティブデータオブジェクト | [プロパティのリアクティビティ](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | コンポーネント属性の定義 | [属性の継承](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | メソッドと算出プロパティ | [算出プロパティ](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | ウォッチャー | [ウォッチャー](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | DOM作成完了時に呼ばれる | [ライフサイクル](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | DOMにアタッチされた時に呼ばれる | [ライフサイクル](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | DOMからデタッチされた時に呼ばれる | [ライフサイクル](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | 完全にロードが完了した時に呼ばれる | [ライフサイクル](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ 親ページ | ❌ | ルート変更時に呼ばれる | [ネストされたページ/ルート](../../documentation/nested-routes.md) |> **特別なエクスポート**：`export const parent = "./layout.html"` - ネストされたルーティングで、親ページのパスを指定するために使用されます（返却オブジェクトには含まれません）。詳しくは [ネストされたページ/ルーティング](../../documentation/nested-routes.md) をご覧ください。

## コア属性

### tag



`tag` はコンポーネントのタグ名であり、**コンポーネントモジュールではこのプロパティを定義する必要があります**。ページモジュールでは `tag` を定義する必要はありません。

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> 注意：`tag` の値は、コンポーネント使用時のタグ名と一致する必要があります。

### data



`data` はリアクティブなデータオブジェクトで、コンポーネントやページの状態データを格納するために使用されます。データが変更されると、自動的にビューが更新されます。

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "張三",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> 注意：`data` はオブジェクトであり、関数ではありません。Vue フレームワークとは異なります。

### attrs



`attrs`はコンポーネントの属性を定義するために使用され、外部から渡されるデータを受け取ります。`attrs`を定義する必要があるのは、コンポーネントモジュールだけです。

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // デフォルト値なし
      disabled: "",     // デフォルト値あり
      size: "medium"    // デフォルト値あり
    }
  };
};
```

コンポーネント使用時に属性を渡す：

```html
<my-component title="タイトル" disabled size="large"></my-component>
```

> 重要ルール：
> - 渡される attribute 値は文字列である必要があり、文字列でない場合は自動的に文字列に変換されます
> - 命名変換：`fullName` → `full-name`（ケバブケース形式）
> - `attrs` と `data` のキーは重複できません

### proto



`proto` はメソッドと算出プロパティを定義するために使用します。算出プロパティは JavaScript の `get` と `set` キーワードを使って定義します。

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // メソッド定義
      increment() {
        this.count++;
      },
      
      // 計算プロパティ（getter）
      get doubleCount() {
        return this.count * 2;
      },
      
      // 計算プロパティ
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

> 注意：ofa.js は `get`/`set` キーワードを使用して算出プロパティを定義します。Vue の `computed` オプションではありません。

### watch



`watch` はウォッチャーを定義するために使用され、データの変更を監視して対応するロジックを実行します。

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // 単一のプロパティを監視
      count(newVal, { watchers }) {
        console.log('count が変更されました:', newVal);
      },
      
      // 複数のプロパティを監視
      "count,name"() {
        console.log('count または name が変更されました');
      }
    }
  };
};
```

リスナーコールバック関数は2つのパラメーターを受け取ります：- `newValue`：変更後の新しい値
- `{ watchers }`：現在のコンポーネントのすべてのウォッチャーオブジェクト

## ライフサイクルフック

ライフサイクルフックを使用すると、コンポーネントのさまざまな段階で特定のロジックを実行できます。

### ready



`ready` フックはコンポーネントの準備が整ったときに呼び出され、この時点でコンポーネントのテンプレートはレンダリングが完了し、DOM 要素は作成されていますが、まだドキュメントに挿入されていない可能性があります。

```javascript
ready() {
  console.log('DOM が作成されました');
  this.initDomElements();
}
```

### attached



`attached` フックは、コンポーネントがドキュメントに挿入されたときに呼び出され、コンポーネントがページにマウントされたことを示します。

```javascript
attached() {
  console.log('DOMにマウントされました');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached



`detached` フックはコンポーネントがドキュメントから削除されるときに呼び出され、コンポーネントがまもなくアンマウントされることを示します。

```javascript
detached() {
  console.log('DOMから削除されました');
  clearInterval(this._timer);
}
```

### loaded



`loaded` フックは、コンポーネントとそのすべての子コンポーネント、非同期リソースがすべて読み込まれた後にトリガーされます。

```javascript
loaded() {
  console.log('完全に読み込みが完了しました');
}
```

### routerChange



`routerChange` フックはルート変更時に呼び出され、親ページが子ページの切り替えを監視するためだけに使用されます。

```javascript
routerChange() {
  this.refreshActive();
}
```

## ライフサイクル実行順序

```
ready → attached → loaded
                 ↓
              detached（削除時）
```

## 特殊なエクスポート：parent

`parent` はネストされたルーティングに使用され、現在のページの親ページパスを指定します。これは独立したエクスポートであり、返却オブジェクトには含まれません。

```html
<template page>
  <style>:host { display: block; }</style>
  <div>子页面内容</div>
  <script>
    // 親ページを指定
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## 完全な例

### コンポーネントモジュール

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>カウント: {{count}}</p>
    <p>二倍: {{doubleCount}}</p>
    <button on:click="increment">増加</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "デフォルトのタイトル"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count が次に変化しました:', newVal);
          }
        },
        ready() {
          console.log('コンポーネントの準備ができました');
        },
        attached() {
          console.log('コンポーネントがマウントされました');
        },
        detached() {
          console.log('コンポーネントがアンマウントされました');
        }
      };
    };
  </script>
</template>
```

### ページモジュール

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('ページ準備完了');
        },
        
        attached() {
          console.log('ページがマウントされました');
          console.log('クエリパラメータ:', query);
        },
        
        detached() {
          console.log('ページがマウント解除されました');
        }
      };
    };
  </script>
</template>
```

## よくある間違い

### 1. attrs と data のキーが重複している

```javascript
// ❌ 誤り
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // attrs と重複
};

// ✅ 正しい
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // 異なるキーを使用する
};
```

### 2. Vueスタイルで算出プロパティを定義する

```javascript
// ❌ 間違い
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ 正しい
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data は関数として定義する

```javascript
// ❌ エラー
return {
  data() {
    return { count: 0 };
  }
};

// ✅ 正解
return {
  data: {
    count: 0
  }
};
```

### 4. メソッド定義位置の誤り

```javascript
// ❌ 間違い
return {
  methods: {
    handleClick() {}
  }
};

// ✅ 正しい
return {
  proto: {
    handleClick() {}
  }
};
```