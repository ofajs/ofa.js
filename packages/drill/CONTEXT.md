# drill 上下文说明

## 一、一句话定位

浏览器端声明式模块加载器：`lm(import.meta)("./a.mjs .txt")` 一句话加载
模块/文本/JSON/WASM/CSS，洋葱模型中间件可扩展任意类型的处理。
npm 名 `drill.js`，当前版本 6.0.0（源 ESM，无预构建产物）。

## 二、技术栈

- 纯 ESM（`src/*.mjs`），零运行时依赖，浏览器直接加载
- 错误统一为本地 `DrillError`（`code` + ES2022 `cause`），已移除 ofa-error
- 测试：自检页 + playwright；基准：与冻结的 5.3.x 源码分页对比

## 三、目录结构树

```
packages/drill/
├── src/
│   ├── main.mjs         入口：组装 lm.use/lm.path，冻结，window.lm（历史契约）
│   ├── lm.mjs           lm 工厂 + agent（类型判定→处理器链→结果/-ctx）
│   ├── processors.mjs   use()注册表 + 内建处理器（js/mjs、txt/html/htm、json、wasm、css）
│   ├── path.mjs         标识符 → 绝对 URL（保留尾部参数），无 @ 别名
│   ├── onion.mjs        洋葱模型中间件链
│   ├── load-module.mjs  <load-module>/<l-m> 元素（src 锁定、pause、css 注入）
│   └── error.mjs        DrillError + err 工厂
├── test/
│   ├── statics/         自检式测试页 + harness.mjs + 夹具
│   └── statics.spec.js  断言各页渲染结果（改用例数要同步 total）
├── benchmark/           新旧对比（vendor/legacy 为 5.3.x 冻结源码）
└── README.md            完整 API 文档（用户面向）
```

依赖方向无环：`main → load-module → lm → processors/onion/path → error`。

## 四、对外契约表

| API | 说明 |
|---|---|
| `lm(meta?, opts?)` | 工厂；meta 通常传 `import.meta`；返回加载函数 |
| 加载参数 | `.type` 强制类型、`--real:xxx` 记录真实地址、`-ctx` 返回上下文、`-direct` 保留查询串 |
| `lm.use(name(s)\|fn, handler)` | 注册处理器中间件；裸函数默认注册 js/mjs |
| `lm.path` / 具名 `path` | 标识符解析（ofa 的 resolvePath 即它） |
| `<load-module>` / `<l-m>` | 自动加载 src；`loaded`、`pause`、src 锁定、css 注入 |
| 事件 | 元素派发 `load`、`connected`（带 `.root`）、`disconnected`（css 清理依赖它） |
| 上下文 ctx | `url / result / realUrl / params / element`；ofa 的页面中间件依赖这些字段 |
| `window.lm` | CDN 直引 ESM 场景的全局，历史契约保留 |

## 五、关键行为与口径

- 类型判定优先级：`.type` 参数 > 路径扩展名 > fetch 后按 Content-Type 嗅探；
  都未命中则返回原始 Response
- fetch 缓存键默认剥掉查询串，`-direct` 保留；缓存的是 promise，天然并发去重
- 动态 import 前剥查询串：不同参数拼写共享浏览器模块缓存
- txt/html/json/wasm 统一 2xx 检查，失败抛 `load_fail_status`
- 元素初始化入口是升级时重放的 `attributeChangedCallback(name, null, value)`

## 六、运行方式

- 测试：仓库根目录 `npm test`（详见根 AGENTS.md；包内脚本已显式指向根配置）
- 手动预览测试页：`npm run server` →
  `http://localhost:3348/packages/drill/test/statics/loader.html`
- 基准：`npm run bench:drill`

## 七、给后续 AI 的提示（踩坑）

1. **window.lm 裸引用事故**：旧版 component.mjs 靠 base.mjs 先执行写入全局才
   能拿到 lm——症状是单测/独立引入时元素初始化崩。已改为显式 import；
   新代码禁止 window 全局通信（见本包 AGENTS.md）。
2. **json/wasm 曾经不检查 HTTP 状态**：404 会变成难懂的解析错误。重构后统一
   走 `read()` 的 2xx 检查；新增文本类处理器必须复用 `read()`。
3. **@ 别名体系是用户明确决策删除的，不要加回来**：旧 drill 的
   `lm.config({alias})` / `aliasMap` / `path()` 的 `@name` 展开，迁移时
   （2026-10-09）按用户要求删除，移植 old/test/cases 时曾恢复过一次，
   用户再次明确"不要加回来，对应案例也删去"（2026-10-10）。旧案例
   alias / alias-page 因此不移植。再遇到依赖别名的场景，用完整相对/
   绝对路径替代。
3. **升级重放即初始化**：删掉 `attributeChangedCallback` 的 `oldValue === null`
   分支会导致解析器创建的元素不再自动加载（动态 `createElement` 不受影响，
   极难第一时间发现）。
4. **benchmark 只能分页对比**：两版 drill 争抢 `window.lm` 与元素标签名，
   无法同页共存——与 stanz 不同，不要照搬 stanz 的同页 A/B 结构。
