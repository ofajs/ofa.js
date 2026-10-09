# flow-chart

[简体中文](./README-cn.md)

Flow chart component that automatically layouts and renders connections between nodes.

## Prerequisites

This component depends on [ofa.js](https://github.com/ofajs/ofa.js). Please include ofa.js in your page first:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Usage

### 1. Import Component

```html
<l-m src="https://ofajs.com/publics/_comps/flow-chart/flow-chart.html"></l-m>
```

### 2. Basic Usage

```html
<flow-chart style="width: 100%; height: 200px">
  <div name="a" to="b">Node A</div>
  <div name="b" to="c">Node B</div>
  <div name="c">Node C</div>
</flow-chart>
```

## Properties

### Child Element Attributes

| Attribute | Description |
|-----------|-------------|
| `name` | Node name for identification |
| `to` | Name of the next node to establish connection |

## Example

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

## Features

- Automatic node layout calculation
- Responsive adjustment, automatically re-renders on window resize
- Support for horizontal and vertical connection lines
- Automatic arrow direction indicators
- Multi-row layout support
