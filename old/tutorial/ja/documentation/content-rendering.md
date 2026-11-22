# テンプレートレンダリング

ofa.jsは強力なテンプレートレンダリングエンジンを提供し、豊富なテンプレート構文を含んでおり、開発者がアプリを迅速に構築するのを助けます。まず、最も一般的に使用されるテキストレンダリングから説明を始めます。

## ページデータバインディング

ofa.js では、各ページに `data` オブジェクトがあり、その中でページ内で使用する変数を定義できます。ページのレンダリングが開始されると、自動的に `data` オブジェクトのデータとテンプレートがバインドされ、テンプレート内で `{{変数名}}` の構文を使用して対応する変数の値がレンダリングされます。

## テキストレンダリング

テキストレンダリングは最も基本的なレンダリング方式であり、テンプレート内で `{{変数名}}` という構文を使って `data` オブジェクト内の対応する変数の値を表示できます。

<o-playground name="テキストレンダリング例" style="--editor-height: 500px">
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

## HTMLコンテンツのレンダリング

要素に `:html` ディレクティブを追加することで、対応する変数内の HTML 文字列を解析し、安全に要素内部に挿入できるため、リッチテキストの動的レンダリングや外部 HTML フラグメントの埋め込みを簡単に実現できます。

<o-playground name="HTMLコンテンツ例のレンダリング" style="--editor-height: 500px">
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

