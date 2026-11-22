# drill 包开发规则

本包是浏览器端模块加载器（npm 名 `drill.js`）。全局纪律见根
[`AGENTS.md`](../../AGENTS.md)；测试规则以根文件为准，本文件只写本端细节。

## 开发前置规则

1. **阅读上下文**：首次接触本包先读 [`CONTEXT.md`](./CONTEXT.md)——里面有
   完整 API 契约、与 ofa 的集成面和踩坑清单。
2. **修改加载行为前**，先通读 `src/` 全部七个模块（总共几百行），理解
   "解析型 / 重排型 / 写入型"的模块分层与无环依赖方向。

## 本端高频易错点

### 1. 自定义元素注册的隐式语义

- 同一构造器只能 `customElements.define` 一次，`<l-m>` 靠空子类 `LM` 复用
  行为——不要试图直接注册 `LoadModule` 两次。
- **升级已有元素时，`attributeChangedCallback` 会以 `(name, null, value)`
  重放**——这是解析器创建的 `<l-m src="...">` 的初始化入口。改动 src 初始化
  逻辑时必须保留 `oldValue === null` 分支。
- `src` 锁定后，`el.src =` 靠实例 value 属性在严格模式下抛错拦截；
  `setAttribute` 靠回调回退 + 抛 `change_lm_src`。两条路都要保住。

### 2. 禁止跨模块使用 window 全局通信

> **事故案例**：旧版 `component.mjs` 裸引用 `window.lm`，依赖 `base.mjs`
> 恰好先执行写入全局才不崩——隐性循环耦合，静态分析不可见。重构时已改为
> 直接模块导入。**正确姿势**：模块依赖一律显式 `import`，依赖图保持无环
> （onion → error → path → processors → lm → load-module → main）。

### 3. 浏览器全局副作用是历史契约，不是模式

`main.mjs` 里的 `window.lm = lm` 是给 CDN 直引 ESM 场景的兼容行为，**保留但
不得效仿**：新增功能严禁再写 window 全局。这也限制了 benchmark 的结构
（新旧两版 drill 因争抢 `window.lm` 与元素标签无法同页共存，只能分页对比）。

### 4. 代理契约（ofa 依赖面，破坏即断供）

对外契约改动前必须确认 ofa 侧用法：`lm()` 工厂、`lm.use()`、`path` 具名导出、
`l-m`/`load-module` 元素、`.mjs`/`--real:`/`-ctx`/`-direct` 参数。任何一项的
语义变更都是 breaking change，需升主版本并在 README 标注。

## 测试规则（本端细节）

- 测试页在 `test/statics/`，是自检式页面：新增用例用 `harness.mjs` 的
  `test()` 注册，页面渲染结果由 `test/statics.spec.js` 断言。
  **新增用例后必须同步更新 statics.spec.js 里该页的 `total` 数字**，
  否则"防用例静默减少"的保护会误报。
- 加载类用例依赖静态服务器的 MIME 表（`.mjs` 必须 `text/javascript`）；
  新增文件类型先查 `scripts/static-server.mjs` 的 MIME 映射。

## 基准说明

`benchmark/` 里 `vendor/legacy/` 是旧版 5.3.x 冻结源码（含 ofa-error），
只读对比用；夹具 `fixtures/` 由 `run.mjs` 动态生成、跑完即删，不进仓库。
