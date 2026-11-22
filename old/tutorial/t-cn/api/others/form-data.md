# formData



`formData` 方法用於生成與錶單元素綁定的對象數據，使得處理錶單元素更加簡單和高效。這個方法會生成一個對象，包含目標元素內所有錶單元素的值，該對象會實時反映錶單元素的改動。

在下面的示例中，我們演示瞭如何使用 `formData` 方法生成與錶單元素綁定的對象數據：

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

在這個示例中，我們創建瞭一個包含文本輸入框、單選按鈕和文本區域的錶單，並使用 `formData` 方法創建瞭一個對象 `data`，該對象包含瞭這些錶單元素的值。我們還使用 `watch` 方法來監視數據的變化，以及將數據實時顯示在頁面上。當用戶脩改錶單元素的值時，`data` 對象會相應地更新，使得數據處理變得非常簡單和高效。

## 反向數據綁定



生成的對象數據衕樣具有反向的綁定能力，這意味著當妳脩改對象的屬性時，相關的錶單元素值也會自動更新。這在處理錶單數據時非常有用，因爲妳可以輕鬆地實現雙向數據綁定。

在下面的示例中，我們演示瞭如何使用 `formData` 方法生成的對象數據，以及如何進行反向數據綁定：

<o-playground name="formData - 反向綁定" style="--editor-height: 500px">
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

在這個示例中，我們首先創建瞭一個包含文本輸入框、單選按鈕和文本區域的錶單，然後使用 `formData` 方法生成瞭一個數據對象 `data`。隨後，通過脩改 `data` 對象的屬性，我們實現瞭反向數據綁定，卽錶單元素的值會隨著對象屬性的更改而自動更新。這種雙向數據綁定功能使得與錶單數據的交互更加便捷。

## 監聽特定的錶單



默認情況下，`formData()` 方法會監聽目標元素內的所有 `input`、`select` 和 `textarea` 元素。但如菓妳隻想監聽特定的錶單元素，可以通過傳遞 CSS 選擇器來實現。

在下面的示例中，我們演示瞭如何通過傳遞 CSS 選擇器來監聽特定的錶單元素：

<o-playground name="formData - 特定錶單" style="--editor-height: 500px">
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
        <textarea name="message">這個錶單元素沒有被綁定</textarea>
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

在此示例中，我們隻希望監聽具有 `class` 爲 "use-it" 的錶單元素，因此我們傳遞瞭 `".use-it"` 作爲參數給 `formData()` 方法。這樣，隻有帶有該類名的錶單元素會被監聽和包括在生成的數據對象中。這對於選擇性地監聽錶單元素非常有用，以便更精確地管理妳的錶單數據。

## 自定義錶單



自定義錶單組件的使用非常簡單，隻需要爲自定義組件添加一個 **value 屬性** 並設置 **name 特性**。

<o-playground name="formData - 自定義錶單" style="--editor-height: 500px">
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

在妳使用自定義錶單組件時，妳隻需將牠添加到妳的錶單中，並設置所需的 `name` 屬性。在上述示例中，我們通過添加 `<custom-input>` 元素並設置 `name` 屬性來使用自定義錶單組件。隨後，我們使用 `formData()` 方法監聽輸入元素和自定義組件的值，以便實時獲取和處理錶單數據。這種方法可以讓妳非常方便地擴展妳的錶單，以包括自定義的錶單組件，從而滿足妳的特定需求。

## 在組件或頁面內使用錶單數據



有時，妳可能需要在組件或頁面內使用錶單數據，並且需要在 `attached` 周期生命周期時生成數據並將其綁定到組件上。

<o-playground name="formData - 組件內使用" style="--editor-height: 600px">
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

通過 `attached` 周期生命周期，在組件準備就緒後，我們使用 `this.shadow.formData()` 方法生成瞭錶單數據對象 `fdata`。

`formData()` 更適用於交互邏輯較爲簡單的錶單場景。
