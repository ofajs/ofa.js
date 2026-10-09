# drill.js

A declarative module loader that runs on the browser. This is the monorepo
home of drill.js (`packages/drill`), consumed by ofa.js and usable standalone.

## Install & use

```html
<script type="module">
  import lm from "https://unpkg.com/drill.js/src/main.mjs";

  const load = lm(import.meta);

  const data = await load("./data.json");
  const module = await load("./mod.mjs");
</script>
```

## API

### `lm(meta?, opts?)`

Creates a loader bound to a base address (usually `import.meta`, or nothing to
use the current document address). `opts.element` binds a `load-module` element
for load-state tracking.

The returned loader takes a URL with optional space-separated params:

| param | effect |
| --- | --- |
| `.type` | force the processor type, e.g. `./mod.mjs .txt` loads it as text |
| `--real:xxx` | record the original address as `ctx.realUrl` |
| `-ctx` | resolve with the whole load context instead of the result |
| `-direct` | keep the query string (no cache-key stripping) |

### `lm.use(name | names | handler, handler?)`

Register a processor middleware (onion model) for a type. A bare function
registers for the default module types (`js`, `mjs`). Built-in processors:
`js`/`mjs` (dynamic import), `txt`/`html`/`htm`, `json`, `wasm`, `css`.

```js
lm.use("md", async (ctx, next) => {
  const text = await fetch(ctx.url).then((e) => e.text());
  ctx.result = renderMarkdown(text);
});
```

### `lm.path`

Re-exported `path(moduleName, baseURI?)`: resolves a specifier (including any
trailing params) to an absolute URL.

### `<load-module>` / `<l-m>`

Custom elements that load `src` automatically once defined:

```html
<l-m src="./style.css"></l-m>
```

- `loaded` — readonly flag, `true` after the load finishes (a `load` event is
  dispatched)
- `pause` — attribute present at init delays loading until it is removed
- `src` is locked after initialization; changing it reverts the attribute and
  throws (`change_lm_src`)
- a `css` src injects a stylesheet link into the element's root; it is removed
  when the element disconnects

## Differences from drill.js 5.x

- **The `@alias` quick-path system is removed** — `lm.config`, `lm.alias` and
  the `@name/...` specifier form no longer exist; use plain relative/absolute
  URLs.
- No dependency on `ofa-error`; errors are `DrillError` instances with a
  stable `code` (`load_fail`, `load_fail_status`, `load_module`,
  `change_lm_src`) and a `cause` chain.
- `json` and `wasm` loads now fail with `load_fail_status` on non-2xx
  responses, matching the `txt`/`html` behavior.
- Source-only ESM package (no prebuilt dist); the loader code registers
  `window.lm` when a DOM is present.

## Development

Tests are playwright specs run from the repository root (`npm install &&
npm test`). Each static page under `test/statics/` is a self-checking test
view: it renders its named checks with pass/fail badges, so you can watch the
suite by simply opening the pages — start the static server and browse:

```sh
npm run server
# then open e.g. http://localhost:3348/packages/drill/test/statics/loader.html
```

The playwright specs assert on those rendered results, so automation and
humans see the same evidence, across chromium, firefox and webkit.

### Benchmark

A comparison tool pits the current drill against the legacy 5.3.x source
(archived under `benchmark/vendor/legacy`) on identical scenarios: module
loads (serial/parallel, cold/warm), fetch cache, `l-m` element batches,
`path()` resolution and middleware chain throughput, plus runtime source
size. Run it from the repository root:

```sh
npm run bench
```

It drives `benchmark/bench.html?v=old|new` (openable by hand as well) with
playwright, alternates both versions for several rounds and reports medians
with a per-scenario verdict.
