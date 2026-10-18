# 状态管理

## 组件内部状态

组件/页面模块的 `data` 就是组件自身状态，只能在当前组件上使用：

```javascript
export default async () => ({
  data: {
    count: 0,
    user: { name: "张三" },   // 深度响应式
    items: [],
  },
});
```

data 是对象而非函数；嵌套对象/数组的变化同样触发更新。

## 跨组件共享状态（$.stanz）

多个组件/页面共享一份数据（用户信息、购物车、全局配置）时，用
`$.stanz()` 创建响应式状态对象：

```javascript
// data.js
export const contacts = $.stanz({
  list: [{ id: 1, name: "皮特" }],
});

export const globalStore = $.stanz({ user: null, theme: "light" });
```

```html
<template page>
  <o-fill :value="list">
    <li>{{$data.name}}</li>
  </o-fill>
  <script>
    export default async ({ load }) => {
      const { contacts } = await load("./data.js");
      return {
        data: { list: [] },
        attached() {
          this.list = contacts.list;   // attached 阶段挂载共享状态
        },
        detached() {
          this.list = [];              // 销毁时清空引用，防止内存泄漏
        },
      };
    };
  </script>
</template>
```

- `$.stanz()` 返回深度响应式代理：嵌套对象赋值、数组 push/splice 都会
  触发所有引用方更新
- **约定**：attached 阶段把状态（或其字段）挂到自身 data，detached 阶段
  置空清理
- 模块级状态：在模块作用域 `const cartStore = $.stanz({ total: 0 })`，
  组件内同样按 attached/detached 约定挂载/清理
- `_` 开头的属性不走响应式（系统内部字段约定）

## 上下文状态（o-provider / o-consumer）

跨层级传递无需逐层 props：provider 按属性下发数据，consumer 按 name 就近消费。

```html
<!-- 提供者：name 标识，其余非保留属性都作为共享数据 -->
<o-provider name="userInfo" user-id="9527" user-name="张三">
  <o-page src="./page.html"></o-page>
</o-provider>
```

```html
<!-- 消费者：watch:属性名="本组件 data 字段" 接收并保持同步 -->
<template page>
  <div>用户ID: {{userId}}</div>
  <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
  <script>
    export default {
      data: { userId: 0 },   // 必须先声明字段
    };
  </script>
</template>
```

- consumer 消费**最近的上级**同 name provider；多个同名 provider 时近端优先
- provider 的 attribute 只在**初始化时读一次**；运行时更新必须写数据
  （`provider.userId = 2`），setAttribute 不触发广播
- provider 必须是 consumer 的**祖先**（沿 composedPath 向上查找），兄弟
  节点找不到
- 移除 provider 后 consumer 自动清空数据

### o-root-provider（全局根提供者）

```html
<!-- 文档级全局作用域，无父级 provider 时兜底 -->
<o-root-provider name="globalConfig" custom-theme="dark"></o-root-provider>
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

同 name 的 provider 与 root-provider 并存时，离 consumer 近的 provider 优先。

### getProvider / dispatch

```javascript
// 实例方法：沿 DOM 向上找最近的 provider（找不到则回 root-provider）
const provider = this.getProvider("userInfo");
provider.customName = "李四";          // 直接改数据，consumer 自动更新

// 任意元素上也可用
$(".my-element").getProvider("userInfo");

// 全局 root-provider
const globalProvider = $.getRootProvider("globalConfig");

// provider 向所有 consumer 派发事件
$("#myProvider").dispatch("new-message", { data: { text: "hi" } });
```

```html
<!-- consumer 上直接监听 dispatch 的事件 -->
<o-consumer name="chat" on:new-message="addMessage"></o-consumer>
```

## 选型

| 场景 | 方案 |
|------|------|
| 组件内部 | `data` |
| 父子直连 | `:prop` / `sync:` 双向 |
| 跨层级（业务数据） | o-provider / o-consumer |
| 跨层级（纯样式，如主题） | match-var（CSS 变量，见 modules.md） |
| 跨页面/全局 | `$.stanz()` 共享模块 |
