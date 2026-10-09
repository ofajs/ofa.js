# State Management

## What is State

In ofa.js, **state** refers to the `data` property of a component or page module itself. This state can only be used on the current component, used to store and manage the component's internal data.

When multiple components or pages need to share the same data, the traditional approach is to pass through events or layer by layer through props. This approach leads to difficult-to-maintain code in complex applications. Therefore, **state management** is needed - by defining a shared state object, multiple components or page modules can access and modify this data, achieving state sharing.

> **Tip**: State management is suitable for scenarios that require cross-component, cross-page data sharing, such as user information, shopping cart, theme configuration, global configuration, etc.

## Creating State Objects

Create a reactive state object through `$.stanz({})`. This method receives a plain object as initial data and returns a reactive state proxy.

### Basic Usage

```javascript
// data.js
export const contacts = $.stanz({
  list: [{
      id: 10010,
      name: "Peter",
      info: "Every day is a new beginning, sunshine always comes after the storm.",
  },{
      id: 10020,
      name: "Mike",
      info: "Life is like the ocean, only those with strong will can reach the other shore.",
  },{
      id: 10030,
      name: "John",
      info: "The secret to success is to stick to your dreams and never give up.",
  }]
});
// await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
```

```html
<!-- list.html -->
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  <h2>Contacts</h2>
  <ul>
    <o-fill :value="list">
      <li>
      Name: {{$data.name}} <button on:click="$host.gotoDetail($data)">Detail</button>
      </li>
    </o-fill>
  </ul>
  <script>
    export default async ({load}) => {
      const { contacts } = await load("./data.js");
      return {
        data: {
          list:[]
        },
        proto:{
            gotoDetail(user){
                this.goto(`./detail.html?id=${user.id}`);
            }
        },
        attached(){
          this.list = contacts.list;
        },
        detached(){
          this.list = []; // Clear mounted state data when component is destroyed
        }
      };
    };
  </script>
</template>
```

```html
<!-- detail.html -->
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
    .avatar{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: rgba(204, 204, 204, 1);
        color: rgba(58, 58, 58, 1);
    }
    .user-info{
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
  </style>
  <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
  <div class="user-info">
    <div class="avatar">Avatar</div>
    <div style="font-size: 24px;">
    UserName: 
      <o-if :value="editorMode">
        <input type="text" sync:value="userData.name"/>
        <button on:click="editorMode = false">✅</button>
      </o-if>
      <o-else>
        <span>{{userData.name}}</span>
        <button on:click="editorMode = true">🖊️</button>
      </o-else>
    </div>
    <div style="font-size: 16px;">UserID: {{userData.id}}</div>
    <p style="font-size: 14px;">{{userData.info}}</p>
  </div>
  <script>
    export default async ({ load,query }) => {
      const { contacts } = await load("./data.js");
      return {
        data: {
          userData:{},
          editorMode:false
        },
        attached(){
          this.userData = contacts.list.find(e=>e.id == query.id);
        },
        detached(){
          this.userData = {}; // Clear mounted state data when component is destroyed
        }
      };
    };
  </script>
</template>
```

## State Object Characteristics

### 1. Reactive Updates

State objects created by `$.stanz()` are reactive. When state data changes, all components referencing that data will automatically update.

```javascript
const store = $.stanz({ count: 0 });

// In component
export default {
  data: {
    store: {}
  },
  proto:{
    increment() {
        store.count++; // All components referencing store.count will automatically update
    }
  },
  attached() {
    // Directly reference state object properties
    this.store = store;
  },
  detached(){
    this.store = {}; // Clear mounted state data when component is destroyed
  }
};
```

### 2. Deep Reactivity

State objects support deep reactivity, changes to nested objects and arrays will also be monitored.

```javascript
const store = $.stanz({
  user: {
    name: "John",
    settings: {
      theme: "dark"
    }
  },
  list: []
});

// Modifying nested properties will also trigger updates
store.user.name = "Jane";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "New Task" });
```

## Best Practices

### 1. Mount State in Component attached Phase

It's recommended to mount shared state in the component's `attached` lifecycle:

```javascript
export default {
  data: {
    list: []
  },
  attached() {
    // Mount shared state to component's data
    this.list = data.list;
  },
  detached() {
    // Clear mounted state data when component is destroyed to prevent memory leak
    this.list = [];
  }
};
```

### 2. Reasonably Manage State Scope

- **Global State**: Suitable for data that the entire application needs to access (like user info, global config)
- **Module State**: Suitable for data shared within specific functional modules

```javascript
// Global call state
export const globalStore = $.stanz({ user: null, theme: "light" });

// State used within module
const cartStore = $.stanz({ total: 0 });
```

## Module Internal State Management

```html
<!-- page1.html -->
<template page>
  <l-m src="./demo-comp.html"></l-m>
  <style>
    :host {
      display: block;
      padding: 8px;
    }
  </style>
  <button on:click="addItem">Add Item</button>
  <o-fill :value="list">
    <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
  </o-fill>
  <script>
    export default async () => {
      return {
        data: {
            list:[{
                val:Math.random().toString(36).slice(2, 6)
            }]
        },
        proto:{
            addItem(item){
                this.list.push({
                    val:Math.random().toString(36).slice(2, 6)
                });
            }
        },
      };
    };
  </script>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host{
        display: inline-block;
    }
  </style>
  {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Add Store Total</button>
  <script>
    const cartStore = $.stanz({ total: 0 });
    export default async () => {
      return {
        tag: "demo-comp",
        data: {
            val:"",
            cartStore:{}
        },
        proto:{
            addStoreTotal(){
                this.cartStore.total++;
            }
        },
        attached(){
            this.cartStore = cartStore;
        },
        detached(){
            this.cartStore = {}; // Clear mounted state data when component is destroyed
        }
      };
    };
  </script>
</template>
```

## Notes

1. **State Cleanup**: In the component's `detached` lifecycle, timely clean up references to state data to avoid memory leaks.

2. **Avoid Circular Dependencies**: Don't form circular references between state objects, this may cause problems with the reactivity system.

3. **Large Data Structures**: For large data structures, consider using computed properties or shard management to avoid unnecessary performance overhead.

4. **State Consistency**: Pay attention to state consistency in asynchronous operations, can use transactions or batch updates to ensure data integrity.
