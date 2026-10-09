# Deep Property Binding

In previous content, we introduced the basic usage of property binding. Previous examples were used to bind the `value` property of native browser elements. This section will explore the essence of property binding - it actually binds to JavaScript properties of the component after instantiation, not HTML attributes.

## Component Property Binding Mechanism

In ofa.js, when we use the `:toProp="fromProp"` syntax in a parent component, we are setting JavaScript properties of the child component instance, not HTML attributes. This is importantly different from directly setting HTML attributes (like `attr:toKey="fromKey"`).

```html
<!-- page1.html -->
<template page>
  <l-m src="./demo-comp.html"></l-m>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <h3 style="color:blue;">{{val}}</h3>
  <demo-comp :full-name="val"></demo-comp>
  <script>
    export default async () => {
      return {
        data: {
          val: "ofajs",
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
    :host {
      display: block;
      border: 1px solid green;
      padding: 8px;
      margin: 8px;
    }
  </style>
  <p>FullName: {{fullName}}</p>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
        data: {
          fullName: ""
        },
      };
    };
  </script>
</template>
```

## Property Binding vs Attribute Inheritance

Note that property binding (`:`) and attribute inheritance (`attr:`) have the following key differences:

### Property Binding (`:`)
- Binds to JavaScript properties of the component instance
- Passed data maintains original type (string, number, boolean, etc.)
- Can be directly accessed and modified inside the component, even without pre-defining `data` in the component

### Attribute Inheritance (`attr:`)
- Sets HTML attributes
- All values are converted to strings
- Mainly used to pass attributes to underlying DOM elements
- Requires special handling to parse complex data
- Must pre-define `attrs` in the component to receive attribute values

Syntax comparison:
```html
<!-- Property binding: passes JavaScript values, maintains data type -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Attribute inheritance: sets HTML attributes, all values become strings -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- Actually passes string "42" -->
```

## Two-Way Data Binding

Instantiated components also support two-way data binding using the `sync:toProp="fromProp"` syntax. Two-way binding allows data synchronization between parent and child components. When data changes on either side, the other side will update accordingly.

> Unlike Angular and Vue, ofa.js natively supports two-way data binding syntax without requiring special configuration or extra operations for components.

### Differences Between Two-Way Binding and Regular Property Binding

| Feature | Regular Property Binding (`:`) | Two-Way Binding (`sync:`) |
|------|-------------------|-------------------|
| Data Flow | One-way: Parent → Child | Two-way: Parent ↔ Child |
| Syntax | `:prop="value"` | `sync:prop="value"` |
| Child Component Modification | Doesn't affect parent component | Affects parent component |
| Use Cases | Parent passes config to child | Need parent-child data synchronization |

### Notes

1. **Performance Consideration**: Two-way binding triggers re-rendering when data changes, should be used cautiously in complex scenarios
2. **Data Flow Control**: Too many two-way bindings can make data flow hard to track, suggest reasonably designing component communication methods
3. **Component Compatibility**: Not all components are suitable for two-way binding, need to consider the component's design purpose

## Key Points

- **Property Binding**: Binds to JavaScript properties of component instance, maintains data type
- **Attribute Inheritance**: Sets HTML attributes, all values become strings
- **Two-Way Binding**: Use `sync:` syntax to achieve parent-child component data synchronization
- **Data Flow**: One-way binding `:` Parent→Child, Two-way binding `sync:` Parent↔Child
