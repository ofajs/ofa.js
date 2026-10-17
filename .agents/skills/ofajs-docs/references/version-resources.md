# 版本与资源地址（v4 主线 / v5 分支）

本技能按 **v5** 行为编写，但 v5 **至今没有合并到 `main`，也没有发布到 npm**。
给项目写代码、贴 CDN 链接、查源码之前，先确认目标项目跑的是哪条线，否则会出现
「代码是 v5 写法、资源加载的却是 v4」或「按 v5 路径去取 v4 分支的文件」这类问题。

## 一、两条线的现状

| 线 | 位置 | 版本 | 目录结构 | 状态 |
|----|------|------|---------|------|
| v4 主线 | `main` 分支 / npm `ofa.js` | 4.7.7（npm `latest` 4.7.0） | 单包源码 `packages/ofa/`；router / scsr 桥接包在根 `libs/`；构建产物在根 `dist/` | 现网稳定 |
| v5 | `v5` 分支 | 5.0.0 | monorepo：`packages/{ofajs,router,scsr,drill,stanz,xhear}`，各包自带 `src/`、`test/`、部分带 `dist/` | **未合并 `main`，npm 未发布** |

判断项目实际版本，最直接的是在控制台读：

```js
console.log($.version); // v4.7.x 或 5.0.0
```

> **技能自身的位置**：本技能只存在于 `v5` 分支的 `.agents/skills/ofajs-docs`；
> `main` 分支对应的是根 `skills/ofajs-docs`（v4 版内容）。在 GitHub 上直接看
> `main` 是找不到 `.agents/` 的，需要切到 `v5` 分支。v5 合并进 `main` 时，两处
> 技能目录要合并对齐（不要留下两份不同步的副本）。

## 二、为什么 v5 要写 `@refs/heads/v5`

jsdelivr 的 `gh/用户/仓库@版本/文件` 里，`@` 后面**先按 semver 版本号/tag 解析**，
匹配不到才回退到分支。仓库分支叫 `v5`，形似版本号，于是：

```text
https://cdn.jsdelivr.net/gh/ofajs/ofa.js@v5/dist/ofa.min.mjs
→ 404（jsdelivr 去找名为 v5 的 tag，找不到）
```

正确写法是显式声明「这是分支」：

```text
https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs
→ 200
```

需要固定、可复现的资源时，把分支换成 commit hash（`@5e39afa/...`）。
只读源码（不用于 `<script type="module">` 加载）也可以走
`https://raw.githubusercontent.com/ofajs/ofa.js/v5/...`；但 raw 的 MIME 不保证是
JavaScript，**不要**拿 raw 地址做模块脚本引用。

> **jsdelivr 的 404 不一定代表文件不存在**：分支刚推送、目录刚迁移（如 `libs/` →
> `packages/`）后，jsdelivr 可能仍返回缓存的 404，错误文案形如
> `Failed to fetch ofajs/ofa.js@refs from GitHub`。先在 GitHub / raw 确认文件确实
> 在分支上，再给 URL 加 `?v=1`（或换成 commit hash）触发回源；回源成功后原地址
> 也会恢复。**不要**因为一次 404 就改回 v4 路径。

## 三、地址速查

### 3.1 推荐：ESM + CDN

```html
<!-- v5 分支 -->
<script
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs"
  type="module"
></script>

<!-- v4 主线 -->
<script
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs"
  type="module"
></script>
```

### 3.2 路由 / 同构渲染桥接包

| 包 | v5 | v4 |
|----|----|----|
| o-router | `...@refs/heads/v5/packages/router/dist/router.min.mjs` | `.../libs/router/dist/router.min.mjs` |
| scsr | `...@refs/heads/v5/packages/scsr/dist/scsr.min.mjs` | `.../libs/scsr/dist/scsr.min.mjs` |

v5 的 router / scsr 目录迁移后，产物也在各自包内：

```text
packages/router/dist/router.min.mjs   packages/router/dist/router.min.js
packages/scsr/dist/scsr.min.mjs       packages/scsr/dist/scsr.min.js
```

由仓库根 `npm run build`（rollup）生成，**不手改**。v4 对应产物在 `libs/router/dist/`、
`libs/scsr/dist/`。

### 3.3 经典 script（UMD）组合

```html
<!-- v5 -->
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.js"></script>

<!-- v4 -->
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.js"></script>
```

