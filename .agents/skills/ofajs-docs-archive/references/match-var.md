# 样式查询

`match-var` 是 ofa.js 中用于根据 CSS 变量进行样式匹配的功能组件。通过 `match-var`，可以根据当前组件的 CSS 变量值动态匹配并应用不同的样式。这种特性专门用于样式相关的上下文状态传递，不需要使用 JavaScript，使用起来更加方便，适合主题色等样式传递需求。

## 核心概念

- **match-var**: 样式匹配组件，根据 CSS 变量值决定是否应用内部样式
- **属性匹配**: 通过组件属性定义需要匹配的 CSS 变量和期望值
- **样式应用**: 匹配成功时，内部 `<style>` 标签的样式会被应用到组件上

## 基本用法

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

### 属性

`match-var` 组件使用任意属性来定义 CSS 变量的匹配规则。属性名对应 CSS 变量名（不含 `--` 前缀），属性值就是期望匹配的值。

### 工作原理

1. **浏览器支持**: 如果浏览器支持 `@container style()` 查询，会直接使用 CSS 原生能力
2. **降级处理**: 如果不支持，会通过轮询检测 CSS 变量值的变化，匹配成功后动态注入样式
3. **手动刷新**: 可以通过 `$.checkMatch()` 方法手动触发样式检测

## 基础示例

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

## 多条件匹配

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

## 多条件匹配示例

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

## checkMatch 手动刷新

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

## 最佳实践

1. **优先使用 CSS 原生能力**: `match-var` 会优先使用浏览器原生的 `@container style()` 查询，现代浏览器中性能更好
2. **合理组织样式**: 将相关的匹配样式放在一起，便于维护和理解
3. **使用 data() 绑定**: 结合 `data()` 指令可以实现响应式的样式切换
