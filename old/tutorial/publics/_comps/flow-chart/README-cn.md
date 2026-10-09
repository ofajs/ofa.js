# flow-chart

流程图组件，自动布局并渲染节点之间的连接关系。

## 前置条件

本组件依赖 [ofa.js](https://github.com/ofajs/ofa.js)，请先在页面中引入 ofa.js：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 使用方法

### 1. 引入组件

```html
<l-m src="https://ofajs.com/publics/_comps/flow-chart/flow-chart.html"></l-m>
```

### 2. 基本用法

```html
<flow-chart style="width: 100%; height: 200px">
  <div name="a" to="b">节点A</div>
  <div name="b" to="c">节点B</div>
  <div name="c">节点C</div>
</flow-chart>
```

## 属性说明

### 子元素属性

| 属性 | 说明 |
|------|------|
| `name` | 节点名称，用于标识节点 |
| `to` | 指向下一个节点的名称，建立连接关系 |

## 示例

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>flow-chart</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://ofajs.com/publics/_comps/flow-chart/flow-chart.html"></l-m>
    <flow-chart style="width: 100%; height: 200px">
      <div name="a" to="b">AAA</div>
      <div name="b" to="c">BBB</div>
      <div name="c">CCC</div>
    </flow-chart>
  </body>
</html>
```

## 特性

- 自动计算节点布局
- 响应式调整，窗口大小变化时自动重新渲染
- 支持横向和纵向连接线
- 自动添加箭头指示方向
- 支持多行布局
