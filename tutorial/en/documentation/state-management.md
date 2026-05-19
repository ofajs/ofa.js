# State Management

## What is State

In ofa.js, **state** refers to the `data` property of a component or page module. This state can only be used on the current component, and is used to store and manage the internal data of that component.

When multiple components or pages need to share the same data, the traditional approach is to pass it through events or props layer by layer, which makes the code hard to maintain in complex applications. Therefore, **state management** is needed—by defining a shared state object, multiple components or page modules can access and modify this data, thus achieving state sharing.

> **Tip**: State management is suitable for scenarios where data needs to be shared across components and pages, such as user information, shopping cart, theme configuration, global configuration, etc.

## Generating Status Object

Create a reactive state object by using `$.stanz({})`. This method accepts a plain object as initial data and returns a reactive state proxy.

### Basic Usage (Global State)

<o-playground name="State Management Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Application home page address
    export const home = "./list.html";
    // Page transition animation configuration
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "Peter",
        info: "Every day is a new beginning, and the sun always shines after the storm.",
    },{
        id: 10020,
        name: "Mike",
        info: "Life is like the ocean; only those with strong will can reach the other shore.",
    },{
        id: 10030,
        name: "John",
        info: "The secret of success is to hold on to your dreams and never give up.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
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
  </code>
  <code path="detail.html">
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
  </code>
</o-playground>

## Characteristics of state objects

### 1. Reactive Update

`$.stanz()` creates a reactive state object. When the state data changes, all components that reference the data will automatically update.

```javascript
const store = $.stanz({ count: 0 });

// In the component
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // All components that reference store.count will automatically update
    },
  },
  attached() {
    // Directly reference the property of the state object
    this.store = store;
  },
  detached() {
    this.store = {}; // When the component is destroyed, clear the mounted state data
  },
};
```

### 2. Deep Responsive

The state object supports deep reactivity; changes to nested objects and arrays will also be monitored.

```javascript
const store = $.stanz({
  user: {
    name: "Zhang San",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// Modifying nested properties will also trigger updates
store.user.name = "Li Si";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "New Task" });
```

## Best Practices

### 1. Mounting state during the component's attached phase

It is recommended to mount the shared state in the component's `attached` lifecycle:

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // Mount shared state onto the component's data
    this.list = data.list;
  },
  detached() {
    // When the component is destroyed, clear the mounted state data to prevent memory leaks
    this.list = [];
  },
};
```

### 2. Reasonably Manage State Scope

The scope of state depends on the **definition location and export method**:

**States exported via `export` in standalone JS files**: Global states that can be accessed and modified throughout the entire application after being imported via `import` or `load`.

```javascript
// user-store.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**State defined within a page or component module**：Module state，used only within that module。

```html
<template component>
  ...
  <script>
    const localStore = $.stanz({ total: 0 });

    export default async () => {
      return {
        data: {
          localStore: {}
        },
        attached() {
          this.localStore = localStore;
        },
        detached() {
          // When the component is destroyed, clear the mounted state data
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## Module-Level State Management

<o-playground name="Module Internal State Management Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
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
  </code>
  <code path="demo-comp.html" active>
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
                this.cartStore = {}; // Clear the mounted state data when the component is destroyed
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notes

1. **State Cleanup**: During the component's `detached` lifecycle, promptly clear references to state data to avoid memory leaks.

2. **Avoid Circular Dependencies**: Do not form circular references between state objects, as this may cause issues with the reactive system.

3. **Large Data Structures**: For large data structures, consider using computed properties or sharding management to avoid unnecessary performance overhead.

4. **State Consistency**: Pay attention to state consistency in asynchronous operations, and use transactions or batch updates to ensure data integrity.