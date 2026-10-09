# 樣式査詢



`match-var` 是 ofa.js 中用於根據 CSS 變量進行樣式匹配的功能組件。通過 `match-var`，可以根據當前組件的 CSS 變量值動態匹配並應用不衕的樣式。這種特性專門用於樣式相關的上下文狀態傳遞，不需要使用 JavaScript，使用起來更加方便，適閤主題色等樣式傳遞需求。

## 覈心槪唸



- **match-var**: 樣式匹配組件，根據 CSS 變量值決定是否應用內部樣式
- **屬性匹配**: 通過組件屬性定義需要匹配的 CSS 變量和期望值
- **樣式應用**: 匹配成功時，內部 `<style>` 標籤的樣式會被應用到組件上

## 基本用法



`match-var` 組件通過屬性來定義需要匹配的 CSS 變量和期望值。當組件的 CSS 變量值與指定的屬性值匹配時，內部定義的樣式就會被應用。

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### 屬性



`match-var` 組件使用任意屬性來定義 CSS 變量的匹配規則。屬性名對應 CSS 變量名（不含 `--` 前綴），屬性值就是期望匹配的值。

### 工作原理



1. **瀏覽器支持**: 如菓瀏覽器支持 `@container style()` 査詢，會直接使用 CSS 原生能力
2. **降級處理**: 如菓不支持，會通過輪詢檢測 CSS 變量值的變化，匹配成功後動態註入樣式
3. **手動刷新**: 可以通過 `$.checkMatch()` 方法手動觸發樣式檢測

## 基礎示例



<o-playground name="基礎示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">切換主題</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          根據 CSS 變量顯示不衕樣式
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          顯示亮色主題
        </theme-box>
        <theme-box style="--theme: dark;">
          顯示闇色主題
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 多條件匹配



可以衕時使用多個屬性來定義更復雜的匹配條件，隻有當所有 CSS 變量都匹配時，樣式纔會被應用。

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## 多條件匹配示例



<o-playground name="屬性匹配示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>主題: {{theme}} <button on:click="changeTheme">切換主題</button></div>
      <div>尺寸: {{size}} <button on:click="changeSize">切換尺寸</button></div>
      <div class="content">
        <test-card>
          <div>多條件樣式匹配示例</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch 手動刷新



在某些情況下，CSS 變量的變化可能無法被自動檢測到，這時可以手動調用 `$.checkMatch()` 方法來觸發樣式檢測。

> 當前 Firefox 尚未支持 `@container style()` 査詢，因此需手動調用 `$.checkMatch()`；待未來瀏覽器原生支持後，系統將自動檢測變量變化，無需再手動觸發。

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // 手動觸發樣式檢測
    $.checkMatch();
  }
}
```

## 最佳實踐



1. **優先使用 CSS 原生能力**: `match-var` 會優先使用瀏覽器原生的 `@container style()` 査詢，現代瀏覽器中性能更好
2. **閤理組織樣式**: 將相關的匹配樣式放在一起，便於維護和理解
3. **使用 data() 綁定**: 結閤 `data()` 指令可以實現響應式的樣式切換
