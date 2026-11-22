# 在項目中使用ofa.js的AI提示詞



由於 ofa.js 目前尚未成爲廣泛知名的框架，主流 AI 模型尚不具備直接使用 ofa.js 的能力。爲此，我們精心準備瞭專用提示詞，幫助 AI 學習和査閱 ofa.js 的使用方法。

我們提供瞭兩個版本的提示詞：

## 精簡版提示詞



這是經過濃縮優化的版本，旨在最小化前置 token 輸入消耗，適用於大多數場景：

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/tiny/start.md
```

使用此提示詞，AI 可以高效地開發 ofa.js 的組件或頁面模塊。

## 完整版提示詞



如菓您使用的 AI 模型相對不夠智能，可以嘗試使用未濃縮的完整版提示詞。雖然初始化時會佔用更多 token，但可能會獲得更好的效菓：

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/origin/start.md
```

通過提供這些提示詞，我們希望幫助開發者更便捷地利用 AI 工具進行 ofa.js 項目的開發，提升開發效率。

