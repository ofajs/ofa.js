# Attribute Binding

ofa.js supports binding data to properties of the object after element instantiation, such as the value or checked attribute of an input element.

## One-way property binding

Unidirectional attribute binding uses the `:toKey="fromKey"` syntax，to synchronize component data “one-way” to DOM element attributes。When component data changes，element attributes update instantly；however，changes to the element itself (such as user input) do not write back to the component，keeping the data flow unidirectional and controllable.

<o-playground name="One-way Property Binding" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Current value: {{val}}</p>
      <input type="text" :value="val" placeholder="This is a one-way bound input">
      <p>Note: Changing the content directly in the input box will not alter the value shown above</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Two-way Property Binding

Two-way property binding uses the `sync:xxx` syntax, achieving bidirectional synchronization between component data and DOM elements. When the component data changes, the attributes of the DOM element are updated; when the attributes of the DOM element change (such as user input), the component data is also updated synchronously.

<o-playground name="Two-way Property Binding" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Current value: {{val}}</p>
      <input type="text" sync:value="val" placeholder="This is a two-way binding input box">
      <p>Tip: Modifying the content in the input box will update the displayed value in real time</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Characteristics of Two-Way Binding

- Data flow: component ↔ DOM element (bidirectional)
- Component data changes → DOM element updates
- DOM element changes → component data updates
- Suitable for scenarios requiring user input and data synchronization

### Two-Way Binding of Objects

For object type data binding, **you do not need to use the `sync` syntax**; you can directly use `:` for one-way passing. This is because JavaScript objects are shared by reference. When a parent component passes an object to a child component, the child component receives a reference to the same object, and modifications to the object will directly reflect on the original data.

ofa.js retains this characteristic of JavaScript, so the unidirectional passing of objects is effectively equivalent to bidirectional passing. For example:

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "Zhang San", age: 25 } }
      };
    };
  </script>
</template>
```

Directly modifying `userData.name` in the `child-comp` component will also update `userInfo.name` in the parent component, because they point to the same object reference.

### Common two-way binding scenarios

<o-playground name="Two-way Binding Example" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Two-way Binding Example</h3>
      <div class="form-group">
        <label>Text Input:</label>
        <input type="text" sync:value="textInput" placeholder="Enter text">
      </div>
      <div class="form-group">
        <label>Number Input:</label>
        <input type="number" sync:value="numberInput" placeholder="Enter number">
      </div>
      <div class="form-group">
        <label>Multiline Text:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Enter multiline text"></textarea>
      </div>
      <div class="form-group">
        <label>Select:</label>
        <select sync:value="selectedOption">
          <option value="">Please select...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Checkbox:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> I agree to the terms
        </label>
      </div>
      <div class="preview">
        <h4>Live Preview:</h4>
        <p>Text: {{textInput}}</p>
        <p>Number: {{numberInput}}</p>
        <p>Multiline Text: {{textareaInput}}</p>
        <p>Selected: {{selectedOption}}</p>
        <p>Checkbox Status: {{isChecked ? 'Checked' : 'Unchecked'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notes

1. **Performance Considerations**: Two-way binding creates data listeners, and heavy usage may impact performance.
2. **Data Consistency**: Two-way binding ensures consistency between data and view, but care must be taken to avoid infinite update loops.
3. **Initial Value Settings**: Ensure that bound data has appropriate initial values to avoid display issues with undefined.
4. **Event Conflicts**: Avoid using two-way binding and manual event handling on the same element simultaneously to prevent conflicts.