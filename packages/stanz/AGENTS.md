# stanz 包开发规则

本包是 Proxy 驱动的响应式数据库（npm 名 `stanz`）。全局纪律见根
[`AGENTS.md`](../../AGENTS.md)；测试规则以根文件为准，本文件只写本端细节。

## 开发前置规则

1. **阅读上下文**：首次接触本包先读 [`CONTEXT.md`](./CONTEXT.md)——里面有
   owner/冒泡模型、数组三分类处理策略、与 xhear 的扩展缝和踩坑清单。
2. **修改监听或数组行为前**，先通读 `src/` 六个模块，理解
   `main（类与构造）→ accessor（代理陷阱）→ watch（事件）→ array（数组增强）`
   的职责边界。

## 本端高频易错点

### 1. 多 owner 冒泡必须去重（必守）

> **事故案例**：重构时 `emitUpdate` 改为直接遍历 `_owner`，漏掉了旧版
> `owner` getter 返回 Set 的天然去重——同一子项被 push 两次后，
> 祖先监听对同一变更收到多次事件。
> **正确姿势**：单 owner 走零分配快路径；`_owner.length > 1` 时必须按
> `new Set(_owner)` 去重后再逐个冒泡（见 `src/watch.mjs`）。

### 2. 数组新增变更方法的接入规则

给数组加新的变更方法包装时，先判断它属于哪一类，**不要无脑全量差分**：

| 类别 | 判定 | 处理 |
|---|---|---|
| 解析型 | 变更位置可从参数与返回值推算（push/pop/shift/unshift/splice） | 按索引精确处理，O(1)~O(变更量) |
| 重排型 | 只打乱现有项顺序（reverse/sort） | 不变更是员归属，仅需事件 |
| 写入型 | 可能引入新成员（fill/copyWithin） | 走引用计数差分 |

**隐式语义清单**（改动前逐条确认新代码仍满足）：
等值重赋值会触发包裹但不发事件（`setData` 的 `isSame`）；`__unupdate` 抑制
内部包裹产生的事件；原生方法应用在 `this[SELF]` 上避免陷阱重入；返回自身
的方法要改返回 `this[PROXY]` 保持链式。

### 3. `_` 前缀约定

`_` 开头的属性绕过观察、不触发事件、不可枚举。代理陷阱里用
`key.charCodeAt(0) === 95` 判断——**symbol 键必须先于该判断处理**
（symbol 上调 charCodeAt 会抛错）。

### 4. xhear 扩展缝（破坏即断供）

xhear 的 XData 依赖这些导出，语义变更都是 breaking change：
`constructor(data, handler)`（自定义 handler 的构造入口）、`__OriginStanz`
（指定包裹类）、`_onrevokes`（revoke 钩子）、`setData`/`clearOwner`/
`emitUpdate`/`extend`/`getType`/`nextTick`/`dataRevoked`/`getRandomId`、
全部 Symbol（SELF/PROXY/WATCHS/ISXDATA）。

### 5. 保持零全局副作用

本包不写 window、不注册元素、不改任何全局——**这是它和 drill 的关键差异**，
也让新旧两版能在同一页面共存做 A/B 基准。新增代码不得破坏这一点。

## 测试规则（本端细节）

- 测试页在 `test/statics/`，用 `harness.mjs` 注册检查项；**新增用例后必须
  同步更新 `test/stanz.spec.js` 里该页的 `total` 数字**。
- 本包是纯 JS，node 里可直接冒烟：改完先
  `node --input-type=module -e "import stanz from './packages/stanz/src/base.mjs'; …"`
  快速验证核心行为，再跑浏览器全量。
