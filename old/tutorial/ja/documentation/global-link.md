# global-link コンポーネント

`global-link` は、すべてのコンポーネントでスタイルを共有できるようにするツールコンポーネントです。

## 基本的な使い方

`ofa.js` の後に `global-link` コンポーネントを参照し、`global-link` を通じてスタイルファイルを参照すれば、すべてのコンポーネントでそのスタイルファイルを読み込むことができます。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>global-link 例</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## 適用シーン

⚠️ **警告**：`global-link` はグローバルスタイルのスコープを汚染します。まるでグローバル変数のようです。

**新規プロジェクトでは絶対にこのコンポーネントを使用しないでください！** もし新規プロジェクトで `global-link` を使用しているなら、それはプロジェクトアーキテクチャ設計に問題があることを示しており、質の低いプロジェクトの兆候です。

以下のシナリオでのみ使用します：

- 古いプロジェクトの移行（一時的な対応策）
- クソコード、クソプロジェクト（一時的な火消し）

## 代替案

`public.css` ファイルを作成し、各コンポーネントモジュールで個別に読み込む（`link` タグを使用する）ことで、グローバルなスタイルを汚染せずに目的の効果を得られます。

```html
<!-- コンポーネントモジュール内で -->
<link rel="stylesheet" href="./public.css">
```

## 注意事項

必ず最初に `o-global-link` タグで初期化する必要があり、初期化が完了した後でのみ、後続のコンポーネントにグローバルスタイルが適用されます。