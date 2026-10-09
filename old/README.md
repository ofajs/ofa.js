# ofa.js 
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ofajs/ofa.js/blob/main/LICENSE)
[![GitHub license](https://img.shields.io/badge/Discussions-F7CB53)](https://github.com/ofajs/discussion/discussions)

[Official Documentation](https://ofajs.com/en/index.html) / [官方文档](https://ofajs.com/cn/index.html) / [官方文檔](https://ofajs.com/t-cn/index.html) / [Sitio oficial de documentación](https://ofajs.com/es/index.html) / [公式ドキュメントサイト](https://ofajs.com/ja/index.html) / [공식 문서 사이트](https://ofajs.com/ko/index.html) / [Documentation officielle](https://ofajs.com/fr/index.html) / [Offizielle Dokumentation](https://ofajs.com/de/index.html)

## What is ofa.js?

ofa.js is a web frontend framework designed for building web applications, aiming to improve development efficiency and lower the development threshold.

> If you are already familiar with **HTML, CSS, and JavaScript**, then ofa.js is an excellent choice.

ofa.js can be used as a library like jQuery, and it can also be used to develop large web applications like React, Vue, and Angular. Its emergence completely eliminates the need for tools such as npm, Node.js, and webpack, which are unrelated to interface development, making frontend development simpler and more efficient.

## Core Advantages

### Zero Threshold, Out of the Box

No need to set up development environments, install dependencies, or configure scaffolding. Simply open the official build tool in your browser, select a local directory, and start developing. All computations, data, and storage operations are performed locally without relying on cloud services.

### AI Friendly, Easy to Verify

No compilation black boxes - AI-generated code can be quickly deployed and self-validated. By eliminating intermediate layers and compilation processes, code becomes easier to debug and fix.

### Native Micro-Frontend Support

ofa.js enables web frontend development to work like microservices, dividing applications into multiple independent modules. Each module can be developed and deployed independently. When the boundaries of traditional web frontends are broken, frontend technology will gradually突破 server technology limitations.

## How to Use

To start using ofa.js, simply add a reference to ofa.js in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

### Debug Mode

To better facilitate development and debugging, ofa.js provides a debug mode feature. In debug mode, component templates will enable the sourcemap feature, allowing you to more easily locate and solve problems. Enabling debug mode is very simple; just add the `#debug` parameter to the ofa.js reference URL:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

### ESM Module

ofa.js also supports ESM module imports. You can use the `import` statement in your project:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

## Usage Experience

You can try the specific usage experience [here](https://ofajs.com/en/cases/index.html).

The core philosophy of ofa.js is to simplify the encapsulation process of Web Components. Traditional Web Component encapsulation requires a large amount of knowledge, which has led to the relatively slow development of Web Components. As a result, the Web Components v1 standard, which has been supported since 2018, has not yet been widely adopted.

However, with ofa.js, you can quickly create a component by simply creating an HTML file. Others can reference this component through a simple tag without a pre-compilation process, greatly reducing the learning curve and allowing you to focus on application requirements.

```html
<!-- my-component.html -->
<!-- Encapsulated component code, written in the HTML file -->
<template component>
    <style>
      :host {
        display: block;
        border: 1px solid green;
        padding: 10px;
      }
    </style>
    <h3>{{title}}</h3>
    <script>
      export default async () => {
        return {
          tag: "my-component",
          data: {
            title: "Hello Component",
          },
        };
      };
    </script>
</template>
```

```html
<!-- Using the encapsulated component -->
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
<l-m src="./my-component.html"></l-m>
<my-component></my-component>
```

In addition, ofa.js introduces template syntax sugar similar to that of Angular and Vue, enabling you to work more efficiently when developing Web Components.

## AI Skill

For search engines or online AI indexing:

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/skills/ofajs-docs/SKILL.md
```

For AI tools that support skills, you can add the following skill URL to help AI learn ofa.js:

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/skills/ofajs-docs.zip
```

## Why Develop ofa.js?

The original intention behind the development of ofa.js was to solve the **engineering** problems of web development without relying on compilation tools.

> Engineering refers to the systematic integration of specifications, processes, tools, and methods in software development to improve development efficiency, code quality, and maintainability.

Over the past decade, web frontend development has evolved from initial野蛮 growth to gradual engineering. This process borrowed experience from traditional application development by introducing Node.js and compilation workflows to solve engineering challenges in large projects.

However, when projects became large, the drawbacks of this model gradually emerged, facing the **monolithic application** problem that traditional development faces, making projects difficult to maintain and interaction requirements difficult to iterate.

> Monolithic Application refers to a large, tightly-coupled single application where all functional modules are centralized in one codebase. Changing one part affects everything, making independent development and deployment difficult.

At this point, projects need to be decomposed for micro-frontend implementation, just like **microservices**. However, due to compilation processing, micro-frontends become difficult and cumbersome. Independent deployment of frontend modules requires compiling each small module, which is very difficult, causing web frontend technology development to nearly stagnate.

> Microservices is a software architecture style that splits large, complex applications into multiple fine-grained, independently deployable and runnable small services.

This led me to think: Traditional programming languages need to compile to handle different hardware and operating systems for cross-platform compatibility. But web development is different - it's based on browsers and originally doesn't need compilation, can run and deploy independently, and is naturally in micro-frontend mode. I realized that the compilation process actually made things more complex.

In other words, as long as we solve the engineering problem and remove the necessary step of compilation, frontend development becomes very suitable for developing large applications - this is the natural micro-frontend mode. Thus, ofa.js was born.

The author believes that the original intentions of Angular.js (v1) and jQuery were correct because they lowered the barrier to use. However, with the rise of Node.js and the introduction of pre-compilation modes, frontend development has gone astray. The author believes that frontend development should maintain the immediate execution characteristics of JavaScript, rather than relying too much on pre-compilation. They also appreciate the contributions of Node.js to the community, which has driven the rapid development of JavaScript.

ofa.js is also a natural micro frontend framework, and you will understand this if you have used it.

## Quick Start

### Option 1: Use OFA Studio (Recommended for Beginners)

If you want to directly develop a complete project with ofa.js without dealing with tedious steps, you can use the official online build and preview tool to create your first local application in one click within your browser.

Click [OFA Studio](https://core.noneos.com?redirect=studio) to open the ofa.js build tool. This tool directly uses the browser's local file system with no installation or configuration required.

### Option 2: Manual Setup

Create two files to get started:

**index.html** (Application Entry):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Example</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

**demo-page.html** (Page Module):
```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
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
```

## License

ofa.js is licensed under the [MIT License](https://github.com/ofajs/ofa.js/blob/main/LICENSE).