# formData

`formData` 方法用于生成与表单元素绑定的对象数据，使得处理表单元素更加简单和高效。这个方法会生成一个对象，包含目标元素内所有表单元素的值，该对象会实时反映表单元素的改动。

在下面的示例中，我们演示了如何使用 `formData` 方法生成与表单元素绑定的对象数据：

<o-playground name="formData - 基本使用" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们创建了一个包含文本输入框、单选按钮和文本区域的表单，并使用 `formData` 方法创建了一个对象 `data`，该对象包含了这些表单元素的值。我们还使用 `watch` 方法来监视数据的变化，以及将数据实时显示在页面上。当用户修改表单元素的值时，`data` 对象会相应地更新，使得数据处理变得非常简单和高效。

## 反向数据绑定

生成的对象数据同样具有反向的绑定能力，这意味着当你修改对象的属性时，相关的表单元素值也会自动更新。这在处理表单数据时非常有用，因为你可以轻松地实现双向数据绑定。

在下面的示例中，我们演示了如何使用 `formData` 方法生成的对象数据，以及如何进行反向数据绑定：

<o-playground name="formData - 反向绑定" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        setTimeout(()=>{
          data.username = "Yao";
          data.sex = "man";
          data.message = "ofa.js is good!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们首先创建了一个包含文本输入框、单选按钮和文本区域的表单，然后使用 `formData` 方法生成了一个数据对象 `data`。随后，通过修改 `data` 对象的属性，我们实现了反向数据绑定，即表单元素的值会随着对象属性的更改而自动更新。这种双向数据绑定功能使得与表单数据的交互更加便捷。

## 监听特定的表单

默认情况下，`formData()` 方法会监听目标元素内的所有 `input`、`select` 和 `textarea` 元素。但如果你只想监听特定的表单元素，可以通过传递 CSS 选择器来实现。

在下面的示例中，我们演示了如何通过传递 CSS 选择器来监听特定的表单元素：

<o-playground name="formData - 特定表单" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">这个表单元素没有被绑定</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData(".use-it");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

在此示例中，我们只希望监听具有 `class` 为 "use-it" 的表单元素，因此我们传递了 `".use-it"` 作为参数给 `formData()` 方法。这样，只有带有该类名的表单元素会被监听和包括在生成的数据对象中。这对于选择性地监听表单元素非常有用，以便更精确地管理你的表单数据。

## 自定义表单

自定义表单组件的使用非常简单，只需要为自定义组件添加一个 **value 属性** 并设置 **name 特性**。

<o-playground name="formData - 自定义表单" style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <div id="myForm">
        <input type="text" name="username" value="John Doe" />
        <l-m src="./custom-input.html"></l-m>
        <custom-input name="message"></custom-input>
        <div id="logger"></div>
      </div>
      <script>
        const data = $("#myForm").formData("input,custom-input");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
  <code path="custom-input.html">
    <template component>
      <style>
        :host{
          display: block;
        }
        .editor {
          display: inline-block;
          min-width: 200px;
          line-height: 30px;
          height: 30px;
          border: #aaa solid 1px;
          border-radius: 4px;
          padding: 4px;
          font-size: 14px;
        }
      </style>
      <div
        class="editor"
        contenteditable="plaintext-only"
        :text="value"
        on:input="changeText"
      ></div>
      <script>
        export default {
          tag:"custom-input",
          attrs: {
            name: "",
          },
          data: {
            value: "Default txt",
          },
          proto: {
            changeText(e) {
              this.value = $(e.target).text;
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

在你使用自定义表单组件时，你只需将它添加到你的表单中，并设置所需的 `name` 属性。在上述示例中，我们通过添加 `<custom-input>` 元素并设置 `name` 属性来使用自定义表单组件。随后，我们使用 `formData()` 方法监听输入元素和自定义组件的值，以便实时获取和处理表单数据。这种方法可以让你非常方便地扩展你的表单，以包括自定义的表单组件，从而满足你的特定需求。

## 在组件或页面内使用表单数据

有时，你可能需要在组件或页面内使用表单数据，并且需要在 `attached` 周期生命周期时生成数据并将其绑定到组件上。

<o-playground name="formData - 组件内使用" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./form-data-demo.html"></l-m>
      <form-data-demo></form-data-demo>
    </template>
  </code>
  <code path="form-data-demo.html" active>
    <template component>
      <style>
        :host{
          display: block;
        }
      </style>
      <input type="text" name="username" value="John Doe" />
      <div>{{logtext}}</div>
      <script>
        export default {
          tag:"form-data-demo",
          data: {
            fdata:{},
            logtext: ""
          },
          watch:{
            fdata(data){
              if(data){
                this.logtext = JSON.stringify(data);
              }
            }
          },
          attached(){
            this.fdata = this.shadow.formData();
          }
        };
      </script>
    </template>
  </code>
</o-playground>

通过 `attached` 周期生命周期，在组件准备就绪后，我们使用 `this.shadow.formData()` 方法生成了表单数据对象 `fdata`。

`formData()` 更适用于交互逻辑较为简单的表单场景。
