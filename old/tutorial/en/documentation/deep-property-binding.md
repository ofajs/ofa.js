# Understanding Attribute Binding

In the previous content, the basic usage of [property binding](./property-binding.md) was initially introduced. The previous example was used to bind the `value` property of a native browser element (such as `textarea`). This section will delve into the essence of property binding—it is actually binding to the JavaScript properties of a component after instantiation, not to HTML attributes.

## Component Property Binding Mechanism

In ofa.js, when we use the `:toProp="fromProp"` syntax in a parent component, we are setting the JavaScript property of the child component instance, not the HTML attribute. This is an important distinction from directly setting HTML attributes (such as `attr:toKey="fromKey"`).

The following example shows how to pass data to a custom component through property binding：

<o-playground name="Understanding Property Binding" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
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
  </code>
  <code path="demo-comp.html" active>
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
  </code>
</o-playground>

In this example:- The `val` data in the parent component is bound to the `fullName` prop of the child component `<demo-comp>`
- The syntax `:full-name="val"` is used to pass the parent component's `val` value to the child component's `fullName` prop
- After receiving this value, the child component displays it in the template via `{{fullName}}`

## Attribute Binding vs Feature Property Inheritance

It should be noted that attribute binding (`:`) and characteristic attribute inheritance (`attr:`) have the following key differences:

### Property Binding (':')

- JavaScript properties bound to the component instance
- The passed data retains its original type (string, number, boolean, etc.)
- It can be directly accessed and modified within the component, even without predefining `data` inside the component

### Feature attribute inheritance (`attr:`)

- Set HTML attributes
- All values are converted to strings
- Mainly used to pass attributes to the underlying DOM elements
- Requires special handling to parse complex data
- Must define `attrs` in advance inside the component to receive attribute values

Grammar Comparison:```html
<!-- Attribute binding: pass JavaScript values, keep data types -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Attribute inheritance: set HTML attributes, all values become strings -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- Actual passed string "42" -->
```

## Case Comparison Differences

<o-playground name="Case Comparison Difference" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Among them, `vone` is a property of the component instance, `vtwo` is an HTML attribute, and the value of the attribute will be selected by the `[vtwo]` selector and have styles applied, while `vone` is a property of the component instance and will not be selected by the `[vone]` selector.

## Two-way Data Binding

The instantiated component also supports two-way data binding, using the `sync:toProp="fromProp"` syntax. Two-way binding allows data synchronization between parent and child components; when the data on either side changes, the other side updates accordingly.

> Unlike Angular and Vue, ofa.js natively supports two-way data binding syntax without requiring any special configuration or additional operations for components.

### Two-way Binding Example

The following example shows how to establish two-way data binding between parent and child components:

<o-playground name="Two-way Binding Example" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Value in parent component: {{val}}</h3>
      <p>Modify the parent component's value via input:</p>
      <input type="text" sync:value="val" placeholder="Enter text in the input box...">
      <p>Modify the parent component's value via child component:</p>
      <demo-comp sync:full-name="val"></demo-comp>
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
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Value displayed in child component: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="Enter text in the child component input box...">
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
  </code>
</o-playground>

In this example:- The `val` of the parent component and the `fullName` of the child component achieve two-way binding through `sync:full-name="val"`
- When content is entered in the parent component's input box, the child component immediately displays the new value
- When content is entered in the child component's input box, the parent component also updates the display immediately

### The Difference Between Two-Way Binding and Regular Property Binding

| Feature | Normal Property Binding (`:`) | Two-Way Binding (`sync:`) |
|--------|-------------------------------|----------------------------|
| Data Flow | One-way: Parent → Child | Two-way: Parent ↔ Child |
| Syntax | `:prop="value"` | `sync:prop="value"` |
| Child Component Modification | Does not affect parent component | Affects parent component |
| Suitable Scenarios | Parent passes configuration to child | Need synchronous data between parent and child |### Precautions

1. **Performance Consideration**: Two-way binding triggers re-rendering when data changes; use it cautiously in complex scenarios  
2. **Data Flow Control**: Excessive two-way binding can make data flow hard to track; design inter-component communication wisely  
3. **Component Compatibility**: Not all components are suited for two-way binding; consider the component’s design purpose