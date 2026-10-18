# 样式：宿主注入与样式查询

## 注入宿主样式

在 Web Components 中，由于 `slot` 插槽的限制，无法直接设置插槽内多层级元素的样式。为了解决这个问题，ofa.js 提供了 `<inject-host>` 组件，允许在组件内部向宿主元素注入样式，从而实现对插槽内容中多层级元素的样式控制。

> 注意，建议优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 选择器来设置插槽内容的样式。只有在无法满足需求时，才使用 `<inject-host>` 组件。

### 基本用法

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

### 案例

下面的示例展示了如何使用 `<inject-host>` 设置插槽内嵌套元素的样式。我们创建两个组件：`user-list` 组件作为列表容器，`user-list-item` 组件作为列表项。通过 `<inject-host>`，我们可以在 `user-list` 组件中设置 `user-list-item` 及其内部元素的样式。

```html
<!-- index.html -->
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
```

```html
<!-- user-list.html -->
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
```

```html
<!-- user-list-item.html -->
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
```

运行结果中可以看到：
- `user-list-item` 组件的背景色为 aqua（通过 `user-list` 组件的 `<inject-host>` 设置）
- 姓名的文字颜色为红色（通过 `user-list` 组件的 `<inject-host>` 设置 `user-list-item .item-name` 样式）

### 工作原理

`<inject-host>` 组件会将内部包含的 `<style>` 标签内容注入到组件的宿主元素中。这样，注入的样式规则可以穿透组件边界，作用于 slot 插槽内的元素。

通过这种方式，你可以：
- 设置插槽内容中任意深度的元素样式
- 使用完整的选择器路径确保样式只作用于目标元素
- 保持组件样式的封装性，同时实现灵活的样式穿透

### 注意事项

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

#### 性能提示

由于 `<inject-host>` 会触发宿主样式重新注入，进而可能导致组件重排或重绘，请谨慎在频繁更新的场景中使用。  
若仅需为插槽内第一级元素设置样式，优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 伪类选择器，可避免穿透式注入带来的额外渲染开销，从而获得更佳性能。

## 样式查询

`match-var` 是 ofa.js 中用于根据 CSS 变量进行样式匹配的功能组件。通过 `match-var`，可以根据当前组件的 CSS 变量值动态匹配并应用不同的样式。这种特性专门用于样式相关的上下文状态传递，不需要使用 JavaScript，使用起来更加方便，适合主题色等样式传递需求。

### 核心概念

- **match-var**: 样式匹配组件，根据 CSS 变量值决定是否应用内部样式
- **属性匹配**: 通过组件属性定义需要匹配的 CSS 变量和期望值
- **样式应用**: 匹配成功时，内部 `<style>` 标签的样式会被应用到组件上

### 基本用法

`match-var` 组件通过属性来定义需要匹配的 CSS 变量和期望值。当组件的 CSS 变量值与指定的属性值匹配时，内部定义的样式就会被应用。

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

#### 属性

`match-var` 组件使用任意属性来定义 CSS 变量的匹配规则。属性名对应 CSS 变量名（不含 `--` 前缀），属性值就是期望匹配的值。

#### 工作原理

1. **浏览器支持**: 如果浏览器支持 `@container style()` 查询，会直接使用 CSS 原生能力
2. **降级处理**: 如果不支持，会通过轮询检测 CSS 变量值的变化，匹配成功后动态注入样式
3. **手动刷新**: 可以通过 `$.checkMatch()` 方法手动触发样式检测

### 基础示例

```html
<!-- page1.html -->
<template page>
  <l-m src="./theme-box.html"></l-m>
  <style>
    :host{
        display: block;
    }
  </style>
  <style>
    .container{
       --theme: data(currentTheme);
    }
  </style>
  <button on:click="changeTheme">切换主题</button> - Theme:{{currentTheme}}
  <div class="container">
    <theme-box>
      根据 CSS 变量显示不同样式
    </theme-box>
  </div>
    <theme-box style="--theme: light;">
      显示亮色主题
    </theme-box>
    <theme-box style="--theme: dark;">
      显示暗色主题
    </theme-box>
  </div>
  <script>
    export default async ()=>{
      return {
        data: {
            currentTheme: "light",
        },
        proto:{
            changeTheme(){
                this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
            }
        }
      };
    };
  </script>
</template>
```

```html
<!-- theme-box.html -->
<template component>
  <style>
    :host {
      display: block;
      margin: 8px 0;
    }
    .content {
      padding: 20px;
      border-radius: 4px;
    }
  </style>
  <match-var theme="light">
    <style>
      .content {
        background-color: #f5f5f5;
        color: #333;
      }
    </style>
  </match-var>
  <match-var theme="dark">
    <style>
      .content {
        background-color: #333;
        color: white;
      }
    </style>
  </match-var>
  <div class="content">
    <slot></slot>
  </div>
  <script>
    export default {
      tag: "theme-box",
      data: {
        theme: "light",
      },
    };
  </script>
</template>
```

### 多条件匹配

可以同时使用多个属性来定义更复杂的匹配条件，只有当所有 CSS 变量都匹配时，样式才会被应用。

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

### 多条件匹配示例

```html
<!-- page1.html -->
<template page>
  <style>
    :host {
        display: block;
    }
  </style>
  <style>
    .content{
        --theme: data(theme);
        --size: data(size);
    }
  </style>
  <l-m src="./test-card.html"></l-m>
  <div>主题: {{theme}} <button on:click="changeTheme">切换主题</button></div>
  <div>尺寸: {{size}} <button on:click="changeSize">切换尺寸</button></div>
  <div class="content">
    <test-card>
      <div>多条件样式匹配示例</div>
    </test-card>
  </div>
  <script>
    export default async ()=>{
        return {
            data:{
                theme:"light",
                size:"small"
            },
            proto:{
                changeTheme(){
                    this.theme = this.theme === "light" ? "dark" : "light";
                },
                changeSize(){
                    this.size = this.size === "small" ? "large" : "small";
                }
            }
        };
    }
  </script>
</template>
```

```html
<!-- test-card.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 20px;
      margin: 10px;
    }
  </style>
  <match-var theme="light" size="small">
    <style>
      :host {
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
      }
    </style>
  </match-var>
  <match-var theme="light" size="large">
    <style>
      :host {
        background-color: #bbdefb;
        border: 2px solid #1976d2;
      }
    </style>
  </match-var>
  <match-var theme="dark" size="small">
    <style>
      :host {
        background-color: #424242;
        border: 1px solid #757575;
        color: white;
      }
    </style>
  </match-var>
  <match-var theme="dark" size="large">
    <style>
      :host {
        background-color: #212121;
        border: 2px solid #616161;
        color: white;
      }
    </style>
  </match-var>
  <slot></slot>
  <script>
    export default {
      tag: "test-card",
      data: {},
    };
  </script>
</template>
```

### checkMatch 手动刷新

在某些情况下，CSS 变量的变化可能无法被自动检测到，这时可以手动调用 `$.checkMatch()` 方法来触发样式检测。

> 当前 Firefox 尚未支持 `@container style()` 查询，因此需手动调用 `$.checkMatch()`；待未来浏览器原生支持后，系统将自动检测变量变化，无需再手动触发。

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // 手动触发样式检测
    $.checkMatch();
  }
}
```

### 最佳实践

1. **优先使用 CSS 原生能力**: `match-var` 会优先使用浏览器原生的 `@container style()` 查询，现代浏览器中性能更好
2. **合理组织样式**: 将相关的匹配样式放在一起，便于维护和理解
3. **使用 data() 绑定**: 结合 `data()` 指令可以实现响应式的样式切换
