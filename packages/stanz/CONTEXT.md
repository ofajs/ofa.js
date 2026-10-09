# stanz 上下文说明

## 一、一句话定位

Proxy 驱动的响应式数据库：赋值进来的普通对象/数组自动包裹为可监听实例，
变更沿 owner 祖先链冒泡，数组变更可观测。npm 名 `stanz`，
当前版本 9.0.0（源 ESM，无预构建产物）。

## 二、技术栈

- 纯 ESM（`src/*.mjs`），零运行时依赖，无任何全局副作用
  （不写 window、不注册元素——因此新旧两版可同页共存做 A/B 基准）
- 测试：自检页 + playwright，另可在 node 直接冒烟（纯 JS，无 DOM 依赖）
- 基准：与冻结的 8.2.x 源码同页 A/B 交替对比

## 三、目录结构树

```
packages/stanz/
├── src/
│   ├── main.mjs       Stanz 类（继承 Array）、Symbol 契约、constructor 构造核心
│   ├── accessor.mjs   代理 set/delete 陷阱、setData、clearOwner、handler 导出
│   ├── watch.mjs      emitUpdate 冒泡、Watcher/Watchers、watch/unwatch/watchTick/refresh
│   ├── array.mjs      数组方法增强（解析型/重排型/写入型三分类）
│   ├── public.mjs     getRandomId/getType/isObject/nextTick/debounce/extend/dataRevoked
│   └── base.mjs       stanz(data) 工厂 + stanz.is
├── test/
│   ├── statics/       自检式测试页（accessor/watch/array/methods）+ harness.mjs
│   └── stanz.spec.js  断言各页渲染结果（改用例数要同步 total）
├── benchmark/         同页 A/B 对比（vendor/legacy 为 8.2.x 冻结源码）
└── README.md          完整 API 文档与 8.x→9.0 破坏性变更
```

## 四、对外契约表

| API | 说明 |
|---|---|
| `stanz(data)` / `stanz.is(v)` | 工厂与实例判定 |
| `watch(cb)` / `unwatch(wid)` | 监听；事件字段 `type/name/value/oldValue/target/currentTarget/path/args` |
| `watchTick(cb, wait?)` | 同钟合并批量回调，收到 `Watchers`（数组子类，含 `hasModified("a.b")`） |
| `refresh(opts?)` | 手动派发 `refresh` 事件 |
| `revoke()` | 注销：清监听、解双向引用、撤销代理 |
| `toJSON()` / `toString()` | 还原纯数据，保留 `xid` |
| `extend(obj, desc?)` | 实例扩展方法 |
| 内部导出 | `constructor(data, handler)`、`setData`、`clearOwner`、`emitUpdate`、`handler`、`extend`、`getType`、`nextTick`、`dataRevoked`、`getRandomId`、Symbol 四件套——**xhear 依赖，见 AGENTS.md 扩展缝** |

## 五、关键行为与口径

- `_` 前缀属性：绕过观察、不发事件、不可枚举（陷阱内 charCodeAt 判断，
  symbol 键必须先处理）
- 普通对象/数组赋值自动包裹并登记 owner；已有 stanz 赋值共享实例；
  同值/同实例重复赋值不重复登记；覆盖与 delete 解除 owner
- 访问器属性（get/set）原样保留，setter 内存的对象不包裹
- 冒泡：沿 `_owner` 逐层向上，`path` 记录中间链；**多 owner 必须 Set 去重**；
  环状引用经 `path.includes` 安全切断
- `_update = false` 阻断子树冒泡；`__unupdate` 抑制内部包裹事件
- 数组三分类：解析型（push/pop/shift/unshift/splice，按参数与返回值定位变更）、
  重排型（reverse/sort，仅需事件）、写入型（fill/copyWithin，差分）；
  全链无监听时跳过备份与事件构建（`hasWatchersUpwards`，含环防护）
- 数组返回自身的方法（sort/reverse/fill/copyWithin）改返回代理保持链式

## 六、运行方式

- 测试：仓库根目录 `npm test`；node 冒烟：
  `node --input-type=module -e "import stanz from './packages/stanz/src/base.mjs'"`
- 手动预览测试页：`npm run server` →
  `http://localhost:3348/packages/stanz/test/statics/watch.html`
- 基准：`npm run bench:stanz`

## 七、给后续 AI 的提示（踩坑）

1. **多 owner 去重事故**：直遍 `_owner` 丢掉了旧版 Set 快照的去重语义，
   重复 push 的子项让祖先收到重复事件（node 冒烟当场抓出）。改冒泡逻辑前
   先读 `watch.mjs` 的注释与单 owner 快路径设计。
2. **benchmark 顺序偏差**：先后采集会让后采集方承受机器热漂移，曾把新版
   冒泡误判为 -22%（实际 +103%）。方法论见技能 `benchmark-methodology`。
3. **`delete this.__unupdate` 等值重赋值包裹技巧**：数组补包新增项用的是
   `__unupdate = 1; this[i] = value; delete this.__unupdate`——依赖 setData
   对同值对象仍会包裹但不发事件的行为，动 `isSame` 逻辑前先理解这里。
4. **node 冒烟先行**：本包不依赖 DOM，改完先在 node 里跑核心行为断言
   （几秒钟），比直接开浏览器全量快得多，也曾在冒烟里抓出去重回归。
