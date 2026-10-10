# xhear 开发规则（AGENTS.md）

本文件是 `packages/xhear` 的开发规则；包的定位、目录结构、契约表、踩坑见
[CONTEXT.md](./CONTEXT.md)。测试与提交的全局纪律见根 [AGENTS.md](../../AGENTS.md)。

## 一、与 stanz 的扩展缝（不可破坏）

xhear 深度复用 stanz 的内部导出，以下接缝改动前必须确认双包兼容：

| stanz 导出 | xhear 用途 |
|---|---|
| `constructor(data, handler)`（main.mjs） | Xhear 构造：同一套代理/观察/撤销机制换用 xhear 自己的 handler |
| `handler`（accessor.mjs） | xhear handler 的 set 委托目标（数字键映射子元素后余下交给 stanz） |
| `emitUpdate`（watch.mjs） | DOM 数组操作（push/splice 等）与表单输入派发数据事件 |
| `isxdata` / `Stanz` / `watchFn`（watch.mjs 默认导出） | prop 释放断链、fill 项数据、元素监听能力 |
| `_bubbleOwners` 钩子 | 见下节 |

stanz 的公共 API 刻意保持最小面：**点路径 `get("a.b")`/`set("a.b", v)` 归
xhear 承担**（`src/path.mjs`），不要塞回 stanz；stanz 侧也不要为 xhear 加
专用逻辑，需要挂钩时用 `_bubbleOwners` 这类可选钩子。

### `_bubbleOwners` 冒泡钩子（重要语义）

stanz 的 `emitUpdate` 默认只沿数据 `_owner` 链冒泡；Xhear 原型挂了
`_bubbleOwners()`（返回含 `parentNode` 的 owner Set），使数据事件**同时沿
DOM 树上浮**。shadow 级订阅（如 formData 插件、用户在 shadow 上
watchTick）完全依赖这条 DOM 传播路径。

> **事故案例**：stanz 重构时把冒泡从 owner getter 改为内部 `_owner` 数组，
> 丢掉了"xhear 的 owner getter 含 parentNode"这一隐式语义——input 编辑、
> fill 增删后 shadow 级收集全部失灵，且无任何报错（事件只是不再到达）。
> 教训：**优化事件路径前，先列出旧实现的隐式语义清单逐条确认**；
> "事件能沿 DOM 冒泡"就是被丢掉的一条。

## 二、渲染层的稳定契约

编译产物与运行时握手点是 compile/render/condition/fill 四方共享的契约，
**改动必须多处同步**：

- `template.__xt`（绑定描述符数组）—— 编译产物：`{t:"text"|"style"|"bind",
  path, …}`，path 以 content.childNodes 索引为基准，表达式函数编译一次
  共享（实例经 call 注入上下文）；
- `xt-src` 属性 + `xtRegistry`（compile.mjs）—— 条件模板编译原件的
  登记/取回。实例克隆携带属性但不携带 JS 属性，且 x-if 的 init 级联
  可能早于绑定阶段，**跨实例引用一律走注册表，不要在运行期挂原型外
  的引用**；
- `_bindingRendered` + `binding-rendered` 事件 —— "绑定就绪"握手，
  x-if/x-fill 靠它决定何时 init；
- `template[condition]` / `template[name]` —— 条件内容与命名模板；
- `__revokes`（节点属性）+ `revokeAll` —— 副作用撤销登记，x-if 清空、
  fill 删项、组件销毁统一走这里；
- `__render_data` / `__render_temps`（宿主节点）—— `getRenderData` 沿
  DOM 向上找渲染数据源；
- `__internal`（节点标记）—— 数组内部搬动标记，抑制 attached/detached 误触发；
- `renderExtends`（render.mjs）—— beforeConvert/afterConvert/beforeRender/
  render 四个钩子，上层框架（ofa.js）靠"捕获旧钩子再重赋"的方式介入，
  对象形状与挂载时机不可改。

**动作元数据挂在方法函数上**（`prop.always`、`sync.revoke` 等）——这是
上层框架包装动作时的扩展缝（ofa.js 的 extend 会复制 `.always`），
禁止改成注册表或 Map。

**动作层调用契约**：传给动作的求值函数必须"无 this 可直调、参数可
透传"（getVal 裸调、事件监听直传 `$event`）——共享编译函数不能直接
交给动作，须先经闭包绑定实例上下文（render bind 分支的 `fn`）。

**DOM 三规则**（重构实测踩坑）：`template.append()` 与
`template.firstChild/childNodes` 走光子层，content 需显式访问
（moveChildren 两端归一化）；`cloneNode` 不复制 JS 属性（跨实例引用走
xt-src 注册表）；xhear 代理的 target 是 Xhear 实例对象，`_` 前缀状态
经代理写入，DOM 元素裸赋值是另一个存储位。

render 保留兼容回退路径（xtext/x-bind-data 全量扫描），处理未经本版
编译器的输入；内部流程一律走快路径，不要给回退路径加新能力。

## 三、新模板语法的接入方式

新增一种 `前缀:参数` 指令的动作时：

1. 在元素原型上实现方法，签名为 `(key, exprFunc, options?)`；
2. 一次性动作返回撤销函数，并挂 `方法.revoke = (e) => e.result()`；
3. 需要随数据重跑的动作挂 `方法.always = true`；
4. 在 `test/statics/` 下新增或扩展对应语法页，页面检查项 + spec 总数同步加。

## 四、测试规则

- 页面在 `test/statics/`，每页用 harness 的 `test()` 注册**中英双语具名
  检查项**，`run()` 渲染结果；spec（`test/xhear.spec.js`）断言每页总数，
  **加检查项必须同步 spec 里的 total**；
- 条件等待用 harness 的 `waitFor`，断言异步刷新的值前必须先等到位
  （watchTick 是防抖异步的，同步断言会读到旧值）；
- 断言子组件内容时记得**穿透 shadow**（`child.shadow.$(...)`），
  `.text` 只读光 DOM；
- 表达式里不要依赖 undefined 值的数据键（stanz 不存储 undefined，
  `with(data)` 会 ReferenceError），可空值用 null 并写空安全表达式。

## 五、运行环境

- 源码为 source-only ESM，`src/*.mjs` 即发布产物，无构建步骤；
- stanz 以相对路径引入（`../../stanz/src/*`），不经 npm；
- `formData` 是可选插件（`src/formdata.mjs`），**不在默认构建里**，
  修改它时单独验证 `combo-form.html` 页面；
- 手动预览：仓库根 `npm run server` 后打开
  `http://localhost:3348/packages/xhear/test/statics/<页面>.html`。
