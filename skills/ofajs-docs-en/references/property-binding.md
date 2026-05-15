# Property Binding

In ofa.js, property binding is an important way to achieve data synchronization between components. Through property binding, you can pass data from parent components to child components and achieve two-way data synchronization.

## One-Way Property Binding (`:`)

One-way property binding passes data from parent components to child components, but child component changes don't affect the parent component.

### Basic Usage

Use the `:propertyName="dataProperty"` syntax to bind properties:

```html
<template page>
  <l-m src="./user-card.html"></l-m>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  <user-card :user-name="name" :user-age="age"></user-card>
  <script>
    export default async () => {
      return {
        data: {
          name: "John",
          age: 25
        }
      };
    };
  </script>
</template>
```

```html
<!-- user-card.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid #ddd;
      padding: 10px;
    }
  </style>
  <p>Name: {{userName}}</p>
  <p>Age: {{userAge}}</p>
  <script>
    export default {
      tag: "user-card",
      data: {
        userName: "",
        userAge: 0
      }
    };
  </script>
</template>
```

### Naming Conversion

Since HTML attributes are case-insensitive, when binding properties containing uppercase letters, you need to use kebab-case format:

```html
<!-- Property name: userName -->
<user-card :user-name="name"></user-card>
```

## Two-Way Property Binding (`sync:`)

Two-way property binding achieves bidirectional data synchronization between parent and child components. When data changes on either side, the other side updates accordingly.

### Basic Usage

Use the `sync:propertyName="dataProperty"` syntax:

```html
<template page>
  <l-m src="./counter-input.html"></l-m>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  <p>Current Value: {{value}}</p>
  <counter-input sync:value="value"></counter-input>
  <script>
    export default async () => {
      return {
        data: {
          value: 10
        }
      };
    };
  </script>
</template>
```

```html
<!-- counter-input.html -->
<template component>
  <style>
    :host {
      display: block;
    }
    input {
      padding: 8px;
      font-size: 16px;
    }
  </style>
  <input type="number" sync:value="value" />
  <script>
    export default {
      tag: "counter-input",
      data: {
        value: 0
      }
    };
  </script>
</template>
```

### Two-Way Binding with Native Elements

Two-way binding can also be used directly with native form elements:

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  <p>Input Value: {{inputValue}}</p>
  <input type="text" sync:value="inputValue" />
  <p>Checkbox Status: {{isChecked}}</p>
  <input type="checkbox" sync:checked="isChecked" />
  <script>
    export default async () => {
      return {
        data: {
          inputValue: "",
          isChecked: false
        }
      };
    };
  </script>
</template>
```

### Object Two-Way Binding

For object type data binding, **you don't need to use the `sync` syntax**. Simply use `:` for one-way passing. This is because JavaScript objects are reference-shared. When a parent component passes an object to a child component, the child component gets a reference to the same object, so any modifications to the object are directly reflected in the original data.

ofa.js preserves this JavaScript characteristic, so one-way passing of objects is effectively equivalent to two-way passing. For example:

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "John", age: 25 } }
      };
    };
  </script>
</template>
```

In the `child-comp` component, if you modify `userData.name` directly, `userInfo.name` in the parent component will also update simultaneously, because they point to the same object reference.

## Property Binding vs Attribute Binding

| Feature | Property Binding (`:`) | Attribute Binding (`attr:`) |
|------|-----------------|-------------------|
| Data Type | Maintains original type | All converted to strings |
| Update Mechanism | Reactive updates | One-time setting |
| Use Cases | Component communication | Native HTML attributes |

## Notes

1. **Avoid Circular Binding**: Don't bind the same property to itself, this will cause infinite update loops
2. **Initial Values**: Ensure data has appropriate initial values
3. **Type Consistency**: Maintain data type consistency in two-way binding

## Key Points

- **One-Way Binding (`:`)**: Parent to child data passing
- **Two-Way Binding (`sync:`)**: Bidirectional data synchronization
- **Naming Conversion**: Use kebab-case format (`userName` → `user-name`)
- **Native Elements**: Supports two-way binding with native form elements
- **Data Type**: Property binding maintains original data types
