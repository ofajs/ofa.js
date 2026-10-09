# 插槽

插槽是组件中用于接收外部内容的占位符。通过使用插槽，你可以创建可复用的组件，同时允许使用组件的人自定义组件内部的内容。

## 默认插槽

<o-playground name="默认插槽示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>插槽内容：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 插槽默认内容

当父组件没有提供插槽内容时，`<slot></slot>` 内部的元素将作为默认内容显示。

<o-playground name="插槽默认内容示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>有插槽内容：</h3>
      <demo-comp>
        <div>这是自定义内容</div>
      </demo-comp>
      <h3>无插槽内容（显示默认内容）：</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>插槽内容：
      <span style="color: red;">
        <slot>
          <div>这是默认内容</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 命名插槽

当组件需要多个插槽位置时，可以使用命名插槽来区分不同的插槽。通过 `<slot name="xxx">` 定义具名插槽，在使用时通过 `slot="xxx"` 属性指定内容放入哪个插槽。

<o-playground name="命名插槽示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Footer Content</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>插槽内容：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 多层级插槽传递

插槽内容可以跨越多层组件进行传递。当父组件向子组件传递插槽内容后，子组件可以继续将这个插槽内容传递给自己的子组件，实现插槽的多层透传。

<o-playground name="多层级插槽传递示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">来自最外层的标题</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>外层组件</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>内层组件</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在上面的示例中：
- 最外层父组件定义了 `slot="header"` 的内容
- 外层组件（outer-comp）接收到这个插槽内容后，将其继续传递给内层组件（inner-comp）
- 内层组件最终渲染来自最外层的插槽内容