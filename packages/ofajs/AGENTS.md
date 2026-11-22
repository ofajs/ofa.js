# ofajs 开发规则（AGENTS.md）

本文件是 `packages/ofajs` 的开发规则；包的定位、目录结构、契约与踩坑见
[CONTEXT.md](./CONTEXT.md)。测试与提交的全局纪律见根 [AGENTS.md](../../AGENTS.md)。

## 一、模块依赖方向（不可反转）

```
main → comp/page/app/extend/link/context/match-var/if/fill/inject-host
comp/page/link/if/fill → xhear（render/register/util/public）+ drill（lm/path）
public → drill(path) + xhear
```

ofajs 是消费层：**只通过 xhear/drill 的公开导出工作**，不深入其内部
状态。需要新接缝时先在 xhear 侧显式导出（如 `xtRegistry`），不要绕过。

## 二、渲染管线的协作契约（与 xhear 强耦合处）

- **o-if/o-fill 的内容保护**：编译期 wrapTemp 把条件/列表内容包进
  `template[inner-code]`，使其不参与宿主编译；运行期由 o-if/o-fill
  **按需编译 + 全局缓存**（`compiledContents` Map，键为内容原文），
  并通过 `render({ template })` 走 xhear 快路径。改 wrapTemp 或
  xhear 编译步骤顺序时必须同步验证这两条链路。
- **afterConvert 钩子的时序**：xhear 在构建 `__xt` 描述符**之前**调用
  afterConvert（结构变换必须先于路径构建）。ofa 的 wrapTemp 依赖此
  时序——调整 xhear 编译步骤顺序时不能把它移回描述符之后。
- **动作元数据**（`attr.always` 等）：extend.mjs 包装 attr 时显式复制
  `.always`，包装其他动作时同样必须保留元数据。
- **`__originHTML` 的提取**：o-if/o-fill created 从 inner-code 模板读
  内容原文。标记节点是 `<!--xt:...-->` 注释（innerHTML 序列化可存活），
  不要把标记改回空文本节点（序列化即丢失）。

## 三、组件/页面文件约定（测试 fixtures 同样遵守）

- `<script>` 必须写在 `<template component|page>` **内部**——drawUrl
  只从目标模板内部取脚本，模板外的脚本会被静默丢弃。
- 组件 tag 未声明时由文件名推断（驼峰转 dash-case）；同名 tag 不同
  地址注册抛 `comp_registered`（html 中间件包装后对外为
  `load_comp_module`）。
- 页面继承：页面模块 `export const parent = "./xxx.html"`，app 嵌套路
  由依赖继承链；`routerChange` 钩子只在**嵌套路由的父页**上触发，
  平铺路由用 o-app 的 `router-change` DOM 事件监听。

## 四、测试规则

- 页面在 `test/statics/`，harness 具名检查项（中英双语），spec 断言
  各页总数——**加检查项必须同步 `test/ofajs.spec.js` 的 total**；
- 涉及文件加载的 fixtures 在 `test/statics/fixtures/`（真实文件，体积
  小可提交；与 drill 基准的"生成夹具"不同类）；
- 组件/页面 fixtures 的 script 位置、tag 推断等约定见第三节；
- 断言 consumer/provider 数据用元素数据属性（`ofa(el).color`），不要
  用光 DOM 文本（consumer 的 light children 不参与编译）；
- 条件等待用 `waitFor`；o-app 路由断言注意页面加载是异步链
  （getPagesData → createPage → 渲染），必须等 `appIsReady` 或页面级
  就绪标记。

## 五、运行环境

- 源码为 source-only ESM；xhear/drill/stanz 以相对路径引入；
- 测试：仓库根 `npm test`；手动预览：根 `npm run server` 后打开
  `http://localhost:3348/packages/ofajs/test/statics/<页面>.html`；
- benchmark：未建。o-app 路由链路涉及网络加载，基准意义有限；如需
  建，先读 `.agents/skills/benchmark-methodology` 技能。
