# Conditional Rendering

In ofa.js, conditional rendering is an important feature that allows deciding whether to render an element or component based on data state. ofa.js provides a component-based conditional rendering solution, implemented through the `o-if`, `o-else-if`, and `o-else` components.

## o-if Component

The `o-if` component is used to decide whether to render its content based on the truthiness of an expression. When the bound `value` attribute is truthy, the content inside the component will be rendered; otherwise, the content will not appear in the DOM.

<o-playground name="Example of o-if working principle" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

### Working Principle of o-if

`o-if` renders content into the DOM only when the condition is true. When the condition is false, the DOM elements inside `o-if` are completely removed. This implementation is suitable for scenarios where the condition does not change frequently, as it involves the creation and destruction of DOM elements.

## o-else-if and o-else Components

When multiple conditional branches are needed, you can use the `o-else-if` and `o-else` components together with `o-if` to implement multi-branch conditional rendering.

- `o-if`: The first conditional component that must be present
- `o-else-if`: Optional intermediate conditional component, multiple allowed
- `o-else`: Optional default conditional component, placed last

<o-playground name="Multi-branch Conditional Rendering Example" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- According to the result of num modulo 3, switch to display different content -->
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
  </code>
</o-playground>

## Practical Application Scene Examples

### User Permission Control

<o-playground name="User Permission Control Example" style="--editor-height: 500px">
  <code>
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
        <button on:click="toggleUserRole">Toggle User Role</button>
        <p>Current Role: {{role}}</p>
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
          <p>Please log in to view content</p>
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
                  this.userName = 'Zhang San';
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
  </code>
</o-playground>

### Form Validation Status Display

<o-playground name="Form Validation Status Display Example" style="--editor-height: 500px">
  <code>
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
          <p style="color:green;">✓ Email format is valid</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ Email format is invalid</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Please enter an email address for validation</p>
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
  </code>
</o-playground>

## Conditional Rendering Best Practices

1. **Usage Scenarios**: When elements rarely switch between different conditions, using `o-if` is more appropriate because it completely removes unnecessary elements, saving memory.

2. **Performance Considerations**: Frequently switching elements are better suited for using class bindings (such as `class:hide`) rather than conditional rendering, as conditional rendering involves DOM creation and destruction.

3. **Clear Structure**: Conditional rendering is particularly suitable for content switching with different structures, such as tabs, step guides, etc.