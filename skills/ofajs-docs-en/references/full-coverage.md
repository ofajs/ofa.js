# ofa.js Template Syntax Quick Start Tutorial

## Source File Content

<!-- Source file content start -->

**demo.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Complete Feature Demo</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <script
      src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs"
      type="module"
    ></script>
    <o-page src="./page.html"></o-page>
  </body>
</html>

```

**my-counter.html**
```html
<template component>
  <style>
    :host {
      display: inline-block;
      padding: 10px;
      border: 2px solid #4caf50;
      border-radius: 8px;
      background: #f1f8e9;
    }
    .counter-display {
      font-size: 24px;
      font-weight: bold;
      margin: 0 10px;
    }
    .btn {
      padding: 5px 15px;
      margin: 0 5px;
      cursor: pointer;
    }
  </style>

  <div>
    <slot></slot>
    <span class="counter-display">{{currentValue}}</span>
    <button class="btn" on:click="increment">+</button>
    <button class="btn" on:click="decrement">-</button>
  </div>

  <script>
    export default {
      tag: "my-counter",
      attrs: {
        initialValue: 0,
      },
      data: {
        currentValue: 0,
      },
      watch: {
        initialValue(val) {
          this.currentValue = val;
        },
      },
      proto: {
        increment() {
          this.currentValue++;
          this.emitChange();
        },
        decrement() {
          this.currentValue--;
          this.emitChange();
        },
        emitChange() {
          this.emit("change", {
            data: { value: this.currentValue },
          });
        },
      },
      ready() {
        this.currentValue = this.initialValue;
      },
    };
  </script>
</template>

