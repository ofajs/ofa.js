# AI 代理开发指南 (AGENTS.md)

本文件为参与此项目开发的 AI 代理提供核心上下文与开发规范。
在开始任何开发任务前，请务必遵循以下准则。

## 一、项目上下文入口

本项目是 **ofa.js 框架的 monorepo**：框架核心与它的三个基础库（drill 加载器、
stanz 响应式数据、xhear DOM 封装）同仓开发、同源演进。

**如果你是首次接手本项目、或尚未阅读过对应包的代码**，请先阅读对应包的
`CONTEXT.md`（定位、目录结构、API 契约、踩坑都在里面）：

- `packages/drill/CONTEXT.md` —— 浏览器端模块加载器
- `packages/stanz/CONTEXT.md` —— Proxy 驱动的响应式数据
- `packages/xhear/`、`packages/ofajs/` —— 待迁移骨架（暂空）

**目录约定**：

- `packages/<名>/` —— 各库源码 + 各自的 test/ 与 benchmark/，互不依赖运行时
- `old/` —— 旧仓库完整归档，**只读参考，禁止修改或从中直接拷贝代码**
- `scripts/static-server.mjs` —— 测试用的零依赖静态服务器（端口 3348）
- `playwright.config.mjs` —— 根级测试配置，扫描 `packages/*/test/**/*.spec.js`

## 二、CONTEXT.md 同步维护规则

`CONTEXT.md` 是项目知识的**活文档**，必须与代码保持一致：

> 一句话总结：**代码怎么变，`CONTEXT.md` 就怎么改，始终保持一致。**

- **凡是修改了 `packages/<名>/` 下的文件**（新增/删除/重命名文件、改动入口、
  变更 API 契约、调整测试或基准结构等），**必须同步更新该包的 `CONTEXT.md`**。
- **发现错误即纠正**：阅读源码后若发现描述与实际代码不符，即便不是本次引入的，
  也有责任顺手修正。
- **删除模块要同步清理**：删除文件/功能时，`CONTEXT.md` 里的目录树、契约条目、
  行为描述一并移除，不留残影。
- **路径统一用相对路径**（如 `packages/stanz/src/watch.mjs`），
  **禁止绝对路径或带用户名的写法**。
- 仅改动注释、格式等不影响语义的修改，可酌情不更新。
- 目标：让下一个只读 `CONTEXT.md` 的 AI 也能准确理解当前代码的真实状态。

## 三、自动化测试规则

测试双层设计：**自检式测试页**（`packages/*/test/statics/*.html`，人工打开可见
每条用例的通过/失败）+ **playwright spec**（断言页面渲染出的可见结果）。
人和自动化看同一份证据。

- **一条命令跑全量**：`npm test`（chromium/firefox/webkit 三浏览器）。
  **必须在仓库根目录执行**——在包目录里跑会命中该包自己的 test 脚本而加载错配置。
- **全量全绿才算完成。** 未跑全量不算完成；失败必须定位并修复后重跑。
- 新增用例优先做成自检页的检查项（`test()` + `harness.mjs`），再由 spec 断言
  页面汇总；纯函数类可独立 spec。
- **条件等待，禁止 sleep**：用 `waitFor`/`waitForFunction` 轮询条件，
  不要 `setTimeout(300)` 式定时等待。
- 失败三分类，处理不同：**本次改动引入的回归**（必须修）、**历史 flaky**
  （修或注明原因）、**环境问题**（修环境，不是改测试）。
  **禁止用"改断言 / 加 skip / 加固定等待"让测试变绿。**

> **事故案例**：在 `packages/drill` 目录里直接跑 `npm test`，npm 就近命中该包
> 自己的 test 脚本，而那里没有 playwright 配置，报 "Project chromium not
> found"。正确姿势：包内 test 脚本显式写
> `playwright test --config=../../playwright.config.mjs`，日常从根目录跑。

## 四、基准测试规则（性能回归，非功能门禁 —— 用户手动驱动）

