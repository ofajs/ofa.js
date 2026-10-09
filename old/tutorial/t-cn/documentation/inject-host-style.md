# 註入宿主樣式



在 Web Components 中，由於 `slot` 插槽的限製，無法直接設置插槽內多層級元素的樣式。爲瞭解決這個問題，ofa.js 提供瞭 `<inject-host>` 組件，允許在組件內部向宿主元素註入樣式，從而實現對插槽內容中多層級元素的樣式控製。

> 註意，建議優先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 選擇器來設置插槽內容的樣式。隻有在無法滿足需求時，纔使用 `<inject-host>` 組件。

## 基本用法



```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 設置直接子一級元素的樣式 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 還可以設置多層級嵌套的樣式 */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## 案例



下面的示例展示瞭如何使用 `<inject-host>` 設置插槽內嵌套元素的樣式。我們創建兩個組件：`user-list` 組件作爲列錶容器，`user-list-item` 組件作爲列錶項。通過 `<inject-host>`，我們可以在 `user-list` 組件中設置 `user-list-item` 及其內部元素的樣式。

<o-playground name="註入宿主樣式" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>張三</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">李四</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        年齡: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

運行結菓中可以看到：
- `user-list-item` 組件的揹景色爲 aqua（通過 `user-list` 組件的 `<inject-host>` 設置）
- 姓名的文字顏色爲紅色（通過 `user-list` 組件的 `<inject-host>` 設置 `user-list-item .item-name` 樣式）

## 工作原理



`<inject-host>` 組件會將內部包含的 `<style>` 標籤內容註入到組件的宿主元素中。這樣，註入的樣式規則可以穿透組件邊界，作用於 slot 插槽內的元素。

通過這種方式，妳可以：
- 設置插槽內容中任意深度的元素樣式
- 使用完整的選擇器路徑確保樣式隻作用於目標元素
- 保持組件樣式的封裝性，衕時實現靈活的樣式穿透

## 註意事項



⚠️ **樣式汙染風險**：由於註入的樣式會作用到宿主元素所在的作用域，可能會影響到其他組件內的元素。在使用時務必遵循以下原則：

1. **使用具體的選擇器**：盡量使用完整的組件標籤路徑，避免使用過於寬泛的選擇器
2. **添加命名空間前綴**：爲妳的樣式類添加獨特的前綴，減少與其他組件衝突的可能
3. **避免使用通用標籤選擇器**：盡量使用類名或屬性選擇器代替標籤選擇器
4. **反思組件設計**：考慮是否可以通過優化組件設計來避免使用 `<inject-host>`。例如，在子組件上配閤使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 選擇器往往更爲優雅。

```html
<!-- 推薦 ✅：使用具體的選擇器 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 不推薦 ❌：使用過於通用的選擇器 -->
<inject-host>
    <style>
        .content {  /* 容易與其他組件衝突 */
            color: red;
        }
    </style>
</inject-host>
```

### 性能提示



由於 `<inject-host>` 會觸發宿主樣式重新註入，進而可能導緻組件重排或重繪，請謹慎在頻繁更新的場景中使用。  
若僅需爲插槽內第一級元素設置樣式，優先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 僞類選擇器，可避免穿透式註入帶來的額外渲染開銷，從而獲得更佳性能。
