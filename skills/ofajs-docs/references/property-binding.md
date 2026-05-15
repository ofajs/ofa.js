# 属性绑定

ofa.js 支持将数据绑定到元素实例化后对象的属性上，如 input 元素的 value 或 checked 属性等。

## 单向属性绑定

单向属性绑定使用 `:toKey="fromKey"` 语法，将组件数据"单向"同步到 DOM 元素的属性。组件数据变动时，元素属性即时更新；但元素自身的变动（如用户输入）不会反向写回组件，保持数据流的单一与可控。

```html
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
  <p>当前值: {{val}}</p>
  <input type="text" :value="val" placeholder="这是一个单向绑定的输入框">
  <p>注意：直接在输入框中修改内容不会改变上面显示的值</p>
  <script>
    export default async () => {
      return {
        data: { val: "Hello ofa.js Demo Code" }
      };
    };
  </script>
</template>
```

## 双向属性绑定

双向属性绑定采用 `sync:xxx` 语法，实现了组件数据与DOM元素之间的双向同步。当组件数据变化时，DOM 元素的属性会更新；当 DOM 元素的属性发生变化时（如用户输入），也会同步更新组件数据。

```html
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
  <p>当前值: {{val}}</p>
  <input type="text" sync:value="val" placeholder="这是一个双向绑定的输入框">
  <p>提示：在输入框中修改内容会实时更新上面显示的值</p>
  <script>
    export default async () => {
      return {
        data: { val: "Hello ofa.js Demo Code" }
      };
    };
  </script>
</template>
```

### 双向绑定的特点

- 数据流向：组件 ↔ DOM 元素（双向）
- 组件数据变化 → DOM 元素更新
- DOM 元素变化 → 组件数据更新
- 适用于需要用户输入和数据同步的场景

### 对象的双向绑定

对于对象类型的数据绑定，**不需要使用 `sync` 语法**，直接使用 `:` 单向传递即可。这是因为 JavaScript 的对象是引用共享的，当父组件将对象传递给子组件时，子组件获取到的是同一个对象的引用，对象的修改会直接反映到原始数据上。

ofa.js 保留了 JavaScript 的这一特性，因此对象的单向传递实际上就相当于双向传递。例如：

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "张三", age: 25 } }
      };
    };
  </script>
</template>
```

在 `child-comp` 组件中直接修改 `userData.name`，父组件中的 `userInfo.name` 也会同时更新，因为它们指向同一个对象引用。

### 常见的双向绑定场景

```html
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
  <h3>表单双向绑定示例</h3>
  <div class="form-group">
    <label>文本输入框:</label>
    <input type="text" sync:value="textInput" placeholder="输入文本">
  </div>
  <div class="form-group">
    <label>数字输入框:</label>
    <input type="number" sync:value="numberInput" placeholder="输入数字">
  </div>
  <div class="form-group">
    <label>多行文本:</label>
    <textarea sync:value="textareaInput" rows="3" placeholder="输入多行文本"></textarea>
  </div>
  <div class="form-group">
    <label>选择框:</label>
    <select sync:value="selectedOption">
      <option value="">请选择...</option>
      <option value="option1">选项1</option>
      <option value="option2">选项2</option>
      <option value="option3">选项3</option>
    </select>
  </div>
  <div class="form-group">
    <label>复选框:</label>
    <label style="display:flex;">
      <input type="checkbox" sync:checked="isChecked" /> 我同意条款
    </label>
  </div>
  <div class="preview">
    <h4>实时预览:</h4>
    <p>文本: {{textInput}}</p>
    <p>数字: {{numberInput}}</p>
    <p>多行文本: {{textareaInput}}</p>
    <p>选择: {{selectedOption}}</p>
    <p>复选框状态: {{isChecked ? '已勾选' : '未勾选'}}</p>
  </div>
  <script>
    export default async () => {
      return {
        data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
      };
    };
  </script>
</template>
```

## 注意事项

1. **性能考虑**：双向绑定会创建数据监听器，大量使用可能影响性能
2. **数据一致性**：双向绑定确保数据和视图的一致性，但要注意避免无限循环更新
3. **初始值设置**：确保绑定的数据有合适的初始值，避免 undefined 显示问题
4. **事件冲突**：避免在同一元素上同时使用双向绑定和手动事件处理，以免造成冲突

## 关键要点

- **单向绑定**：使用 `:toKey="fromKey"` 语法，数据从组件流向 DOM
- **双向绑定**：使用 `sync:xxx` 语法，实现组件与 DOM 的双向同步
- **适用场景**：单向绑定适用于展示数据，双向绑定适用于表单输入
- **性能优化**：合理使用双向绑定，避免过度使用影响性能
