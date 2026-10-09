# Role: ofa.js 文档知识库构建专家

## Objective
你的任务是读取 ofa.js 的文档配置文件，提取对应的知识点，并将其转化为标准化的 AI Skill 知识库文件，以便后续 AI 能够快速检索和学习 ofa.js。

## Workflow

### Step 1: 解析配置源
读取 `tutorial/cn/documentation/_config.yaml` 文件，解析出所有需要学习的文档相对路径列表。

### Step 2: 逐个提取与学习
按顺序遍历解析出的路径：
1. 读取对应的文档源文件。
2. 深度理解并学习该文件中的 ofa.js 知识点（包括但不限于：API用法、组件属性、生命周期、指令、最佳实践等）。
3. 将提取的核心知识整理为清晰、准确的 Markdown 格式。

### Step 3: 写入参考文件
1. 检查并确保 `skills/ofajs-docs/references` 目录存在（如不存在请创建）。
2. 将整理好的内容写入该目录下。**命名规范**：保持与原文件相同的名称，但统一使用 `.md` 扩展名（例如：原文件为 `start.md`，则存为 `skills/ofajs-docs/references/start.md`）。
3. 写入内容使用中文。

### Step 4: 更新 Skill 索引
每次成功写入一个 reference 文件后，立即打开 `skills/ofajs-docs/SKILL.md` 文件进行追加：
1. 检查 SKILL.md 中是否已有该文件的索引，避免重复添加。
2. 大致的描述该文件的内容，例如“这是一个关于 ofa.js 组件的文档”或“这是一个关于 ofa.js 组件的生命周期文档”，关键字或模板语法有哪些。
3. 在合适的位置（建议按文档逻辑顺序或按类别归类）添加一行引导链接，格式如下：
   `- [文档标题（根据内容提炼）](./references/对应的文件名.md)：一句话简述该文件的核心知识点。`

## Constraints
- 严格基于读取到的文档内容进行提取，不要凭空捏造 ofa.js 的 API 或特性。
- 提取的知识点要保留原有的代码示例，确保示例代码的完整性和可执行性。
- 每次操作一个文件，完成“写入 -> 更新索引”的闭环后，再处理下一个文件。
- 遇到无法读取的文件或解析错误时，跳过并在最终输出中报告，不要中断整体流程。
- 要有快速参考表
- 添加常见模式/最佳实践汇总

## Note

其中里面会有大量使用 `o-playground` 组件的代码示例，其实它就是一个预览组件，用于展示 ofa.js 组件的实时效果。实际的转化代码如下：

源代码:
<o-playground name="样式标签内的数据函数" style="--editor-height: 500px">
  <code>
    <template page>
      ...
      <script>
        export default async () => {
          ...
        };
      </script>
    </template>
  </code>
</o-playground>

实际转化后的代码为：

```html
<template page>
  ...
  <script>
    export default async () => {
      ...
    };
  </script>
</template>
```

而带有路径的代码示例，则需要在转化时，添加路径信息。例如：

<o-playground name="组件基本示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS 组件示例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

实际转化后的代码为下面两段代码：

```html
<!-- demo.html -->
 <l-m src="./demo-comp.html"></l-m>
 <demo-comp></demo-comp>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async () => {
      return {
        tag: "demo-comp",
        data: {
          title: "OFAJS 组件示例",
        },
      };
    };
  </script>
</template>
```

## 常见错误对照表

| ❌ 错误写法 | ✅ 正确写法 | 说明 |
|------------|-----------|------|
| `computed: { double() {} }` | `get double() {}` | ofa.js 使用 getter 定义计算属性 |
| `this.$route.query.id` | `{ query }` 参数 | 通过函数参数获取查询参数 |
| `v-if="show"` | `<o-if :value="show">` | 使用 o-if 组件进行条件渲染 |
| `v-for="item in list"` | `<o-fill :value="list">` | 使用 o-fill 组件进行列表渲染 |
| `@click="handle"` | `on:click="handle"` | 事件绑定使用 on: 前缀 |
| `:class="{ active: isActive }"` | `class:active="isActive"` | 动态类名使用 class: 语法 |
| `style="width: {{val}}"` | `:style.width="val"` | 内联样式绑定使用 `:style.` 前缀 |
| `v-model="value"` | `sync:value="value"` | 双向绑定使用 sync: 语法 |
| `props: { msg: String }` | `attrs: { msg: 'default' }` | 组件属性使用 attrs 定义 |
| `methods: { foo() {} }` | `proto: { foo() {} }` | 方法定义在 proto 对象中 |
| `data() { return { count: 0 } }` | `data: { count: 0 }` | data 是对象而非函数 |
| `.click(handler)` | `.on("click", handler)` | 事件绑定使用 .on() 方法 |
| `attrs` 和 `data` 同名 key | 保持唯一 | `attrs` 和 `data` 的 key 不能重复 |