UMD 全局名：ofa.js 为 `$`（同时挂 `globalThis.ofa`），router 为 `ofaRouter`，
scsr 为 `ofaScsr`。

### 3.4 npm

- v4：`npm i ofa.js`（latest 4.7.x）。
- v5：**没有发布**，`npm i ofa.js@5` / `npm i ofa.js@latest` 都拿不到 5.x；
  monorepo 内各包名为 `ofa.js`、`router`、`scsr`，靠根 `workspaces` 本地链接，
  不经过 npm registry。

## 四、加载顺序（router / scsr 与 v4 相同）

router / scsr 是**桥接包**，不自带框架，直接挂接页面已加载的全局 `$`：

```html
<script src=".../dist/ofa.min.js"></script>
<script src=".../packages/router/dist/router.min.js"></script>
```

或 ESM：

```html
<script type="module">
  import "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";
  import "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.mjs";
</script>
```

**必须先 ofa.js 后 router/scsr**：router 缺 `$` 会直接抛错，scsr 会告警后退出。
用 `<l-m src="...router.min.mjs">` 时同样要保证 ofa.js 的 script 在它之前执行
（放在 `<head>` 或更早即可）。

## 五、monorepo 源码引用（v5）

```text
packages/
├── ofajs/    框架本体（组件/页面/o-app/o-page/o-router 对接层）
├── router/   o-router（hash 路由桥）
├── scsr/     SCSR 同构渲染桥
├── drill/    浏览器端模块加载器
├── stanz/    响应式数据
└── xhear/    Web Components 底座与模板渲染
```

- **仓库内**：源码之间用相对路径引入（如 `packages/ofajs/src/main.mjs` 引
  `../../xhear/src/base.mjs`），浏览器直接加载 `src/*.mjs`，无构建步骤。
- **包名引用**：monorepo 由根 `workspaces` 链接，仓库内可直接
  `import "ofa.js"; import "router"; import "scsr";`（包名以各包 `package.json` 为准；
  新拉仓库先 `npm install`，否则 router/scsr 还没有 workspace 软链）。
- **仓库外**：`src/*.mjs` 也能从 CDN 直接加载（相对 import 会一并取回），但
  router/scsr 的 `src` 是未压缩源码、还会多一次 `sync.mjs` 请求；生产和示例一律
  用 `dist/` 产物更稳、更省。

本地跑 v5：

```bash
npm install
npm run server   # http://localhost:3348
npm run build    # 重新生成根 dist/ 与 packages/{router,scsr}/dist/
npm test         # 三浏览器全量
```

## 六、v5 合并进 `main` 之后要改什么

v5 并入 `main` 后，默认地址（不带 `@refs/heads/v5`）就会指向 5.x。届时需要：

1. 把本文与 `SKILL.md` 的资源表里的 `@refs/heads/v5/` 前缀全部删掉；
2. 把 v4 的 `libs/router`、`libs/scsr` 行删掉（或标注为历史）；
3. 更新 npm 说明（如果 5.0 已发布）。

在此之前，所有示例保留 `@refs/heads/v5/` 前缀，避免读者拿到 v4 产物。

## 七、常见错误对照

| 现象 | 根因 | 正确做法 |
|------|------|---------|
| `@v5/...` 返回 404 | jsdelivr 把 `v5` 当 semver tag | 写 `@refs/heads/v5/...` |
| `libs/router/dist/router.min.mjs` 404 | v5 已把桥接包迁到 `packages/router` | 用 `packages/router/dist/...` |
| `packages/router/dist/...` 404 | 目标项目/分支是 v4 | 改回 `libs/router/dist/...` |
| `npm i ofa.js@5` 失败 | v5 未发布 npm | 用 v5 分支 CDN，或在 monorepo 内开发 |
| 页面用了 `x-if` / `x-fill` 报弃用错 | 加载到了 v5 | 改用 `o-if` / `o-fill`（或确认是否该用 v4） |
| router 启动即报 `$ is missing` | 桥接包先于 ofa.js 执行 | 调整 script 顺序，ofa.js 必须在前 |
| 改代码不生效 | 见 SKILL.md「页面模块缓存」条目 | 用带 query 的整页刷新 |

## 八、本技能 assets 的版本

`assets/` 下的示例页面统一使用 **v5 分支**地址（`@refs/heads/v5`），与技能正文
行为一致。若要拿示例给 v4 项目用：删掉 `@refs/heads/v5`，并把 router/scsr 的
`packages/.../dist/` 换回 `libs/.../dist/`。
