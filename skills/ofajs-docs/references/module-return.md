# 模块返回对象属性

> 本文档外链自：[模块返回对象属性](../../../tutorial/cn/api/others/module-return.md)

在 ofa.js 中，无论是页面模块还是组件模块，都需要通过 `export default async () => {}` 返回一个对象来定义模块的配置和行为。

## async 函数参数

`export default async () => {}` 中的 async 函数接收一个参数对象，包含以下属性：

### 参数列表

| 参数 | 类型 | 页面模块 | 组件模块 | 说明 |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | 加载其他模块或资源的函数 |
| `url` | `string` | ✅ | ✅ | 当前页面或组件模块的文件地址 |
| `query` | `object` | ✅ | ❌ | URL 查询参数对象 |

### load 参数

`load` 是一个用于加载其他模块、组件或资源的函数。在组件模块和页面模块中都可以使用。`load` 函数的加载效果与 `<l-m>` 组件一致，主要用于加载 ofa.js 页面或组件的 HTML 文件。

**同步加载**：使用 `await` 关键字，会阻塞执行直到模块加载完成。

```javascript
export default async ({ load }) => {
  const { someModule } = await load("./some-module.js");
  const component = await load("./my-component.html");
  
  return {
    data: {
      moduleData: someModule
    }
  };
};
```

**异步加载**：不使用 `await` 关键字，返回 Promise 对象，不会阻塞执行。适合按需加载的场景。

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('模块加载完成:', someModule);
  });
  
  return {
    data: {}
  };
};
```

### url 参数

`url` 参数在页面模块和组件模块中都可用，表示当前模块的文件地址。

```javascript
export default async ({ url }) => {
  console.log('当前模块地址:', url);
  
  return {
    data: {
      moduleUrl: url
    }
  };
};
```

### query 参数

`query` 参数仅在页面模块中可用，包含 URL 中的查询参数。

```javascript
export default async ({ query }) => {
  console.log('查询参数:', query);
  
  return {
    data: {
      userId: query.id,
      page: query.page || 1
    }
  };
};
```

## 返回属性总览

| 属性 | 类型 | 页面模块 | 组件模块 | 说明 |
|------|------|:-------:|:-------:|------|
| `tag` | `string` | ❌ | ✅ 必须 | 组件标签名 |
| `data` | `object` | ✅ | ✅ | 响应式数据对象 |
| `attrs` | `object` | ❌ | ✅ | 组件属性定义 |
| `proto` | `object` | ✅ | ✅ | 方法和计算属性 |
| `watch` | `object` | ✅ | ✅ | 侦听器 |
| `ready` | `function` | ✅ | ✅ | DOM 创建完成时调用 |
| `attached` | `function` | ✅ | ✅ | 挂载到 DOM 时调用 |
| `detached` | `function` | ✅ | ✅ | 从 DOM 移除时调用 |
| `loaded` | `function` | ✅ | ✅ | 完全加载完成时调用 |
| `routerChange` | `function` | ✅ 父页面 | ❌ | 路由变化时调用 |

> **完整文档请查看**：[模块返回对象属性](../../../tutorial/cn/api/others/module-return.md)
