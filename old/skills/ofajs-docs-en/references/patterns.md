# ofa.js Common Patterns and Best Practices

This document summarizes common code patterns and best practices in ofa.js development, helping developers quickly solve common problems.

---

## Form Handling

### Basic Form Two-Way Binding

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    input, select, textarea { 
      padding: 8px; 
      margin: 5px 0; 
      width: 100%; 
      box-sizing: border-box; 
    }
  </style>
  
  <h3>User Registration</h3>
  <input type="text" sync:value="form.username" placeholder="Username">
  <input type="email" sync:value="form.email" placeholder="Email">
  <input type="password" sync:value="form.password" placeholder="Password">
  <select sync:value="form.role">
    <option value="user">Regular User</option>
    <option value="admin">Administrator</option>
  </select>
  <label>
    <input type="checkbox" sync:checked="form.agree"> Agree to Terms
  </label>
  <button on:click="submit">Submit</button>
  
  <script>
    export default async () => ({
      data: {
        form: {
          username: '',
          email: '',
          password: '',
          role: 'user',
          agree: false
        }
      },
      proto: {
        submit() {
          if (!this.form.agree) {
            alert('Please agree to terms');
            return;
          }
          console.log('Submit data:', this.form);
        }
      }
    });
  </script>
</template>
```

### Form Validation Pattern

```html
<template page>
  <style>
    :host { display: block; padding: 15px; }
    .form-group { margin-bottom: 15px; }
    .error { color: red; font-size: 12px; }
    input.error-input { border-color: red; }
  </style>
  
  <div class="form-group">
    <input 
      type="text" 
      sync:value="form.username" 
      class:error-input="errors.username"
      placeholder="Username (3-10 characters)">
    <span class="error" o-if:="errors.username">{{errors.username}}</span>
  </div>
  
  <div class="form-group">
    <input 
      type="email" 
      sync:value="form.email"
      class:error-input="errors.email"
      placeholder="Email">
    <span class="error" o-if:="errors.email">{{errors.email}}</span>
  </div>
  
  <button on:click="submit" attr:disabled="!isValid">Submit</button>
  
  <script>
    export default async () => ({
      data: {
        form: { username: '', email: '' },
        errors: {}
      },
      proto: {
        get isValid() {
          return Object.keys(this.errors).length === 0 
            && this.form.username 
            && this.form.email;
        }
      },
      watch: {
        'form.username'(val) {
          if (val.length < 3 || val.length > 10) {
            this.errors = { ...this.errors, username: 'Username needs 3-10 characters' };
          } else {
            const { username, ...rest } = this.errors;
            this.errors = rest;
          }
        },
        'form.email'(val) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            this.errors = { ...this.errors, email: 'Please enter a valid email' };
          } else {
            const { email, ...rest } = this.errors;
            this.errors = rest;
          }
        }
      }
    });
  </script>
</template>
```

---

## List Operations

### Add/Edit/Delete List

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .item { 
      display: flex; 
      align-items: center; 
      padding: 8px; 
      margin: 5px 0; 
      background: #f5f5f5; 
    }
    .item input { flex: 1; margin: 0 10px; }
    button { margin: 5px; padding: 5px 10px; }
  </style>
  
  <h3>Todo List</h3>
  <div>
    <input sync:value="newItem" placeholder="Add new item">
    <button on:click="addItem">Add</button>
  </div>
  
  <o-fill :value="todos" fill-key="id">
    <div class="item">
      <input type="checkbox" sync:checked="$data.done">
      <input sync:value="$data.text">
      <button on:click="$host.removeItem($data.id)">Delete</button>
    </div>
  </o-fill>
  
  <p>Completed: {{completedCount}} / {{todos.length}}</p>
  
  <script>
    let idCounter = 0;
    export default async () => ({
      data: {
        todos: [
          { id: ++idCounter, text: 'Learn ofa.js', done: false },
          { id: ++idCounter, text: 'Build app', done: false }
        ],
        newItem: ''
      },
      proto: {
        get completedCount() {
          return this.todos.filter(t => t.done).length;
        },
        addItem() {
          if (!this.newItem.trim()) return;
          this.todos.push({
            id: ++idCounter,
            text: this.newItem,
            done: false
          });
          this.newItem = '';
        },
        removeItem(id) {
          const index = this.todos.findIndex(t => t.id === id);
          if (index > -1) {
            this.todos.splice(index, 1);
          }
        }
      }
    });
  </script>
</template>
```

