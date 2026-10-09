# Context State

Context state is a mechanism in ofa.js for cross-component data sharing. Through the Provider and Consumer pattern, data can be passed between parent-child components and cross-level components without layer-by-layer prop passing.

## Core Concepts

- **o-provider**: Data provider, defines data to be shared
- **o-consumer**: Data consumer, gets data from the nearest provider
- **watch:xxx**: Monitors consumer data changes and binds to component or page module properties

## o-provider Provider

The `o-provider` component is used to define a provider of shared data. It identifies itself with a `name` attribute and defines data to be shared through attributes (like `custom-a="value"`).

```html
<o-provider name="userInfo" custom-name="John" custom-age="25">
  ...
</o-provider>
```

### Attributes

- `name`: The unique identifier name of the provider, used by consumers to find the corresponding provider

### Features

1. **Auto Attribute Passing**: All non-reserved attributes on the provider become shared data
2. **Reactive Updates**: When provider data changes, consumers consuming that provider's corresponding name will automatically update
3. **Hierarchical Lookup**: Consumers will look for data from the nearest parent provider with the corresponding name

## o-consumer Consumer

The `o-consumer` component is used to consume (use) provider data. It specifies the provider name to consume through the `name` attribute.

```html
<o-consumer name="userInfo"></o-consumer>
```

### Attributes

- `name`: The provider name to consume

### Features

1. **Auto Data Retrieval**: Consumers automatically get data from the nearest parent provider with the corresponding name
2. **Attribute Merging**: If multiple providers with the same name have a certain attribute, the attribute from the provider closest to the consumer takes priority
3. **Attribute Monitoring**: You can monitor specific attribute changes through `watch:xxx`

## Monitoring Data Changes

You can monitor provider data changes through `watch:xxx`:

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

## Basic Example

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
  <div>User ID: {{userId}}</div>
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
  {{userId}} Avatar
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

## o-root-provider Root Provider

`o-root-provider` is a root-level global provider whose scope is the entire document. Even without a parent provider, consumers can get data from the root provider.

```html
<!-- Define global root provider -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Can be consumed anywhere in the page -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### Features

1. **Global Scope**: Root provider data is available throughout the page
2. **Priority**: When both a provider and root-provider with the same name exist, the provider closest to the consumer takes priority
3. **Removable**: After removing the root-provider, consumers will fall back to looking for other providers

## root-provider Example

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
    <div>Theme: {{theme}}</div>
    <div>Language: {{language}}</div>
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
  Header - Theme: {{theme}}
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
  Content - Language: {{language}}
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

### Priority Example

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- Here 👇 the custom-value obtained is "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- Here 👇 the custom-value obtained is "root" -->
<o-consumer name="test"></o-consumer>

```

## getProvider(name) Method

`getProvider(name)` is an instance method used to get the provider element with the corresponding name. It will search up the DOM for the nearest parent provider, and if not found, returns the root-provider.

### Using getProvider(name) Method in Components or Page Modules

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

## getProvider Example

```html
<!-- demo.html -->
<template>
  <o-provider name="userInfo" custom-name="John" custom-age="25">
    <o-page src="page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
<template page>
  <button on:click="getProviderData">Get Provider Data</button>
  <div>Current name: {{currentName}}</div>
  <div>Current age: {{currentAge}}</div>
  <div style="margin-top: 10px;">
    <button on:click="updateProvider">Modify Provider Data</button>
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
            console.log("Found Provider:", provider);
            console.log("Name:", provider.customName);
            console.log("Age:", provider.customAge);
            alert(`Provider Data: ${provider.customName}, ${provider.customAge} years old`);
          }
        },
        updateProvider() {
          const provider = this.getProvider("userInfo");
          if (provider) {
            provider.customName = "Jane";
            provider.customAge = 30;
          }
        },
      },
    };
  </script>
</template>
```

### Getting Provider from Element

```javascript
// Get the provider above the current element
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("Found provider:", provider.customName);
}

// Directly get global root-provider
const globalProvider = $.getRootProvider("globalConfig");
```

### Use Cases

1. **Manual Data Retrieval**: Use when direct access to provider data is needed
2. **Cross Shadow DOM**: Find upper layer provider inside Shadow DOM
3. **Event Handling**: Get corresponding provider in event callbacks

## dispatch Event Dispatch

Providers can dispatch events to all consumers consuming it:

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// Dispatch event
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## Event Dispatch Example

```html
<!-- demo.html -->
<template>
  <o-provider name="chat" custom-messages='["Welcome to chat room"]' id="chatProvider">
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
  <h3>Chat Room</h3>
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
  <input type="text" sync:value="inputText" placeholder="Enter message...">
  <button on:click="sendMessage">Send</button>
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

## Best Practices

1. **Reasonable Naming**: Use meaningful names for providers and consumers for easier tracking and maintenance
2. **Avoid Overuse**: Context state is for cross-component data sharing; for regular parent-child components, props are recommended
3. **Root Provider for Global Configuration**: Themes, languages, global state, etc. are suitable for root-provider
4. **Timely Cleanup**: When a provider is removed, consumers will automatically clear data without manual handling
