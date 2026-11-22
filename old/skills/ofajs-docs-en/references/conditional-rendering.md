# Conditional Rendering

In ofa.js, conditional rendering is an important feature that allows you to decide whether to render an element or component based on data state. ofa.js provides a component-based conditional rendering solution through `o-if`, `o-else-if`, and `o-else` components.

## o-if Component

The `o-if` component is used to decide whether to render its content based on the truthiness of an expression. When the bound `value` attribute is truthy, the content inside the component will be rendered; otherwise, the content will not appear in the DOM.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="isHide = !isHide">Toggle Display</button>
  <o-if :value="!isHide">
    <p>{{val}}</p>
  </o-if>
  <script>
    export default async () => {
      return {
        data: {
          isHide: false,
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

### How o-if Works

`o-if` only renders content to the DOM when the condition is true. When the condition is false, the DOM elements inside o-if are completely removed. This implementation is suitable for situations where conditions don't change frequently, as it involves DOM creation and destruction.

## o-else-if and o-else Components

When multiple conditional branches are needed, you can use `o-else-if` and `o-else` components together with `o-if` to implement multi-branch conditional rendering.

- `o-if`: Must be the first conditional component
- `o-else-if`: Optional intermediate conditional component, can have multiple
- `o-else`: Optional default conditional component, placed at the end

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="num++">Toggle Display - {{num}}</button>
  <!-- Display different content based on num modulo 3 -->
  <o-if :value="num % 3 === 0">
    <p>❤️ 0 / 3</p>
  </o-if>
  <o-else-if :value="num % 3 === 1">
    <p>😊 1 / 3</p>
  </o-else-if>
  <o-else>
    <p>😭 2 / 3</p>
  </o-else>
  <script>
    export default async () => {
      return {
        data: {
          num: 0,
        },
      };
    };
  </script>
</template>
```

## Practical Application Examples

### User Permission Control

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .admin-panel {
      background-color: #813b3bff;
      padding: 10px;
      margin: 10px 0;
    }
    .user-info {
      background-color: #3f6e86ff;
      padding: 10px;
      margin: 10px 0;
    }
  </style>
  <div>
    <button on:click="toggleUserRole">Switch User Role</button>
    <p>Current role: {{role}}</p>
    <o-if :value="role === 'admin'">
      <div class="admin-panel">
        <h3>Admin Panel</h3>
        <button>Manage Users</button>
        <button>System Settings</button>
      </div>
    </o-if>
    <o-else-if :value="role === 'user'">
      <div class="user-info">
        <h3>User Info</h3>
        <p>Welcome {{userName}}!</p>
      </div>
    </o-else-if>
    <o-else>
      <p>Please login to view content</p>
    </o-else>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          role: 'guest',
          userName: 'Guest'
        },
        proto: {
          toggleUserRole() {
            if (this.role === 'guest') {
              this.role = 'user';
              this.userName = 'John';
            } else if (this.role === 'user') {
              this.role = 'admin';
            } else {
              this.role = 'guest';
              this.userName = '';
            }
          }
        }
      };
    };
  </script>
</template>
```

### Form Validation Status Display

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    input {
      margin: 5px;
      padding: 5px;
    }
  </style>
  <div>
    <h3>Email Validation Example</h3>
    <input type="email" :value="email" on:input="email = $event.target.value" placeholder="Enter email address">
    <o-if :value="email && isValidEmail(email)">
      <p style="color:green;">✓ Email format is correct</p>
    </o-if>
    <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
      <p style="color:red;">✗ Email format is incorrect</p>
    </o-else-if>
    <o-else>
      <p style="color:orange;">Please enter an email address to validate</p>
    </o-else>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          email: ''
        },
        proto: {
          isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
          }
        }
      };
    };
  </script>
</template>
```

## Conditional Rendering Best Practices

1. **Use Cases**: When elements are rarely switched under different conditions, using `o-if` is more appropriate because it can completely remove unneeded elements, saving memory.

2. **Performance Consideration**: Elements that switch frequently are better suited for class binding (like `class:hide`) rather than conditional rendering, because conditional rendering involves DOM creation and destruction.

3. **Clear Structure**: Conditional rendering is particularly suitable for content switching with different structures, such as tabs, step guides, etc.

## Key Points

- **o-if Component**: Decides whether to render content based on condition, DOM elements are completely removed when condition is false
- **Multi-branch Conditions**: Use `o-if`, `o-else-if`, `o-else` to implement multi-branch conditional rendering
- **Performance Optimization**: Use class binding for frequent switching, use conditional rendering for infrequent switching
- **Applicable Scenarios**: Permission control, form validation, content switching, etc.