### Nested List (Tree Structure)

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .tree-node { margin-left: 20px; }
    .node-label { 
      padding: 5px; 
      cursor: pointer; 
      display: inline-block;
    }
    .node-label:hover { background: #e0e0e0; }
  </style>
  
  <o-fill :value="tree" fill-key="id">
    <div>
      <span class="node-label" on:click="$host.toggle($data)">
        {{$data.expanded ? '▼' : '▶'}} {{$data.name}}
      </span>
      <div class="tree-node" o-if:="$data.expanded && $data.children">
        <o-fill :value="$data.children" fill-key="id">
          <div class="node-label">{{$data.name}}</div>
        </o-fill>
      </div>
    </div>
  </o-fill>
  
  <script>
    export default async () => ({
      data: {
        tree: [
          {
            id: 1,
            name: 'Frontend Tech',
            expanded: false,
            children: [
              { id: 11, name: 'HTML' },
              { id: 12, name: 'CSS' },
              { id: 13, name: 'JavaScript' }
            ]
          },
          {
            id: 2,
            name: 'Backend Tech',
            expanded: false,
            children: [
              { id: 21, name: 'Node.js' },
              { id: 22, name: 'Python' }
            ]
          }
        ]
      },
      proto: {
        toggle(node) {
          node.expanded = !node.expanded;
        }
      }
    });
  </script>
</template>
```

---

## Component Communication

### Parent-Child Component Communication (Props + Events)

```html
<!-- parent.html -->
<template page>
  <l-m src="./child.html"></l-m>
  <style>:host { display: block; padding: 10px; }</style>
  
  <child-comp :message="parentMessage" on:message-change="handleMessageChange">
  </child-comp>
  <p>From child: {{receivedMessage}}</p>
  
  <script>
    export default async () => ({
      data: {
        parentMessage: 'Hello from parent',
        receivedMessage: ''
      },
      proto: {
        handleMessageChange(e) {
          this.receivedMessage = e.data.text;
        }
      }
    });
  </script>
</template>
```

```html
<!-- child.html -->
<template component>
  <style>
    :host { display: block; padding: 10px; border: 1px solid #ccc; }
  </style>
  
  <p>From parent: {{message}}</p>
  <input sync:value="reply" placeholder="Reply to parent">
  <button on:click="sendReply">Send</button>
  
  <script>
    export default async () => ({
      tag: 'child-comp',
      data: {
        message: '',
        reply: ''
      },
      proto: {
        sendReply() {
          this.emit('message-change', {
            data: { text: this.reply }
          });
        }
      }
    });
  </script>
</template>
```

### Cross-Level Communication (Provider/Consumer)

```html
<!-- app.html -->
<template>
  <o-provider name="appState" user-name="John" theme="dark">
    <o-page src="./page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
<template page>
  <l-m src="./user-info.html"></l-m>
  <user-info></user-info>
  
  <o-consumer name="appState" watch:user-name="userName" watch:theme="theme"></o-consumer>
  
  <script>
    export default {
      data: { userName: '', theme: '' }
    };
  </script>
</template>
```

---

## Single-Page Business Splitting (Embedded Sub-page Pattern)

### When to Split

When a single page module carries "main list + dialog form + multiple sub-flows" at the same time, `data` / `proto` bloat quickly and responsibilities blur. Criteria:

- The dialog contains an **independent form or multi-step flow** → split into a separate page module
- The page's `data` is polluted with lots of temporary state unrelated to the main content (`form` / `dialogOpen` / `editingId` …) → split
- Small purely-presentational fragments with no independent business state → use a component module (`<template component>`), don't split into a page

### Communication Pattern: Method Call Down + Event Bubbling Up

```
Host page                                Sub-page (e.g. form.html)
   │                                        │
   │  this.shadow.$("#x").openForm(params)  │  ← method call to pass params down
   │ ────────────────────────────────────▶  │
   │                                        │
   │  emit("form-save", { data,             │  ← event bubbling to pass results up
   │    bubbles: true, composed: true })    │
   │ ◀────────────────────────────────────  │
   │  on:form-save="onFormSave" → event.data│
```

Key rules:

1. **The `src` of `<o-page>` is immutable after initialization**. Assigning it at runtime (including `:src` dynamic binding, changing query to pass params) throws `A page that has already been initialized cannot be set with the src attribute`. Therefore runtime param passing **must go through method calls**, never by changing src/query
2. **Events passed up must use `bubbles: true, composed: true`**: the sub-page lives inside the host's Shadow DOM; `composed` defaults to `false`, and the host's `on:xxx` listener on the `<o-page>` tag won't fire
3. **Division of responsibility**: the sub-page only handles form completeness (non-empty validation, interaction state); normalization, id/timestamp generation, and persistence all happen in the host
4. **Cancel/close does not notify the host**: only flip the sub-page's own `dialogOpen = false`, no side effects

### Complete Example

Host page (list + resident embedded dialog page):

```html
<template page>
  <style>:host { display: block; }</style>

  <!-- Resident embedded sub-page; on:form-save catches the bubbled-up event -->
  <o-page id="form-page" src="./form.html" on:form-save="onFormSave"></o-page>

  <button on:click="openAdd">Add</button>
  <script>
    export default async () => ({
      data: { items: [] },
      proto: {
        getForm() {
          const page = this.shadow.$("#form-page");
          return page?.openForm ? page : null; // defense when the sub-page isn't ready
        },
        openAdd() {
          this.getForm()?.openForm({ count: this.items.length });
        },
        openEdit(event, item) {
          event.stopPropagation();
          this.getForm()?.openForm({ id: item.id, name: item.name });
        },
        onFormSave(event) {
          const { id, name } = event.data;
          if (id) {
            const target = this.items.find((it) => it.id === id);
            if (target) target.name = name;
          } else {
            this.items.push({ id: `${Date.now()}`, name });
          }
          // business normalization and persistence all happen in the host
        },
      },
    });
  </script>
</template>
```

Sub-page (carries its own `p-dialog`, owns the form state):

```html
<template page>
  <style>:host { display: block; }</style>

  <p-dialog sync:open="dialogOpen" auto-close>
    <span slot="title">{{editingId ? 'Edit' : 'Add'}}</span>
    <!-- form controls sync:value="form.xxx" -->
    <div slot="bottom">
      <p-button variant="text" on:click="dialogOpen = false">Cancel</p-button>
      <p-button color="primary" on:click="save">Save</p-button>
    </div>
  </p-dialog>

  <script>
    export default async ({ load }) => {
      // the sub-page loads its own dependencies on demand (toast, etc.), independent of the host
      return {
        data: {
          dialogOpen: false,
          editingId: "",
          form: { name: "" },
        },
        proto: {
          // entry point called by the host: fill params and open the dialog
          openForm({ id = "", name = "" } = {}) {
            this.editingId = id;
            this.form.name = name;
            this.dialogOpen = true;
          },
          save() {
            if (!this.form.name.trim()) return; // only non-empty validation
            this.emit("form-save", {
              data: { id: this.editingId, name: this.form.name },
              bubbles: true,
              composed: true, // cross Shadow DOM so the host can hear it
            });
            this.dialogOpen = false;
          },
        },
      };
    };
  </script>
</template>
```

### Needing a Fresh Instance Each Time (Destroy and Recreate)

When the sub-page is allowed to lose state and you want a clean start each time, wrap it with `o-if` (toggling `o-if` clears and re-renders its internal nodes, so the `o-page` is destroyed and recreated accordingly, bypassing the immutable-src restriction):

```html
<o-if :value="formVisible">
  <o-page src="./form.html" on:form-save="onFormSave"></o-page>
</o-if>
```

Note: after recreation it is a brand-new instance; params must be passed again via method call. For dialog scenarios, the **resident + `openForm()` state-reset** approach is preferred.

---

## State Management

### Global State

```javascript
// store.js
export const userStore = $.stanz({
  isLoggedIn: false,
  userInfo: null,
  token: ''
});

export const cartStore = $.stanz({
  items: [],
  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
});
```

```html
<!-- component.html -->
<template component>
  <style>:host { display: block; }</style>
  
  <div o-if:="user.isLoggedIn">
    Welcome, {{user.userInfo.name}}
  </div>
  <div o-else>
    <button on:click="login">Login</button>
  </div>
  
  <script>
    import { userStore } from './store.js';
    
    export default async () => ({
      tag: 'user-panel',
      data: {
        user: {}
      },
      attached() {
        this.user = userStore;
      },
      detached() {
        this.user = {};
      },
      proto: {
        login() {
          userStore.isLoggedIn = true;
          userStore.userInfo = { name: 'John' };
        }
      }
    });
  </script>
</template>
```

---

## Conditional Rendering Best Practices

### Use class for frequent switching, use o-if for infrequent switching

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .hidden { display: none; }
    .fade-in { animation: fadeIn 0.3s; }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
  
  <!-- Frequent switching: use class -->
  <div class:hidden="!isVisible" class="fade-in">
    This element will frequently show/hide
  </div>
  
  <!-- Infrequent switching: use o-if -->
  <o-if :value="hasPermission">
    <div>Admin Panel (condition changes infrequently)</div>
  </o-if>
  
  <script>
    export default async () => ({
      data: {
        isVisible: true,
        hasPermission: false
      }
    });
  </script>
</template>
```

---

## Performance Optimization

### Use fill-key for List Rendering

`fill-key` is optional, but when list items have a unique identifier field (e.g. `id`), always add it when writing code; without it, list items get rebuilt on array add/remove/reorder, losing in-item state.

```html
<!-- Recommended: use unique identifier -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>

<!-- Not recommended: no fill-key, items rebuilt when array order changes -->
<o-fill :value="items">
  <div>{{$data.name}}</div>
</o-fill>
```

### Separate Dynamic Styles

```html
<!-- Recommended: dynamic styles stored separately -->
<style>
  .box { padding: 10px; border: 1px solid #ccc; }
</style>
<style>
  .box { 
    font-size: data(fontSize); 
    color: data(textColor);
  }
</style>

<!-- Not recommended: all styles mixed together, re-renders every time -->
<style>
  .box { 
    padding: 10px; 
    font-size: data(fontSize); 
    color: data(textColor);
  }
</style>
```

### Clean Up Resources Timely

```javascript
export default async () => ({
  data: { timer: null },
  attached() {
    this.timer = setInterval(() => {
      console.log('tick');
    }, 1000);
  },
  detached() {
    // Must clean up timer to avoid memory leak
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
});
```

---

## Common Error Avoidance

### Avoid Directly Modifying Monitored Data in Watchers

```javascript
// Wrong: may cause infinite loop
watch: {
  count(val) {
    this.count = val + 1; // Dangerous!
  }
}

// Correct: add conditional judgment
watch: {
  count(val) {
    if (val < 100) {
      this.count = val + 1;
    }
  }
}
```

### Component Tag Name Must Match tag

```html
<!-- Wrong: tag name doesn't match tag -->
<my-component></my-component>
<script>
  export default async () => ({
    tag: 'my-comp', // Doesn't match!
    // ...
  });
</script>

<!-- Correct: tag name matches tag -->
<my-comp></my-comp>
<script>
  export default async () => ({
    tag: 'my-comp', // Matches
    // ...
  });
</script>
```

### Clean Up References Timely in State Management

```javascript
// Correct pattern
attached() {
  this.userData = store.user;
},
detached() {
  this.userData = {}; // Clean up reference to prevent memory leak
}
```

---

## Practical Code Snippets

### Debounced Search

```html
<template page>
  <input sync:value="keyword" placeholder="Search...">
  <ul>
    <o-fill :value="results">
      <li>{{$data.name}}</li>
    </o-fill>
  </ul>
  
  <script>
    export default async () => ({
      data: {
        keyword: '',
        results: [],
        allItems: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
      },
      watch: {
        keyword(val) {
          clearTimeout(this._searchTimer);
          this._searchTimer = setTimeout(() => {
            this.results = this.allItems.filter(item => 
              item.toLowerCase().includes(val.toLowerCase())
            );
          }, 300);
        }
      },
      attached() {
        this.results = this.allItems;
      },
      detached() {
        clearTimeout(this._searchTimer);
      }
    });
  </script>
</template>
```

### Tab Switching

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .tabs { display: flex; border-bottom: 1px solid #ccc; }
    .tab { 
      padding: 10px 20px; 
      cursor: pointer; 
      border-bottom: 2px solid transparent;
    }
    .tab.active { 
      border-bottom-color: #007acc; 
      color: #007acc; 
    }
    .panel { padding: 20px; }
  </style>
  
  <div class="tabs">
    <div 
      class="tab" 
      class:active="activeTab === 'home'"
      on:click="activeTab = 'home'">Home</div>
    <div 
      class="tab" 
      class:active="activeTab === 'profile'"
      on:click="activeTab = 'profile'">Profile</div>
    <div 
      class="tab" 
      class:active="activeTab === 'settings'"
      on:click="activeTab = 'settings'">Settings</div>
  </div>
  
  <div class="panel">
    <o-if :value="activeTab === 'home'">Home Content</o-if>
    <o-else-if :value="activeTab === 'profile'">Profile Center</o-else-if>
    <o-else>Settings Page</o-else>
  </div>
  
  <script>
    export default async () => ({
      data: { activeTab: 'home' }
    });
  </script>
</template>
```

### Modal Component

```html
<template component>
  <style>
    :host { display: block; }
    .overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
    }
  </style>
  
  <div class="overlay" o-if:="visible" on:click="close">
    <div class="modal" on:click="event.stopPropagation()">
      <h3>{{title}}</h3>
      <slot></slot>
      <button on:click="close">Close</button>
    </div>
  </div>
  
  <script>
    export default async () => ({
      tag: 'modal-dialog',
      data: {
        visible: false,
        title: 'Prompt'
      },
      proto: {
        open() {
          this.visible = true;
        },
        close() {
          this.visible = false;
          this.emit('close');
        }
      }
    });
  </script>
</template>
```
