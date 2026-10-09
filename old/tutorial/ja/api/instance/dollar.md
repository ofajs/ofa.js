# $

`$` メソッドは、ofa.js における中核となる関数で、DOM 要素インスタンスの取得および操作に用いられます。以下では、`$` の主な機能について詳しく説明します：

## 要素インスタンスの取得

通过 `$` 方法，你可以获取页面上符合 [CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) 的第一个元素实例，并对其进行操作。以下是一个示例：

<o-playground name="$ - 要素を取得">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

上記の例では、`$`記号を使用して`id`が"target1"の要素インスタンスを選択し、`text`プロパティを設定することでそのテキスト内容を変更しています。

## 子要素の検索例

インスタンスも `$` メソッドを持っており、インスタンスの `$` メソッドを通じて、要素インスタンスの最初の条件に一致する子要素インスタンスを取得できます。

<o-playground name="$ - 子要素を検索">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

要素のインスタンスを直接他の場所に挿入しないでください。そのような操作は元の要素に影響を与えます。コピーを作成する必要がある場合は、[clone](./clone.md) メソッドを使用してください。

<o-playground name="$ - インスタンス特性" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## シャドウノード内の子要素を取得する

[shadow](./shadow.md) プロパティでインスタンスを取得した後、`$` メソッドを使って目的の要素を取得できます：

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## 直接インスタンス化要素

次の方法で、ネイティブ要素を直接 `$` インスタンスオブジェクトとして初期化できます：

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

これにより、既存のHTML要素を`$`インスタンスに簡単に変換して、`$`が提供する機能を使用して操作や処理を行うことができます。

## 要素インスタンスの生成

さらに、`$`は既存の要素インスタンスを取得するだけでなく、新しい要素インスタンスを作成してページに追加することもできます。

### 文字列による生成

文字列を使って `$` 関数で新しい要素インスタンスを作成できます。以下のようにします：

<o-playground name="$ - 文字列生成" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">add target 1 text</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

この例では、`$` 関数を使用して指定したスタイルとテキストコンテンツを持つ新しい要素インスタンスを作成し、それを `id` が "target1" の既存の要素インスタンス内に追加しています。

### オブジェクト生成による

`$` 関数を使用して、オブジェクトの方法で新しい要素インスタンスを生成することもできます。以下に示します：

<o-playground name="$ - オブジェクト生成" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

この例では、`$` 関数を使用してオブジェクト形式で新しい要素インスタンスを定義しています。タグタイプ、テキスト内容、スタイル属性を含み、それを `id` が "target1" の既存の要素インスタンス内に追加します。

## 取得したサンプルとページ／コンポーネントインスタンスの関係

`$` メソッドは、グローバルから対応するページやコンポーネント要素のインスタンスを取得するために使用でき、その機能はページやコンポーネントモジュール内のライフサイクルメソッドにおける `this` の指す先と同じです。

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => OFAJS コンポーネント例
  },300);
</script>
```

```html
<!-- test-comp.html -->
 <template component>
  <div>
    <p>{{title}}</p>
  </div>
  <script>
    export default async ({ load }) => {
      return {
        tag: "test-comp",
        data: {
          title: "OFAJS コンポーネント例",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
 </template>
```