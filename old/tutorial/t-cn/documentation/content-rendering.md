# 模闆渲染



ofa.js 提供瞭強大的模闆渲染引擎，包含豐富的模闆語法，能夠幫助開發者快速構建應用。首先我們從最常用的文本渲染開始介紹。

## 頁面數據綁定



在 ofa.js 中，每個頁面都有一個 `data` 對象，妳可以在其中定義需要在頁面中使用的變量。當頁面開始渲染時，會自動將 `data` 對象中的數據與模闆進行綁定，然後在模闆中使用 `{{變量名}}` 的語法來渲染對應變量的值。

## 文本渲染



文本渲染是最基礎的渲染方式，妳可以在模闆中使用 `{{變量名}}` 語法來顯示 `data` 對象中相應變量的值。

<o-playground name="文本渲染示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 渲染 HTML 內容



通過爲元素添加 `:html` 指令，可將對應變量中的 HTML 字符串解析並安全地插入元素內部，輕鬆實現富文本動態渲染或外部 HTML 片段的嵌入。

<o-playground name="渲染 HTML 內容示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

