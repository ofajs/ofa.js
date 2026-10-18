# plugins（统一插件目录）

## 一、定位

ofa.js 生态的**统一插件目录**：存放"引用才生效"的可选能力。插件不参与
打包、不进 ofa.js 的任何 dist 产物——引入它的文件（经相对导入）才加载
对应能力；不引用则零开销。版本跟随 ofa.js 主包（当前 5.0.0）。

**准入标准**（什么该放这里）：独立于框架核心流程、按需引入的可选增强。
框架核心能力**不放这里**——例如 `xhear/src/form.mjs`（表单元素的响应式
接入，`sync:value`/`sync:checked` 与 watch 表单值全靠它，由元素初始化
路径无条件调用）属于框架本体，拆出去会让所有表单绑定失效。

与 `packages/xhear` 的关系：插件可能消费 xhear/stanz 的内部模块，但不属于
框架本体——**新增可选能力默认放这里，不要放进 xhear/src**（xhear/src 只放
框架本体，凡进 src 的模块未来都会面临"是否进 dist"的纠缠）。

## 二、结构与约定

每插件一个子目录（子包形态，可随复杂度长出多文件与自测页）：

```
packages/plugins/
└── formdata/
    └── formdata.mjs    入口文件名与目录同名
```

- 依赖只用 packages 内部源码的相对导入（本目录下的插件文件位于
  `plugins/<名>/`，到相邻包是上跳两级：`../../stanz/src/...`、
  `../../xhear/src/...`）；
- **不打包、不发 npm**：当前唯一使用场景是 monorepo 内部（相对导入）。
  对外分发（npm 子路径 / CDN）等 v5 发布工程统一定论后再议——插件会 import
  框架内部模块，独立从 CDN 引入会拉起第二份框架实例，与 dist 并存不可行；
- 每个插件必须在入口文件头写明用途与用法，并同步本 CONTEXT 与使用方文档
  （如 `.agents/skills/ofajs-docs-v5`）。

## 三、现有插件

| 插件 | 功能 | 用法 |
|------|------|------|
| `formdata/` | 容器表单值 ↔ stanz 对象双向绑定 | `import { formData } from ".../plugins/formdata/formdata.mjs"` 后 `formData($container, expr?)`；返回与表单双向同步的 stanz 对象，`data.revoke()` 释放。checkbox 聚合数组、select 多选、radio/file 均有处理；自定义表单组件暴露 `value` 属性 + `name` attribute 即可参与收集 |

```javascript
import { formData } from "../../../plugins/formdata/formdata.mjs"; // 按使用文件深度调整

const data = formData(this.shadow);           // 收集容器内全部表单项
const data2 = formData($("#myForm"), ".use-it"); // 只收集带 .use-it 的项

data.username = "Yao"; // 写 → 表单元素自动更新（双向）
data.revoke();         // 卸载时释放两侧监听
```

## 四、历史

`formdata` 原位于 `packages/xhear/src/`（v5 xhear 重构时从核心拆出，用户
明确要求不进默认构建）；2026-10-17 依"插件统一存放、每插件一个子包"的
决策迁入本目录。同日评估过将 `xhear/src/form.mjs` 一并迁出——否决：
form.mjs 是表单元素响应式接入的核心（见"准入标准"），不是插件。
