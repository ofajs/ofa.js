# formData



`formData` メソッドは、フォーム要素にバインドされたオブジェクトデータを生成するために使用され、フォーム要素の処理をより簡単かつ効率的にします。このメソッドは、対象要素内のすべてのフォーム要素の値を含むオブジェクトを生成し、そのオブジェクトはフォーム要素の変更をリアルタイムに反映します。

以下の例では、`formData` メソッドを使用してフォーム要素にバインドされたオブジェクトデータを生成する方法を示します。

<o-playground name="formData - 基本的な使い方" style="--editor-height: 500px">
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

この例では、テキスト入力ボックス、ラジオボタン、テキストエリアを含むフォームを作成し、`formData` メソッドを使用してこれらのフォーム要素の値を含むオブジェクト `data` を作成しました。また、`watch` メソッドを使用してデータの変化を監視し、リアルタイムでページに表示しています。ユーザーがフォーム要素の値を変更すると、`data` オブジェクトがそれに応じて更新されるため、データ処理が非常にシンプルかつ効率的になります。

## 逆方向データバインディング

生成されたオブジェクトデータは逆方向のバインディング能力も持っています。つまり、オブジェクトのプロパティを変更すると、関連するフォーム要素の値も自動的に更新されます。これはフォームデータを扱う際に非常に便利で、双方向データバインディングを簡単に実現できます。

以下の例では、`formData` メソッドで生成されたオブジェクトデータの使い方と、逆方向のデータバインディングの方法を示します：

<o-playground name="formData - 逆バインディング" style="--editor-height: 500px">
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

この例では、まずテキスト入力欄、ラジオボタン、テキストエリアを含むフォームを作成し、`formData` メソッドを使用してデータオブジェクト `data` を生成しました。その後、`data` オブジェクトのプロパティを変更することで、フォーム要素の値がオブジェクトプロパティの変更に応じて自動的に更新される、いわゆる逆方向のデータバインディングを実現しました。この双方向データバインディング機能により、フォームデータとのやり取りがより便利になります。

## 特定のフォームを監視する

デフォルトでは、`formData()` メソッドは対象要素内のすべての `input`、`select`、`textarea` 要素を監視します。しかし、特定のフォーム要素だけを監視したい場合は、CSS セレクタを渡すことで実現できます。

次の例では、CSSセレクタを渡すことで特定のフォーム要素を監視する方法を示しています。

<o-playground name="formData - 特定フォーム" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          性別:
          <label>
            男性
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            女性
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">このフォーム要素はバインドされていません</textarea>
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

この例では、`class`が「use-it」であるフォーム要素のみを監視したいため、`formData()`メソッドに引数として`".use-it"`を渡しています。これにより、そのクラス名を持つフォーム要素のみが監視され、生成されるデータオブジェクトに含まれます。これは、フォーム要素を選択的に監視することで、フォームデータをより正確に管理するのに役立ちます。

## カスタムフォーム

カスタムフォームコンポーネントの使用は非常に簡単で、カスタムコンポーネントに **value 属性** を追加し、**name 特性** を設定するだけです。

<o-playground name="formData - カスタムフォーム" style="--editor-height: 500px">
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

自定义フォームコンポーネントを使用する際は、フォームに追加し、必要な `name` 属性を設定するだけで済みます。上記の例では、`<custom-input>` 要素を追加し、`name` 属性を設定することで、カスタムフォームコンポーネントを使用しています。その後、`formData()` メソッドを使用して入力要素とカスタムコンポーネントの値を監視し、リアルタイムでフォームデータを取得・処理します。この方法により、フォームを簡単に拡張してカスタムフォームコンポーネントを含めることができ、特定のニーズを満たすことができます。

## コンポーネントまたはページ内でフォームデータを使用する

時には、コンポーネントやページ内でフォームデータを使用する必要があり、`attached` サイクルのライフサイクル時にデータを生成してコンポーネントにバインドする必要があるかもしれません。

<o-playground name="formData - コンポーネント内での使用" style="--editor-height: 600px">
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

`attached` ライフサイクルにより、コンポーネントの準備が完了した後、`this.shadow.formData()` メソッドを使用してフォームデータオブジェクト `fdata` を生成しました。

`formData()` は、インタラクションロジックが比較的シンプルなフォームシーンに適しています。