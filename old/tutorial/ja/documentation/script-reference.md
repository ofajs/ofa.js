# スクリプトの導入

ofa.js は script タグで直接読み込んで使用することができます。HTML ファイルの `<head>` または `<body>` 部分に以下のコードを追加するだけです：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 基本的な使い方

スクリプトを導入すると、ofa.jsはグローバルスコープに `$` 変数を作成し、すべてのコア機能はこのオブジェクトを介して提供されます。このオブジェクトを通じて、ofa.jsのさまざまなメソッドやプロパティにアクセスできます。今後のチュートリアルでは、その具体的な使い方を詳しく説明します。

## デバッグモード

開発中には、スクリプトのURLの末尾に`#debug`パラメータを追加することでデバッグモードを有効にできます：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

デバッグモードではソースマップ機能が有効になり、ブラウザの開発者ツールでファイルの元のソースコードを直接表示・デバッグできるようになり、開発効率が大幅に向上します。

## ESM モジュール

ofa.js は ESM モジュールによる導入もサポートしています。プロジェクト内で `import` 文を使用して ofa.js を導入できます：

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

ESM モジュールを使用する場合、コード内で `$` 変数を直接使用でき、グローバルスコープを介してアクセスする必要はありません。