# 非明示コンポーネント

ofa.jsには、非明示的コンポーネントが2種類内蔵されています：

* 条件レンダリングコンポーネント：`x-if`、`x-else-if`、`x-else`
* フィルコンポーネント：`x-fill`

これら2種類のコンポーネントの機能はそれぞれ `o-if` および `o-fill` コンポーネントと同じですが、それ自体は実際にはDOMにレンダリングされず、内部の要素を対応する領域に直接レンダリングします。

例えば：

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 样式は赤くなりません。o-if コンポーネント自体が DOM に存在するためです。 -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- 样式は赤くなります。x-if コンポーネントが DOM にレンダリングされないためです。 -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="非顕式コンポーネント" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* 子階層の .item 要素を赤に選択 */
            color:red;
        }
        /* o-if コンポーネント内部の .item 要素を選択する必要 */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- スタイルは赤にならない、o-if コンポーネント自体が DOM に存在するため -->
                <div class="item">赤色で表示されない</div>
            </o-if>
            <x-if :value="true">
                <!-- スタイルは赤になる、x-if コンポーネントは DOM にレンダリングされないため -->
                <div class="item">赤色で表示される</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if 条件レンダリングコンポーネント

`x-if`は[o-if](./conditional-rendering.md)と機能が完全に同じで、条件式の真偽値に基づいてコンテンツをレンダリングするかどうかを決定する。違いは`x-if`自体がDOM要素として存在せず、その内部コンテンツが直接親コンテナにレンダリングされる点である。

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>お帰りなさい、ユーザー！</p>
    </x-if>
</div>
```

`x-if` は `x-else-if` や `x-else` と組み合わせて使用することもできます：

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>管理者パネル</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>ユーザーセンター</p>
    </x-else-if>
    <x-else>
        <p>ログインしてください</p>
    </x-else>
</div>
```

## x-fill フィルコンポーネント

`x-fill` は [o-fill](./list-rendering.md) と完全に同じ機能を持ち、配列データを複数の DOM 要素にレンダリングするために使用されます。`x-if` と同様に、`x-fill` 自体は DOM にレンダリングされず、その内部テンプレートは直接親コンテナにレンダリングされます。

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

名前付きテンプレートの使用例：

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## 性能説明

機能的な違いの他に、非明示コンポーネントのレンダリング性能は明示コンポーネント（`o-if`、`o-fill`）よりも**はるかに劣ります**。これは、非明示コンポーネントが実際にDOMにレンダリングされず、内部要素の位置や更新を処理するために追加のシミュレーションレンダリングロジックが必要となるためです。

さらに、非明示的コンポーネントは気づきにくいバグを引き起こす可能性がある：それらは実際にはDOMに登場しないため、DOM構造に依存する操作（イベントバインディング、スタイル計算、サードパーティライブラリのクエリなど）が失敗したり、予期しない動作を示したりすることがある。

したがって、**明示的コンポーネント**（`o-if`、`o-else-if`、`o-else`、`o-fill`）を優先的に使用し、特定のシナリオでのみ非明示的コンポーネントを使用することを推奨します。

## 使用シーン

非明示的コンポーネントは性能が劣りますが、以下のシナリオで使用される可能性があります：

1. **余分な DOM 階層を避ける**: `o-if` や `o-fill` 要素を DOM 構造の一部にしたくない場合  
2. **スタイルの継承**: 内部要素が中間コンポーネント要素の影響を受けずに、親コンテナのスタイルを直接継承する必要がある場合  
3. **CSS セレクタの制限**: 親子直接セレクタ（`.container > .item` など）を使ってスタイルを正確に制御したいが、間に余分なラッパー要素を置きたくない場合