- **AI 禁止自动跑基准**：不把 benchmark 作为功能完成的门禁，不主动周期运行。
  只有**用户明确要求**（"跑一下 benchmark""对比新旧性能"）时才运行并解读。
- 涉及性能敏感路径的改动，完成后应**提醒用户**可以跑
  `npm run bench:drill` / `npm run bench:stanz` 验证。
- 命令：`bench:drill` / `bench:stanz` 各测一包，`bench` 依次跑两个。
- 方法学与坑较多，**做基准相关改动前先读技能 `benchmark-methodology`**。

## 五、踩坑知识沉淀规则

任务结束时自检：这次有没有遇到"非显而易见"的问题（调了很久 / 行为与预期不符 /
需要 workaround）？有 → 按下面的决策树写下来：

```
坑跟某个包的行为/契约强相关
  └─→ 该包的 CONTEXT.md「踩坑」节
坑跟业务无关（工具链 / 测试基建 / JIT / 浏览器行为）
  └─→ .agents/skills/<技能名>/SKILL.md
是影响所有任务的全局纪律
  └─→ 根 AGENTS.md
```

**写法必须是「症状 → 根因 → 正确姿势」，可选附排查手法。** 只写"修复了 xxx"
等于没写。已被现有文档覆盖的知识不重复记录。

> **事故案例**：stanz 重构时 `emitUpdate` 改为直接遍历 `_owner`，漏掉了旧版
> owner getter（返回 Set）天然的去重语义——同一子项重复 push 后祖先监听对同一
> 变更收到多次事件。node 冒烟测试当场抓出。教训：**优化热路径时先列出旧代码的
> 隐式语义清单，逐条确认新代码仍满足。**

## 六、项目专属技能

本项目在 `.agents/skills/` 下维护技能文档，处理对应场景时应先查阅：

| 技能 | 触发场景 |
|------|---------|
| `benchmark-methodology` | 新建/修改 benchmark、解读 benchmark 结果、怀疑性能回退时 |

> `ofajs-docs`（框架文档技能，源码在 `old/skills/`）暂未放入 `.agents/skills/`；
> 迁移 xhear/ofajs 时再恢复并在本表登记。

**同步维护**：新增或删除 `.agents/skills/` 下的技能时，必须同步更新上表。

## 七、完成标准（强制）

一个功能/阶段完成的判据是：

1. `npm test` **全量**测试全绿
2. 同步更新了对应包的 `CONTEXT.md`（涉及 API 变化的同步 README）
3. 基准未自动运行；性能敏感改动已提醒用户可跑 bench
4. 与用户确认后才 git commit

**未跑全量不算完成。** 全量失败必须定位并修复后重跑，直到全绿。

## 八、运行环境约定

- 静态服务器：`npm run server` → `http://localhost:3348`（测试页手动预览用）
- 测试：`npm test`（playwright 自动起停 webServer，勿手动抢 3348 端口）
- 基准：`npm run bench:stanz` / `npm run bench:drill`（runner 自管 3349/3350）
- 唯一 devDependency 是 `@playwright/test`；浏览器二进制缺失时报
  "Executable doesn't exist"，用 `npx playwright install <browser>` 安装

## 九、技术选型禁令

为保证可维护性，未经确认**不得**引入：

- **任何运行时依赖**：drill 与 stanz 目前零依赖（drill 连 ofa-error 都已移除），
  错误处理用各包内部的轻量 Error 类
- **打包器 / 构建步骤**：各包是 source-only ESM，`src/*.mjs` 即发布产物；
  浏览器直接加载源码，"看到的文件 = 运行的文件"
- **测试基建新依赖**：静态服务器保持零依赖 `node:http`；不引入 vitest/jest
  等第二测试运行器
- **浏览器全局副作用**：新增代码不得依赖或写入 window 全局做模块间通信

理由：每多一层黑盒（转换、隐式行为、全局耦合），定位问题的能力就弱一分。
stanz 正是靠"零全局副作用"才实现了新旧两版同页 A/B 对比的基准能力。
