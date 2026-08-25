# Class and Style Binding

In ofa.js, you can achieve flexible UI state management through dynamically binding classes, styles, and properties. This allows the interface to automatically adjust its appearance based on data changes.

## Class Binding

Class binding allows you to dynamically add or remove CSS classes based on data state. You can use the `class:className="booleanExpression"` syntax to bind specific classes.

When `booleanExpression` is `true`, the class name will be added to the element; when `false`, the class name will be removed.

### Basic Class Binding

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .hide {
      display: none;
    }
  </style>
  <button on:click="isHide = !isHide">Toggle Display</button>
  <p class="green" class:hide="isHide">{{val}}</p>
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

### Multiple Class Bindings

You can also bind multiple classes simultaneously, allowing elements to have different appearance states based on different conditions.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .active {
      background-color: #e6f7ff;
      border: 2px solid #1890ff;
    }
    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .highlight {
      font-weight: bold;
      color: #52c41a;
    }
  </style>
  <button on:click="toggleStates">Toggle States</button>
  <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
    Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
  </p>
  <script>
    export default async () => {
      return {
        data: {
          isActive: false,
          isDisabled: false,
          isHighlighted: false,
        },
        proto: {
          toggleStates() {
            this.isActive = !this.isActive;
            this.isDisabled = !this.isDisabled;
            this.isHighlighted = !this.isHighlighted;
          }
        }
      };
    };
  </script>
</template>
```

## Style Binding

Style binding allows you to directly set inline style values, supporting dynamic updates. ofa.js provides two style binding methods:

### Single Style Property Binding

Use `:style.propertyName` syntax to bind specific style properties.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
  <button on:click="isGreen = !isGreen">Toggle Color</button>
  <script>
    export default async () => {
      return {
        data: {
          isGreen: false,
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

### Multiple Style Property Binding

You can also bind multiple style properties at once:

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
    Dynamic Styling Example
  </p>
  <button on:click="changeStyles">Change Styles</button>
  <script>
    export default async () => {
      return {
        data: {
          textColor: 'blue',
          fontSize: 16,
          bgColor: '#f0f0f0'
        },
        proto: {
          changeStyles() {
            this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
            this.fontSize = this.fontSize === 16 ? 20 : 16;
            this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
          }
        }
      };
    };
  </script>
</template>
```

## Attribute Binding

Besides class and style binding, you can also dynamically bind other HTML attributes. ofa.js uses the `attr:attributeName` syntax to implement attribute binding.

### Basic Attribute Binding

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    [bg-color="red"]{
        background-color: red;
    }
    [bg-color="green"]{
        background-color: green;
    }
  </style>
  <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
  <button on:click="changeColor">Change Color</button>  
  <script>
    export default async () => {
      return {
        data: {
          bgColor: "green",
          tooltipText: "This is a tooltip",
          val: "Hover over me to see the title",
        },
        proto: {
          changeColor() {
            this.bgColor = this.bgColor === "green" ? "red" : "green";
          }
        }
      };
    };
  </script>
</template>
```

### Boolean Attribute Handling

For boolean type attributes (like `disabled`, `hidden`), ofa.js will decide whether to add the attribute based on the truthiness of the bound value.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
  <br /><br />
  <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
  <br /><br />
  <label>
    <input type="checkbox" on:change="toggleAll" /> Toggle All States
  </label>
  <script>
    export default async () => {
      return {
        data: {
          isDisabled: false,
          isChecked: true,
          isButtonDisabled: false,
        },
        proto: {
          handleButtonClick() {
            alert('Button clicked!');
          },
          toggleAll(event) {
            const checked = event.target.checked;
            this.isDisabled = checked;
            this.isChecked = checked;
            this.isButtonDisabled = checked;
          }
        }
      };
    };
  </script>
</template>
```

> **Gotcha (booleans with custom `data-*` attributes)**:
> **Built-in boolean attributes** like `attr:disabled="isDisabled"` (disabled / hidden, etc.) are rendered based on the truthiness of the bound value (added when true / removed when false);
> but when you bind a **boolean to a custom `attr:data-xxx="boolValue"`**, a `true` value renders as a **valueless attribute** (e.g. `<button data-active>`), so `e.target.dataset.active` reads `""` (empty string) instead of `"true"`, and checks like `"" !== "true"` silently break your logic.
> **Fix**: always convert booleans bound to `data-*` to explicit strings: `attr:data-active="$data.isActive ? 'true' : 'false'"`.

## data() Function

You can use `data(key)` in styles to bind component data. This is very suitable for scenarios where styles need to be dynamically changed based on component data.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      font-size: 10px;
      color:red;
      transition: all .3s ease;
    }
  </style>
  <style>
    p:hover {
      font-size: data(size);
      color: green;
      transition: all data(time)s ease;
    }
  </style>
  Hover FontSize: <input type="number" sync:value="size" placeholder="This is a two-way bound input" />
  <br />
  TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="This is a two-way bound input" />
  <p>{{val}} - size: {{size}}</p>
  <script>
    export default async () => {
      return {
        data: {
          size: 16,
          time: 0.3,
          val: "Hello ofa.js Demo Code",
        }
      };
    };
  </script>
</template>
```

## Note

The `data(key)` inside the `style` tag will replace the entire style content in principle. To avoid re-rendering unrelated styles, it is recommended to put styles containing `data(key)` in a separate `style` tag, while styles that don't need data binding are placed in another `style` tag for better performance.

```html
<!-- ❌ p:hover without data(key) will also be refreshed -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
```

```html
<!-- ✅ Only styles with data(xxx) will be re-rendered -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```

## Key Points

- **Class Binding**: Use `class:className="booleanExpression"` to dynamically add/remove classes
- **Style Binding**: Use `:style.propertyName` to bind style properties
- **Attribute Binding**: Use `attr:attributeName` to bind HTML attributes
- **data() Function**: Use `data(key)` in styles to bind component data
- **Performance Optimization**: Put styles containing `data(key)` in a separate style tag
