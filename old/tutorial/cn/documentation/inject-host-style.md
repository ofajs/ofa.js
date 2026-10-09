# 注入宿主样式

在 Web Components 中，由于 `slot` 插槽的限制，无法直接设置插槽内多层级元素的样式。为了解决这个问题，ofa.js 提供了 `<inject-host>` 组件，允许在组件内部向宿主元素注入样式，从而实现对插槽内容中多层级元素的样式控制。

> 注意，建议优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 选择器来设置插槽内容的样式。只有在无法满足需求时，才使用 `<inject-host>` 组件。

## 基本用法

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 设置直接子一级元素的样式 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 还可以设置多层级嵌套的样式 */
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

下面的示例展示了如何使用 `<inject-host>` 设置插槽内嵌套元素的样式。我们创建两个组件：`user-list` 组件作为列表容器，`user-list-item` 组件作为列表项。通过 `<inject-host>`，我们可以在 `user-list` 组件中设置 `user-list-item` 及其内部元素的样式。

<o-playground name="注入宿主样式" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>张三</span>
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
        年龄: <slot name="age"></slot>
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

运行结果中可以看到：
- `user-list-item` 组件的背景色为 aqua（通过 `user-list` 组件的 `<inject-host>` 设置）
- 姓名的文字颜色为红色（通过 `user-list` 组件的 `<inject-host>` 设置 `user-list-item .item-name` 样式）

## 工作原理

`<inject-host>` 组件会将内部包含的 `<style>` 标签内容注入到组件的宿主元素中。这样，注入的样式规则可以穿透组件边界，作用于 slot 插槽内的元素。

通过这种方式，你可以：
- 设置插槽内容中任意深度的元素样式
- 使用完整的选择器路径确保样式只作用于目标元素
- 保持组件样式的封装性，同时实现灵活的样式穿透

## 注意事项

⚠️ **样式污染风险**：由于注入的样式会作用到宿主元素所在的作用域，可能会影响到其他组件内的元素。在使用时务必遵循以下原则：

1. **使用具体的选择器**：尽量使用完整的组件标签路径，避免使用过于宽泛的选择器
2. **添加命名空间前缀**：为你的样式类添加独特的前缀，减少与其他组件冲突的可能
3. **避免使用通用标签选择器**：尽量使用类名或属性选择器代替标签选择器
4. **反思组件设计**：考虑是否可以通过优化组件设计来避免使用 `<inject-host>`。例如，在子组件上配合使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 选择器往往更为优雅。

```html
<!-- 推荐 ✅：使用具体的选择器 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 不推荐 ❌：使用过于通用的选择器 -->
<inject-host>
    <style>
        .content {  /* 容易与其他组件冲突 */
            color: red;
        }
    </style>
</inject-host>
```

### 性能提示

由于 `<inject-host>` 会触发宿主样式重新注入，进而可能导致组件重排或重绘，请谨慎在频繁更新的场景中使用。  
若仅需为插槽内第一级元素设置样式，优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 伪类选择器，可避免穿透式注入带来的额外渲染开销，从而获得更佳性能。
