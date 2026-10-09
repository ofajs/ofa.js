# 非顯式組件



ofa.js 內置包含兩種非顯式組件：

* 條件渲染組件：`x-if`、`x-else-if`、`x-else`
* 填充組件：`x-fill`

這兩種組件的功能分別與 `o-if` 和 `o-fill` 組件相衕，但牠們本身不會眞實渲染到 DOM 中，而是將其內部元素直接渲染到對應的區域。

例如：

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 樣式不爲紅色，因爲 o-if 組件本身存在於 DOM 中 -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- 樣式爲紅色，因爲 x-if 組件不會渲染到 DOM 中 -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="非顯式組件" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* 選擇子一級 .item 元素爲紅色 */
            color:red;
        }
        /* 需要選擇 o-if 組件內部的 .item 元素 */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- 樣式不爲紅色，因爲 o-if 組件本身存在於 DOM 中 -->
                <div class="item">不會顯示爲紅色</div>
            </o-if>
            <x-if :value="true">
                <!-- 樣式爲紅色，因爲 x-if 組件不會渲染到 DOM 中 -->
                <div class="item">顯示爲紅色</div>
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

## x-if 條件渲染組件



`x-if` 與 [o-if](./conditional-rendering.md) 的功能完全相衕，用於根據條件錶達式的眞假值決定是否渲染內容。區別在於 `x-if` 本身不會作爲 DOM 元素存在，其內部內容會直接渲染到父級容器中。

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>歡迎迴來，用戶！</p>
    </x-if>
</div>
```

`x-if` 也可以配閤 `x-else-if` 和 `x-else` 使用：

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>管理員面闆</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>用戶中心</p>
    </x-else-if>
    <x-else>
        <p>請登錄</p>
    </x-else>
</div>
```

## x-fill 填充組件



`x-fill` 與 [o-fill](./list-rendering.md) 的功能完全相衕，用於將數組數據渲染爲多個 DOM 元素。與 `x-if` 類似，`x-fill` 本身不會渲染到 DOM 中，其內部模闆會直接渲染到父級容器。

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

使用命名模闆的示例：

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

## 性能說明



除瞭功能上的區別外，非顯式組件的渲染性能會比顯式組件（`o-if`、`o-fill`）**差很多**。這是因爲非顯式組件不會眞實渲染到 DOM 中，需要額外的模擬渲染邏輯來處理內部元素的定位和更新。

此外，非顯式組件可能引發一些難以察覺的 bug：由於牠們不會眞正進入 DOM，依賴 DOM 結構的操作（如事件綁定、樣式計算或第三方庫査詢）可能失效或錶現異常。

因此，建議**優先使用顯式組件**（`o-if`、`o-else-if`、`o-else`、`o-fill`），僅在特定場景下使用非顯式組件。

## 使用場景



雖然非顯式組件性能較差，但在以下場景中可能會用到：

1. **避免額外的 DOM 層級**：當妳不想讓 `o-if` 或 `o-fill` 元素成爲 DOM 結構的一部分時
2. **樣式繼承**：當妳需要讓內部元素直接繼承父容器的樣式，而不受中間組件元素的影響時
3. **CSS 選擇器限製**：當妳需要使用父級直接子選擇器（如 `.container > .item`）來精確控製樣式，但不希望中間有額外的包裝元素時