# PATH



`PATH` 屬性通常用於自定義組件或頁面組件上，用於獲取該組件的註冊組件的文件地址。這在開發過程中可以幫助妳瞭解組件的來源，特別是當妳需要引用或加載其他資源文件時，可以使用 `PATH` 屬性來構建文件路徑。

下面是一個簡單示例，演示如何在自定義組件中使用 `PATH` 屬性：

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

在這個示例中，我們選擇瞭一個具有 `id` 爲 "myCustomComponent" 的 `my-comp` 元素，然後通過 `PATH` 屬性獲取瞭該自定義組件的文件路徑。妳可以根據需要在腳本部分使用 `componentPath` 變量，例如，用牠來構建其他資源文件的路徑或進行其他操作。
