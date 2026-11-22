# punch-logo

带有冲击动画效果的 Logo 组件，点击时播放飞散动画和 Logo 显示效果。

## 前置条件

本组件依赖 [ofa.js](https://github.com/ofajs/ofa.js)，请先在页面中引入 ofa.js：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 使用方法

### 1. 引入组件

```html
<l-m src="https://ofajs.com/publics/_comps/punch-logo/punch-logo.html"></l-m>
```

### 2. 基本用法

```html
<punch-logo>
  <img logo src="logo.svg" alt="" />
  <h2>标题</h2>
  <img src="icon1.svg" slot="fly" alt="" />
  <img src="icon2.svg" slot="fly" alt="" />
</punch-logo>
```

## 属性和插槽说明

### logo 属性

| 属性 | 说明 |
|------|------|
| `logo` | 添加到 img 元素上，标识为主 Logo 图片 |

### 插槽

| 插槽名 | 说明 |
|--------|------|
| `fly` | 飞散动画元素，动画时会随机选取并飞散 |

## 示例

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>punch-logo</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://ofajs.com/publics/_comps/punch-logo/punch-logo.html"></l-m>
    <div style="text-align: center; padding: 100px">
      <punch-logo></punch-logo>
        <img logo src="https://ofajs.com/img/logo.svg" alt="" />
        <h2>ofa.js</h2>
        <img src="https://ofajs.com/publics/sources/webpack.svg" slot="fly" alt="webpack" />
        <img src="https://ofajs.com/publics/sources/npm.svg" slot="fly" alt="npm" />
        <img src="https://ofajs.com/publics/sources/nodejs.svg" slot="fly" alt="nodejs" />
        <img src="https://ofajs.com/publics/sources/esbuild.svg" slot="fly" alt="esbuild" />
        <img src="https://ofajs.com/publics/sources/pnpm.svg" slot="fly" alt="pnpm" />
        <img src="https://ofajs.com/publics/sources/yarn.svg" slot="fly" alt="yarn" />
        <img src="https://ofajs.com/publics/sources/bun.svg" slot="fly" alt="bun" />
        <img src="https://ofajs.com/publics/sources/deno.svg" slot="fly" alt="deno" />
        <img src="https://ofajs.com/publics/sources/rollup.svg" slot="fly" alt="rollup" />
        <img src="https://ofajs.com/publics/sources/typescript.svg" slot="fly" alt="typescript" />
        <img src="https://ofajs.com/publics/sources/lerna.svg" slot="fly" alt="lerna" />
      </punch-logo>
    </div>
  </body>
</html>
```

## 特性

- 组件加载后自动播放动画
- 点击可重新播放动画
- Logo 旋转显示效果
- 随机选取飞散元素并添加随机角度
- 标题淡入显示效果