```

**page.html**
```html
<template page>
  <l-m src="./my-counter.html"></l-m>
  <l-m src="./todo-item.html"></l-m>
  <style>
    :host {
      display: block;
    }
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .active {
      background-color: #e3f2fd;
    }
    .highlight {
      color: #1976d2;
      font-weight: bold;
    }
    .btn {
      padding: 8px 16px;
      margin: 5px;
      cursor: pointer;
    }
    .error {
      color: red;
    }
    .success {
      color: green;
    }
    .warning {
      color: orange;
    }
  </style>

  <div class="container">
    <h1>ofa.js Complete Feature Demo</h1>

    <div class="section">
      <h2>1. Text Interpolation & HTML Rendering</h2>
      <p>Plain text: {{message}}</p>
      <p>Computed property: {{doubleCount}}</p>
      <p>HTML rendering: <span :html="htmlContent"></span></p>
    </div>

    <div class="section">
      <h2>2. Event Binding</h2>
      <button class="btn" on:click="count++">Count +1 ({{count}})</button>
      <button class="btn" on:click="decrement">Count -1</button>
      <button class="btn" on:click="toggle">Toggle State</button>
    </div>

    <div class="section">
      <h2>3. Conditional Rendering (o-if/o-else-if/o-else)</h2>
      <o-if :value="count > 10">
        <p class="success">Count is greater than 10</p>
      </o-if>
      <o-else-if :value="count > 5">
        <p class="warning">Count is greater than 5</p>
      </o-else-if>
      <o-else>
        <p>Count is less than or equal to 5</p>
      </o-else>
    </div>

    <div class="section">
      <h2>4. Dynamic Classes & Styles</h2>
      <p class:active="isActive" class:highlight="count > 3">
        Dynamic class demo (active: {{isActive}}, highlight: {{count > 3}})
      </p>
      <p :style.color="count > 5 ? 'red' : 'blue'" :style.fontSize="'16px'">
        Dynamic style demo (color changes based on count)
      </p>
    </div>

    <div class="section">
      <h2>5. List Rendering (o-fill)</h2>
      <div>
        <button class="btn" on:click="addItem">Add Item</button>
        <button class="btn" on:click="removeItem">Remove Last</button>
      </div>
      <o-fill :value="todoList">
        <todo-item
          attr:idx="$index"
          :content="$data.content"
          sync:completed="$data.completed"
          on:remove="$host.removeTodoItem($index)"
        ></todo-item>
      </o-fill>
    </div>

    <div class="section">
      <h2>6. Custom Component (my-counter)</h2>
      <my-counter :initial-value="5" on:change="handleCounterChange">
        <span>Custom Counter: </span>
      </my-counter>
    </div>

    <div class="section">
      <h2>7. Property Binding Demo</h2>
      <p>One-way binding: {{inputValue}}</p>
      <input type="text" :value="inputValue" on:input="updateInput($event)" />
      <p>Two-way binding: {{syncValue}}</p>
      <input type="text" sync:value="syncValue" />
    </div>

    <div class="section">
      <h2>8. Lifecycle Logs</h2>
      <div :html="lifecycleLogs"></div>
    </div>
  </div>

  <script>
    export default async ({ query }) => {
      return {
        data: {
          message: "Hello ofa.js!",
          count: 0,
          isActive: false,
          htmlContent: "<strong>Bold text</strong>",
          inputValue: "Initial value",
          syncValue: "Two-way binding value",
          todoList: [
            { content: "Learn ofa.js", completed: false },
            { content: "Create components", completed: true },
          ],
          lifecycleLogs: "",
        },
        watch: {
          count(val, { watchers }) {
            if (watchers) {
              const watcher = watchers[0];
              console.log(`count changed: ${watcher.oldValue} -> ${val}`);
            } else {
              // console.log("No watchers means this is initial assignment monitoring");
            }
          },
        },

        proto: {
          get doubleCount() {
            return this.count * 2;
          },
          decrement() {
            if (this.count > 0) this.count--;
          },
          toggle() {
            this.isActive = !this.isActive;
          },
          addItem() {
            this.todoList.push({
              content: `New item ${this.todoList.length + 1}`,
              completed: false,
            });
          },
          removeItem() {
            if (this.todoList.length > 0) {
              this.todoList.pop();
            }
          },
          removeTodoItem(index) {
            this.todoList.splice(index, 1);
          },
          updateInput(event) {
            this.inputValue = event.target.value;
          },
          handleCounterChange(event) {
            console.log("Counter changed:", event.data);
          },
        },
        ready() {
          this.lifecycleLogs += "<p>ready: Page initialization complete</p>";
          console.log("Query params:", query);
        },
        attached() {
          this.lifecycleLogs += "<p>attached: Page mounted</p>";
        },
        detached() {
          console.log("detached: Page unmounted");
        },
      };
    };
  </script>
</template>

