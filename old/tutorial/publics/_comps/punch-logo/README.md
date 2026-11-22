# punch-logo

[简体中文](./README-cn.md)

Logo component with punch animation effect, plays flying animation and logo display effect on click.

## Prerequisites

This component depends on [ofa.js](https://github.com/ofajs/ofa.js). Please include ofa.js in your page first:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Usage

### 1. Import Component

```html
<l-m src="https://ofajs.com/publics/_comps/punch-logo/punch-logo.html"></l-m>
```

### 2. Basic Usage

```html
<punch-logo>
  <img logo src="logo.svg" alt="" />
  <h2>Title</h2>
  <img src="icon1.svg" slot="fly" alt="" />
  <img src="icon2.svg" slot="fly" alt="" />
</punch-logo>
```

## Properties and Slots

### logo Attribute

| Attribute | Description |
|-----------|-------------|
| `logo` | Added to img element to identify it as the main logo image |

### Slots

| Slot Name | Description |
|-----------|-------------|
| `fly` | Flying animation elements, randomly selected and animated during playback |

## Example

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
      <punch-logo>
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

## Features

- Automatically plays animation after component loads
- Click to replay animation
- Logo rotation display effect
- Random selection of flying elements with random angles
- Title fade-in display effect
