# 上下文状态

上下文状态是 ofa.js 中用于跨组件数据共享的机制。通过提供者（Provider）和消费者（Consumer）模式，可以实现父子组件、跨层级组件之间的数据传递，而无需通过 props 层层传递。

## 核心概念

- **o-provider**: 数据提供者，定义需要共享的数据
- **o-consumer**: 数据消费者，从最近的提供者获取数据
- **watch:xxx**: 监听消费者数据的变化，并绑定到组件或页面模块的属性上

## o-provider 提供者

`o-provider` 组件用于定义共享数据的提供者。它通过 `name` 属性标识自己的名称，并通过属性（如 `custom-a="value"`）来定义需要共享的数据。

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  ...
</o-provider>
```

### 属性

- `name`: 提供者的唯一标识名称，用于消费者查找对应的提供者

### 特性

1. **自动属性传递**: provider 上的所有非保留属性都会作为共享数据
2. **响应式更新**: 当 provider 的数据变化时，消费该 provider 的对应 name 的 consumer 会自动更新
3. **层级查找**: 消费者会从最近的上级 provider 开始查找对应 name 的数据

## o-consumer 消费者

`o-consumer` 组件用于消费（使用）提供者的数据。它通过 `name` 属性指定要消费的提供者名称。

```html
<o-consumer name="userInfo"></o-consumer>
```

### 属性

- `name`: 要消费的提供者名称

### 特性

1. **自动数据获取**: consumer 会自动获取最近的上级 provider 中对应 name 的数据
2. **属性合并**: 如果多个同 name 的 provider 都有某个属性，离消费者最近的 provider 的属性优先
3. **属性监听**: 可以通过 `watch:xxx` 监听特定属性的变化

## 监听数据变化

通过 `watch:xxx` 可以监听提供者数据的变化：

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

## 基础示例

```html
<!-- demo.html -->
<template>
  <o-provider name="userInfo" user-id="9527">
    <o-page src="page1.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page1.html -->
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
  <div>用户ID: {{userId}}</div>
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
```

```html
<!-- user-avatar.html -->
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
  {{userId}}头像
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
```

```html
<!-- user-name.html -->
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
```

## o-root-provider 根提供者

`o-root-provider` 是根级别的全局提供者，它的作用域是整个文档。即使在没有父级 provider 的情况下，消费者也可以获取到根提供者的数据。

```html
<!-- 定义全局根提供者 -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- 在页面的任何位置都可以消费 -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### 特性

1. **全局作用域**: 根提供者的数据在整个页面都可用
2. **优先级**: 当同时存在同 name 的 provider 和 root-provider 时，离消费者最近的 provider 优先
3. **可移除**: 移除 root-provider 后，消费者会回退到查找其他 provider

## root-provider 示例

```html
<!-- demo.html -->
<template>
  <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
  <o-page src="page.html"></o-page>
</template>
```

```html
<!-- page.html -->
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
    <div>主题: {{theme}}</div>
    <div>语言: {{language}}</div>
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
```

```html
<!-- header.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 10px;
      background-color: #333;
      color: white;
    }
  </style>
  Header - 主题: {{theme}}
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
```

```html
<!-- content.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 10px;
      background-color: rgba(137, 133, 133, 1);
    }
  </style>
  Content - 语言: {{language}}
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
```

### 优先级示例

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- 这里👇获取到的custom-value是 "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- 这里👇获取到的custom-value是 "root" -->
<o-consumer name="test"></o-consumer>

```

## getProvider(name) 方法

`getProvider(name)` 是一个实例方法，用于获取对应 name 的提供者元素。它会沿着 DOM 向上查找最近的上级 provider，如果没找到则返回 root-provider。

### 组件或页面模块内使用 getProvider(name) 方法

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

## getProvider 示例

```html
<!-- demo.html -->
<template>
  <o-provider name="userInfo" custom-name="张三" custom-age="25">
    <o-page src="page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
<template page>
  <button on:click="getProviderData">获取 Provider 数据</button>
  <div>当前名称: {{currentName}}</div>
  <div>当前年龄: {{currentAge}}</div>
  <div style="margin-top: 10px;">
    <button on:click="updateProvider">修改 Provider 数据</button>
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
            console.log("找到 Provider:", provider);
            console.log("名称:", provider.customName);
            console.log("年龄:", provider.customAge);
            alert(`Provider 数据: ${provider.customName}, ${provider.customAge}岁`);
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
```

### 通过元素上获取 provider

```javascript
// 获取当前元素上级的 provider
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("找到提供者:", provider.customName);
}

// 直接获取全局 root-provider
const globalProvider = $.getRootProvider("globalConfig");
```

### 使用场景

1. **手动获取数据**: 在需要直接访问提供者数据的场景下使用
2. **跨 Shadow DOM**: 在 Shadow DOM 内部查找上层 provider
3. **事件处理**: 在事件回调中获取对应的提供者

## dispatch 事件派发

provider 可以派发事件给所有消费它的 consumer：

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// 派发事件
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## 事件派发示例

```html
<!-- demo.html -->
<template>
  <o-provider name="chat" custom-messages='["欢迎来到聊天室"]' id="chatProvider">
    <o-page src="page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
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
  <h3>聊天室</h3>
  <chat-list></chat-list>
  <chat-input></chat-input>
</template>
```

```html
<!-- chat-list.html -->
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
```

```html
<!-- chat-input.html -->
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
  <input type="text" sync:value="inputText" placeholder="输入消息...">
  <button on:click="sendMessage">发送</button>
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
```

## 最佳实践

1. **合理命名**: 为 provider 和 consumer 使用有意义的 name，便于追踪和维护
2. **避免过度使用**: 上下文状态适用于跨组件共享数据，普通父子组件建议使用 props
3. **根提供者用于全局配置**: 主题、语言、全局状态等适合使用 root-provider
4. **及时清理**: 当 provider 被移除时，consumer 会自动清除数据，无需手动处理