```

**todo-item.html**
```html
<template component>
  <style>
    :host {
      display: block;
      padding: 8px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .item-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .text {
      flex: 1;
    }
    .remove-btn {
      color: red;
      cursor: pointer;
      padding: 2px 8px;
    }
  </style>

  <div class="item-content" class:completed="completed">
    <input type="checkbox" sync:checked="completed" />
    <span class="text">{{idx + 1}}. {{content}}</span>
    <span class="remove-btn" on:click="removeSelf">✕</span>
  </div>

  <script>
    export default {
      tag: "todo-item",
      attrs: {
        content: "",
      },
      data: {
        idx: 0,
        completed: false,
      },
      proto: {
        removeSelf() {
          this.emit("remove");
        },
      },
    };
  </script>
</template>

```

<!-- Source file content end -->

## Syntax Explanation

### 1. Basic Structure

#### 1. Importing ofa.js
```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>
```
**Explanation**: Import ofa.js via ES Module, no Node.js or build tools required.

#### 2. Page Container
```html
<o-page src="./page.html"></o-page>
```
**Explanation**: `<o-page>` is used to load page modules, the `src` attribute specifies the page file path.

---

### 2. Page Module (`<template page>`)

#### 1. Page Definition
```html
<template page>
  <!-- Page content -->
  <script>
    export default async ({ query }) => {
      return {
        data: { /* data */ },
        proto: { /* methods */ },
        watch: { /* watchers */ },
        ready() { /* lifecycle */ },
        attached() { /* lifecycle */ },
        detached() { /* lifecycle */ }
      };
    };
  </script>
</template>
```
**Explanation**:
- `<template page>` marks this as a page module
- The export function must be `async`, parameter `{ query }` contains URL query parameters
- The returned object contains page data, methods, and lifecycle hooks

#### 2. Module Reference
```html
<l-m src="./my-counter.html"></l-m>
<l-m src="./todo-item.html"></l-m>
```
**Explanation**: `<l-m>` tag is used to import other component modules, must be declared at the top of the page template.

---

### 3. Component Module (`<template component>`)

#### 1. Component Definition
```html
<template component>
  <style>
    :host { /* Component container styles */ }
  </style>
  
  <div>
    <slot></slot>
    <span>{{currentValue}}</span>
  </div>

  <script>
    export default {
      tag: "my-counter",
      attrs: { /* External properties */ },
      data: { /* Internal data */ },
      watch: { /* Watchers */ },
      proto: { /* Methods */ },
      ready() { /* Lifecycle */ }
    };
  </script>
</template>
```
**Explanation**:
- `<template component>` marks this as a component module
- Must include `tag` field, defining the component tag name
- `:host` selector is used to define component container styles
- `<slot>` is used for slot content

#### 2. Component Properties (`attrs`)
```javascript
attrs: {
  initialValue: 0,
  content: ""
}
```
**Explanation**:
- `attrs` defines external properties of the component
- Can set default values
- Property values can be passed via `:prop` or `attr:prop`
- **Note**: `attrs` and `data` keys cannot be duplicated

#### 3. Component Data (`data`)
```javascript
data: {
  currentValue: 0,
  idx: 0,
  completed: false
}
```
**Explanation**:
- `data` defines internal reactive data of the component
- Data changes automatically update the view

---

### 4. Content Rendering

#### 1. Text Interpolation
```html
<p>Plain text: {{message}}</p>
<p>Computed property: {{doubleCount}}</p>
<span>{{idx + 1}}. {{content}}</span>
```
**Explanation**:
- Use `{{}}` to insert variables or expressions
- Supports computed properties (defined via `get`)
- Supports expression operations

#### 2. HTML Rendering
```html
<span :html="htmlContent"></span>
<div :html="lifecycleLogs"></div>
```
**Explanation**:
- `:html` is used to render HTML strings
- **Warning**: Ensure content is trusted, avoid XSS attacks

---

### 5. Event Binding

#### 1. Inline Expressions
```html
<button on:click="count++">Count +1</button>
```
**Explanation**: Write expressions directly in events, supports increment, decrement, etc.

#### 2. Method Calls
```html
<button on:click="decrement">Count -1</button>
<button on:click="toggle">Toggle State</button>
<button on:click="addItem">Add Item</button>
```
**Explanation**: Call methods defined in `proto`.

#### 3. Events with Parameters
```html
<input :value="inputValue" on:input="updateInput($event)" />
<span on:click="removeSelf">✕</span>
```
**Explanation**:
- `$event` is the event object
- Can pass custom parameters

#### 4. Component Event Listening
```html
<my-counter on:change="handleCounterChange">
</my-counter>

<todo-item on:remove="$host.removeTodoItem($index)">
</todo-item>
```
**Explanation**:
- Listen to custom events triggered by components
- `$host` references the parent component instance
- Components use `this.emit("eventName", data)` internally to trigger events

---

### 6. Conditional Rendering

#### 1. Basic Usage
```html
<o-if :value="count > 10">
  <p class="success">Count is greater than 10</p>
</o-if>
<o-else-if :value="count > 5">
  <p class="warning">Count is greater than 5</p>
</o-else-if>
<o-else>
  <p>Count is less than or equal to 5</p>
</o-else>
```
**Explanation**:
- `<o-if>`, `<o-else-if>`, `<o-else>` must be used consecutively
- `:value` binds conditional expression
- Content is rendered when condition is true

---

### 7. List Rendering

#### 1. Basic Usage
```html
<o-fill :value="todoList">
  <todo-item
    attr:idx="$index"
    :content="$data.content"
    sync:completed="$data.completed"
    on:remove="$host.removeTodoItem($index)"
  ></todo-item>
</o-fill>
```
**Explanation**:
- `<o-fill>` is used for list rendering
- `:value` binds array data
- **`$index`** is the current item index (starting from 0)
- **`$data`** is the current item data object
- **`$host`** is the parent component instance reference

**⚠️ Important**: Inside o-fill, **you must use `$data`, `$index`, `$host`** these special variables, cannot use other variable names (like item, element, row, etc.).

#### 2. List Operations
```javascript
addItem() {
  this.todoList.push({
    content: `New item ${this.todoList.length + 1}`,
    completed: false
  });
},
removeItem() {
  if (this.todoList.length > 0) {
    this.todoList.pop();
  }
},
removeTodoItem(index) {
  this.todoList.splice(index, 1);
}
```
**Explanation**: Supports array operations like push, pop, splice, view updates automatically.

---

### 8. Property Binding

#### 1. One-Way Binding (`:`)
```html
<input :value="inputValue" />
<span :html="htmlContent"></span>
<my-counter :initial-value="5"></my-counter>
```
**Explanation**:
- `:prop="value"` passes data one-way to property
- Data changes update property, but property changes don't affect data
- Supports kebab-case naming: `:initial-value`

#### 2. Two-Way Binding (`sync:`)
```html
<input sync:value="syncValue" />
<input type="checkbox" sync:checked="completed" />
```
**Explanation**:
- `sync:prop="value"` achieves two-way binding
- Data and property affect each other
- Commonly used for form elements

**Note**: Avoid binding `sync:` with `attrs` properties to prevent infinite update loops caused by type conversion (freezing the interface).

#### 3. Attribute Passing (`attr:`)
```html
<todo-item attr:idx="$index"></todo-item>
```
**Explanation**:
- `attr:prop="value"` passes value as string attribute
- Suitable for scenarios requiring string attributes

---

### 9. Class and Style Binding

#### 1. Dynamic Classes
```html
<p class:active="isActive" class:highlight="count > 3">
  Dynamic class demo
</p>
<div class:completed="completed">
  Todo item
</div>
```
**Explanation**:
- `class:className="condition"` adds/removes class based on condition
- Class is added when condition is true, removed when false
- Can use multiple dynamic classes simultaneously

#### 2. Dynamic Styles
```html
<p :style.color="count > 5 ? 'red' : 'blue'" :style.fontSize="'16px'">
  Dynamic style demo
</p>
```
**Explanation**:
- `:style.property="value"` binds inline styles
- Supports all CSS properties
- Property names use camelCase: `fontSize` not `font-size`

---

### 10. Computed Properties and Watchers

#### 1. Computed Properties
```javascript
proto: {
  get doubleCount() {
    return this.count * 2;
  }
}
```
**Explanation**:
- Use `get` keyword to define computed properties
- Computed properties are cached and recalculated when dependencies change
- Use like regular properties in templates: `{{doubleCount}}`

#### 2. Watchers
```javascript
watch: {
  count(val, { watchers }) {
    if (watchers) {
      const watcher = watchers[0];
      console.log(`count changed: ${watcher.oldValue} -> ${val}`);
    } else {
      // No watchers means this is initial assignment monitoring
    }
  },
  initialValue(val) {
    this.currentValue = val;
  }
}
```
**Explanation**:
- `watch` object defines watchers
- Function parameters: `val` (new value), `{ watchers }` (object containing old value)
- `watchers[0].oldValue` gets old value
- Empty `watchers` means initial assignment, not triggered by data change
- Commonly used to perform side effects in response to data changes

---

### 11. Lifecycle Hooks

#### 1. Page Lifecycle
```javascript
ready() {
  this.lifecycleLogs += "<p>ready: Page initialization complete</p>";
  console.log("Query params:", query);
},
attached() {
  this.lifecycleLogs += "<p>attached: Page mounted</p>";
},
detached() {
  console.log("detached: Page unmounted");
}
```
**Explanation**:
- `ready()`: Called when component/page initialization is complete
- `attached()`: Called when component/page is mounted to DOM
- `detached()`: Called when component/page is removed from DOM

#### 2. Component Lifecycle
```javascript
ready() {
  this.currentValue = this.initialValue;
}
```
**Explanation**: Component's `ready()` is commonly used to initialize internal data.

---

### 12. Component Communication

#### 1. Parent to Child (Property Passing)
```html
<my-counter :initial-value="5">
  <span>Custom Counter: </span>
</my-counter>
```
**Explanation**:
- Parent component passes data to child component via properties
- Child component declares reception in `attrs`

#### 2. Child to Parent (Event Triggering)
```javascript
// Child component
emitChange() {
  this.emit("change", {
    data: { value: this.currentValue }
  });
}

// Parent component listening
<my-counter on:change="handleCounterChange">
</my-counter>
```
**Explanation**:
- Child component uses `this.emit()` to trigger events
- Parent component uses `on:eventName` to listen to events

#### 3. Slots
```html
<my-counter>
  <span>Custom Counter: </span>
</my-counter>

<!-- Inside component -->
<div>
  <slot></slot>
  <span>{{currentValue}}</span>
</div>
```
**Explanation**:
- `<slot>` tag defines slot position
- Parent component content renders at slot location

---

### 13. Special Variables

#### 1. Template Variables
- `$index`: Current index in list rendering
- `$data`: Current data item in list rendering
- `$event`: Event object
- `$host`: Parent component instance

#### 2. Usage Example
```html
<o-fill :value="todoList">
  <todo-item
    attr:idx="$index"
    :content="$data.content"
    on:remove="$host.removeTodoItem($index)"
  ></todo-item>
</o-fill>
```

---

### 14. Style Scoping

#### 1. Component Styles
```html
<template component>
  <style>
    :host {
      display: block;
      padding: 8px;
    }
    .completed {
      text-decoration: line-through;
    }
  </style>
</template>
```
**Explanation**:
- Styles inside components are automatically scoped
- `:host` selector targets component container
- Class names won't conflict with external ones

---

### 15. Best Practices

#### 1. Data Definition
- `attrs`: Properties passed from outside
- `data`: State managed internally
- **Avoid**: Using same keys in `attrs` and `data`

#### 2. Method Definition
```javascript
proto: {
  increment() { /* method */ },
  decrement() { /* method */ }
}
```
**Explanation**: All methods are defined in the `proto` object.

#### 3. Computed Properties
```javascript
proto: {
  get doubleCount() {
    return this.count * 2;
  }
}
```
**Explanation**: Use `get` keyword, not `computed`.

#### 4. Event Naming
```javascript
this.emit("change", { data: { value: this.currentValue } });
```
**Explanation**: Event names use lowercase, multiple words connected with hyphens.

---

### 16. Common Error Comparison

| ❌ Wrong Way | ✅ Correct Way | Explanation |
|------------|-----------|------|
| `computed: { double() {} }` | `get double() {}` | Use getter to define computed properties |
| `v-if="show"` | `<o-if :value="show">` | Use o-if component |
| `v-for="item in list"` | `<o-fill :value="list">` | Use o-fill component |
| `@click="handle"` | `on:click="handle"` | Event binding uses on: prefix |
| `:class="{ active: isActive }"` | `class:active="isActive"` | Dynamic class uses class: syntax |
| `v-model="value"` | `sync:value="value"` | Two-way binding uses sync: syntax |
| `methods: { foo() {} }` | `proto: { foo() {} }` | Methods defined in proto object |
| `data() { return {} }` | `data: {}` | data is an object not a function |
