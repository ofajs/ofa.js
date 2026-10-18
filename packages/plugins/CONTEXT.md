# plugins（统一插件目录）

## 一、一句话定位

ofa.js 生态的**统一插件目录**：存放"引用才生效"的可选能力。插件以子包
形式存在（自带 package.json / README / test / dist），不进 ofa.js 默认
构建；挂接页面已加载的全局 `$`（与 dist ofa.js 同实例），引用才加载。

## 二、准入标准（什么该放这里）

独立于框架核心流程、按需引入的可选增强。框架核心能力**不放这里**——例如
`xhear/src/form.mjs`（表单元素的响应式接入，`sync:value`/`sync:checked`
与 watch 表单值全靠它，由元素初始化路径无条件调用）属于框架本体，拆出去
会让所有表单绑定失效。

## 三、结构与约定

```
packages/plugins/
├── CONTEXT.md             本文件
├── formdata/              每插件一个子包
│   ├── package.json       name: ofa-formdata（版本跟随 ofa.js 主包）
│   ├── README.md          用法与引入方式
│   ├── formdata.mjs       入口（挂全局 $，无框架源码导入）
│   ├── dist/              rollup 产物（ES + UMD + min，根 npm run build 生成）
│   └── test/              statics 冒烟页（源码形态 + dist 形态）+ spec
├── inject-host/           同构子包（ofa-inject-host）
│   ├── package.json / README.md / inject-host.mjs / dist/ / test/
│   └── shadow 内 link/style 收编到宿主根（::slotted 之外的深层样式穿透）
├── body-ghost/            同构子包（ofa-body-ghost）
│   └── 模板内容传送到 body 末尾渲染，事件仍沿原位置冒泡（弹窗/浮层）
└── global-link/           同构子包（ofa-global-link）
    └── <o-global-link href> 把一份样式表注入所有组件 shadow（⚠️ 污染全局，谨慎使用）
```

- 依赖只用 packages 内部源码的相对导入（子包文件位于 `plugins/<名>/`，
  到相邻包是上跳两级：`../../stanz/src/...`、`../../xhear/src/...`）；
- **插件挂接全局 `$`（桥接原则，同 router/scsr）**：不 import 框架源码，
  否则独立引入会拉起第二份框架实例与页面分裂；
- 插件子包**不在根 workspaces 内**（`packages/*` 只匹配到 plugins 层），
  package.json 目前仅作元数据与构建 banner 来源，发布待 v5 发布工程定论；
- dist 由根 `npm run build`（rollup）生成，不手改；
- 新增插件必须带 README + test（冒烟页 + spec），并同步本 CONTEXT 与
  使用方文档（如 `.agents/skills/ofajs-docs-v5`）。

## 四、现有插件

| 插件 | 功能 | 文档 |
|------|------|------|
| `formdata/` | 容器表单值 ↔ stanz 对象双向绑定（`formData($container, expr?)`，`revoke()` 释放） | [formdata/README.md](./formdata/README.md) |
| `inject-host/` | shadow 内 link/style 收编到宿主根（slot 深层样式穿透；hash 去重、移除回收） | [inject-host/README.md](./inject-host/README.md) |
| `body-ghost/` | 模板内容传送到 body 末尾渲染，事件沿原位置冒泡 | [body-ghost/README.md](./body-ghost/README.md) |
| `global-link/` | `<o-global-link href>` 把一份样式表注入所有组件 shadow（⚠️ 污染全局，谨慎使用） | [global-link/README.md](./global-link/README.md) |

## 五、历史

formdata 原位于 `packages/xhear/src/`（v5 xhear 重构时从核心拆出，用户
明确要求不进默认构建）；2026-10-17 迁入本目录；2026-10-18 依"每插件一个
子包"的决策重排，并重写为挂全局 `$` 的桥接形态（从此 dist/CDN 可用），
补齐 package.json / README / test / dist。inject-host 原位于
`packages/ofajs/src/`，同日以同样方式迁入（纯叶子能力，框架零依赖）。
body-ghost 与 global-link 同日自 `old/libs/` 迁入（old/ 归档保持只读，
源码本就是全局 `$` 写法，属零重写搬运；global-link 补了 afterAttached
共享单槽的链式调用）。
