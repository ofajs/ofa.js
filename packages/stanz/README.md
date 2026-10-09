# stanz

reactive data driven by Proxy: every plain object/array assigned into a stanz
instance gets wrapped automatically, changes bubble through owner chains, and
array mutations are observable. This is the monorepo home of stanz
(`packages/stanz`), consumed by ofa.js and usable standalone.

## Install & use

```js
import stanz from "https://unpkg.com/stanz/src/base.mjs";

const data = stanz({
  val: "hello",
  obj: { val: "world" },
});

data.watch((event) => {
  console.log(event.type, event.target === data.obj, event.path);
});

data.obj.val = "changed"; // bubbles to data
```

## API

- `stanz(data)` — create reactive data; `stanz.is(value)` detects instances
- `watch(callback)` / `unwatch(wid)` — observe changes (`event.type` is
  `set` / `delete` / `array` / `refresh`; `event.path` is the owner chain
  between the watched node and the change target)
- `watchTick(callback, wait?)` — batch same-tick changes into a `Watchers`
  list; each item exposes `hasModified("a.b")` for chain matching
- `refresh(opts?)` — emit a manual event
- `revoke()` — tear down the instance, clear cross references and revoke the
  proxy
- `toJSON()` / `toString()` — restore plain data (keeps `xid`)
- `extend(obj, desc?)` — add methods onto an instance
- properties prefixed with `_` bypass observation and stay non-enumerable

## Differences from stanz 8.x

- removed the rarely used `watchUntil`, `Watcher#hasReplaced` and the
  dot-path `get`/`set` methods (plain property access covers them)
- no dependency on `ofa-error`; errors are plain `TypeError`/`Error`
- performance work: owner bubbling iterates `_owner` directly (single-owner
  fast path), array `push`/`pop`/`shift`/`unshift`/`splice` derive changed
  indices analytically instead of full diff scans, unwatched array mutations
  skip backup copies and event construction entirely, and type checks avoid
  regex/toLowerCase on the hot path
- source-only ESM package (no prebuilt dist)

## Development

Tests are self-checking pages under `test/statics/` driven by playwright
specs, run from the repository root:

```sh
npm install
npm test
```

A benchmark comparing this stanz against the legacy 8.2.x source (archived
under `benchmark/vendor/legacy`) lives in `benchmark/`; both versions run
side by side in one page with interleaved A/B sampling:

```sh
npm run bench:stanz
```
