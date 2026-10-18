# 版本、资源地址与引入

给项目写代码、贴 CDN 链接、查源码之前，先确认目标项目跑的是哪条线：当前仓库有
**v4 主线**和**v5 分支**，资源地址不同，混用会直接 404 或加载到错误版本。

## 一、两条线的现状

| 线 | 位置 | 版本 | 目录结构 | 状态 |
|----|------|------|---------|------|
| v4 主线 | `main` 分支 / npm `ofa.js` | 4.7.7（npm `latest` 4.7.0） | 单包源码 `packages/ofa/`；router / scsr 在根 `libs/`；产物在根 `dist/` | 现网稳定 |
| v5 | `v5` 分支 | 5.0.0 | monorepo：`packages/{ofajs,router,scsr,drill,stanz,xhear}`，各包自带 `src/`、`test/`、部分带 `dist/` | **未合并 `main`，npm 未发布** |

判断实际版本，在控制台读：

```js
console.log($.version); // 4.7.x 或 5.0.0
```

> 本技能位于 `v5` 分支的 `.agents/skills/ofajs1`（精简重构版），`main` 分支上
> 没有 `.agents/`。v5 合并进 `main` 时，需要把技能目录一并合并对齐。

## 二、资源地址

### 2.1 ofa.js 本体

| 方式 | v5（分支） | v4（`main` / npm 4.7.x） |
|------|-----------|--------------------------|
| ESM（推荐） | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs` | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs` |
| UMD（经典 script） | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.js` | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.js` |

- ESM 引入后自动挂全局 `$`（以及 `globalThis.ofa`）；
- URL 后加 `#debug` 开启 sourcemap：`.../ofa.min.mjs#debug`；
- UMD 全局名：`$`，同时暴露 `exports.Stanz`。

### 2.2 router / scsr 桥接包

| 包 | v5 | v4 |
|----|----|----|
| o-router | `.../ofa.js@refs/heads/v5/packages/router/dist/router.min.mjs` | `.../ofa.js/libs/router/dist/router.min.mjs` |
| scsr | `.../ofa.js@refs/heads/v5/packages/scsr/dist/scsr.min.mjs` | `.../ofa.js/libs/scsr/dist/scsr.min.mjs` |

UMD 全局名为 `ofaRouter` / `ofaScsr`。产物由仓库根 `npm run build`（rollup）生成，
**不手改**。

### 2.3 为什么 v5 要写 `@refs/heads/v5`

jsdelivr 的 `gh/用户/仓库@版本/文件` 会先把 `@` 后面当 semver/tag 解析。分支名
`v5` 形似版本号，但仓库没有 `v5` tag：

```text
.../ofa.js@v5/dist/ofa.min.mjs            → 404（按 tag 解析，找不到）
.../ofa.js@refs/heads/v5/dist/ofa.min.mjs → 200（显式声明分支）
```

需要可复现的固定版本时用 commit hash（`@5e39afa/...`）。只读源码也可用
`raw.githubusercontent.com/ofajs/ofa.js/v5/...`，但 raw 的 MIME 不保证是
JavaScript，**不要**拿它做模块脚本引用。

> jsdelivr 的 404 不一定代表文件不存在：分支刚推送或目录刚迁移（如 `libs/` →
> `packages/`）后可能返回缓存的 404（文案形如 `Failed to fetch ... from GitHub`）。
> 先在 GitHub / raw 确认文件确实在，再给 URL 加 `?v=1` 或换 commit hash 触发回源，
> 成功后原地址恢复。不要因一次 404 就改回 v4 路径。

### 2.4 加载顺序

router / scsr 是**桥接包**，不自带框架，直接挂接页面已加载的全局 `$`：

```html
<script src=".../dist/ofa.min.js"></script>
<script src=".../packages/router/dist/router.min.js"></script>
```

ESM 同理，import 顺序必须是 ofa.js 在前：

```html
<script type="module">
  import "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";
  import "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.mjs";
</script>
```

用 `<l-m src="...router.min.mjs">` 时，也要保证 ofa.js 的 script 更早执行
（放 `<head>` 即可）。router 缺 `$` 直接抛错，scsr 告警后退出。

### 2.5 npm 与 monorepo 源码

- v4：`npm i ofa.js`（latest 4.7.x）。
- v5：**未发布**，`npm i ofa.js@5` 拿不到；monorepo 内包名为 `ofa.js`、`router`、
  `scsr`，靠根 `workspaces` 链接（新拉仓库先 `npm install`）。
- 仓库内源码用相对路径引入（如 `packages/ofajs/src/main.mjs` 引
  `../../xhear/src/base.mjs`），浏览器直接加载 `src/*.mjs`，无构建步骤。
- 仓库外给示例/生产用时，一律用 `dist/` 产物（`src` 未压缩且会多请求依赖文件）。

## 三、本地开发与部署

```bash
npm install
npm run server   # http://localhost:3348（零依赖静态服务器）
npm run build    # 重新生成根 dist/ 与 packages/{router,scsr}/dist/
npm test         # 三浏览器全量
```

部署：ofa.js 项目就是静态文件，直接放到 Nginx / Apache / 任意静态主机的目录即可，
不需要 Node.js 运行时。需要压缩混淆时用 Terser 或在线 `builder.ofajs.com`。

## 四、v5 合并进 `main` 之后

默认地址（不带 `@refs/heads/v5`）就会指向 5.x，届时：

1. 删除本文与 `SKILL.md` 里的 `@refs/heads/v5/` 前缀；
2. 删除 v4 的 `libs/router`、`libs/scsr` 行（或标为历史）；
3. 如 5.0 已发布 npm，更新 npm 说明。

## 五、常见错误对照

| 现象 | 根因 | 正确做法 |
|------|------|---------|
| `@v5/...` 404 | jsdelivr 把 `v5` 当 semver tag | 写 `@refs/heads/v5/...` |
| `libs/router/...` 404 | v5 已迁到 `packages/router` | 用 `packages/router/dist/...` |
| `packages/...` 404 | 目标项目/分支是 v4 | 改回 `libs/...` |
| `npm i ofa.js@5` 失败 | v5 未发布 npm | 用 v5 分支 CDN，或在 monorepo 内开发 |
| `x-if` / `x-fill` 报弃用 | 加载到了 v5 | 改用 `o-if` / `o-fill` |
| router 启动报 `$ is missing` | 桥接包先于 ofa.js 执行 | 调整 script 顺序 |
| 改代码不生效 | 模块/HTTP 缓存 | 用带 query 的整页刷新（见 `pitfalls.md`） |
