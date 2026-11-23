# ofa.js

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Discussions](https://img.shields.io/badge/Discussions-join-F7CB53)](https://github.com/ofajs/discussion/discussions)
[![中文文档](https://img.shields.io/badge/docs-中文-2f81f7)](https://ofajs.com/cn/)
[![繁體中文文件](https://img.shields.io/badge/docs-繁體中文-2f81f7)](https://ofajs.com/t-cn/)
[![English docs](https://img.shields.io/badge/docs-English-2f81f7)](https://ofajs.com/en/)
[![日本語ドキュメント](https://img.shields.io/badge/docs-日本語-2f81f7)](https://ofajs.com/ja/)

**Write components as plain HTML.**

ofa.js is a zero-build, zero-runtime-dependency Web Components framework.
One HTML file is one component or page, and the browser runs it directly—no
npm, Node.js, bundler, or compilation step required.

- [English documentation](https://ofajs.com/en/)
- [中文文档](https://ofajs.com/cn/)
- [繁體中文文件](https://ofajs.com/t-cn/)
- [日本語ドキュメント](https://ofajs.com/ja/)
- [v4 documentation](https://v4.ofajs.com/)
- [GitHub Discussions](https://github.com/ofajs/discussion/discussions)

## Why ofa.js?

- **Zero build** — `.html` files are the source and the artifact. Deploy them to
  any static server.
- **Native Web Components** — components are real Custom Elements with Shadow
  DOM and standards-based templates.
- **Reactive without a compiler** — `data`, `watch`, computed getters, `o-if`,
  and keyed `o-fill` work directly in HTML.
- **Applications when you need them** — `o-app` provides a page stack, nested
  layouts, animations, and `olink` navigation.
- **Runs anywhere** — CDN or local files; no server-side runtime required.
- **AI-friendly** — plain HTML, explicit data flow, and reproducible browser
  tests instead of a compilation black box.

## Quick start

Load ofa.js from jsDelivr:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@5/dist/ofa.min.mjs"
></script>
```

Create a page module:

```html
<!-- hello.html -->
<template page>
  <h1>Hello, {{name}}</h1>
  <button on:click="count++">Clicked {{count}} times</button>

  <script>
    export default async () => ({
      data: {
        name: "ofa.js",
        count: 0,
      },
    });
  </script>
</template>
```

Run it with a single page element:

```html
<o-page src="./hello.html"></o-page>
```

For multiple pages, use an app:

```html
<o-app src="./app.mjs"></o-app>
```

`app.mjs` configures the home page, page transitions, and optional routing
behavior. Each URL can also be a real HTML document when using
[scsr](./packages/scsr/README.md).

### Version range

Use `@5` to follow the latest published 5.x build. For a fully pinned version,
use the exact release number:

```text
https://cdn.jsdelivr.net/gh/ofajs/ofa.js@5.0.2/dist/ofa.min.mjs
```

The classic UMD build is available at `dist/ofa.min.js` and exposes the global
`$`.

## Repository layout

This repository is a monorepo containing the framework and its core building
blocks:

| Package | Description |
| --- | --- |
| [`packages/drill`](./packages/drill) | Browser-side module loader (`lm` / `l-m`) |
| [`packages/stanz`](./packages/stanz) | Proxy-based reactive data and watchers |
| [`packages/xhear`](./packages/xhear) | Web Components runtime and template compiler |
| [`packages/ofajs`](./packages/ofajs) | Application layer: components, pages, routing, context |
| [`packages/router`](./packages/router) | Hash-routing bridge (`o-router`) |
| [`packages/scsr`](./packages/scsr) | Real-path routing bridge (SCSR) |
| [`packages/plugins`](./packages/plugins) | Optional plugins: formData, inject-host, body-ghost, global-link |
| [`docs/website`](./docs/website) | Multilingual docs, tutorial, API reference and blog |

The runtime packages are source-only ESM. The published ofa.js bundle is built
with rollup into the root [`dist/`](./dist) directory.

## Documentation and playground

The documentation site is built from `docs/origin/<locale>`. Traditional
Chinese is generated from the Simplified source with `opencc-js`, not
hand-translated:

```bash
npm run sync:t-cn       # optional: regenerate docs/origin/t-cn
npm run build:website   # build cn + t-cn + en into docs/website
npm run server:website  # preview at http://localhost:3348
```

Open:

- Simplified Chinese: <http://localhost:3348/cn/>
- Traditional Chinese: <http://localhost:3348/t-cn/>
- English: <http://localhost:3348/en/>
- 日本語: <http://localhost:3348/ja/>

Each language includes guides, API reference, a 20-lesson interactive tutorial,
and a blog. The Traditional Chinese version is converted from the Simplified
source with `opencc-js` (see `scripts/sync-t-cn.mjs`); the Japanese version is
an AI-assisted translation. The playground edits and runs real ofa.js examples in the browser.

Sources live in [`docs/origin`](./docs/origin); generated pages live in
[`docs/website`](./docs/website). See [`docs/website/README.md`](./docs/website/README.md)
for the site architecture and translation workflow.

## Development

Requirements:

- Node.js 20 or newer (recommended)
- npm
- Playwright browser binaries for the full test suite

```bash
npm install
npx playwright install   # first time, for the test suite

npm test                 # all packages, chromium + firefox + webkit
npm run build            # build root dist/ bundles
npm run server           # static server at http://localhost:3348
```

Run a focused suite:

```bash
npm run test:drill
npm run test:stanz
npm run test:ofajs
npm run test:scsr
npm run test:router
npm run test:plugins
```

On macOS, if Firefox crashes with `sandbox_init() failed`, run:

```bash
MOZ_DISABLE_CONTENT_SANDBOX=1 npm test
```

If Playwright reports `Could not find profile folder`, point Firefox's app-data
root at a temporary directory:

```bash
mkdir -p /tmp/ffhome/Library/Application\ Support
CFFIXED_USER_HOME=/tmp/ffhome npm test
```

## Benchmarks

Benchmarks are manual tools, not part of the normal test gate:

```bash
npm run bench:drill
npm run bench:stanz
npm run bench:xhear
npm run bench:ofajs
npm run bench:cross   # ofa.js vs Vue vs React
```

See [`packages/ofajs/CONTEXT.md`](./packages/ofajs/CONTEXT.md) for benchmark
methodology and the latest v4→v5 results.

## Philosophy

ofa.js keeps the web platform as the runtime:

- HTML is the component format.
- CSS stays in the component.
- JavaScript stays in the browser.
- URLs stay real.
- No compilation step sits between what you write and what runs.

That constraint is what makes the framework small, debuggable, and easy to
deploy—and it is why v5 focuses on rendering correctness, list performance, and
clear module boundaries rather than adding a build pipeline.

## License

MIT © 2018–2026 ofa.js
