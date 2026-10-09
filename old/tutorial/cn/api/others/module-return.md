# 模块返回对象属性

在 ofa.js 中，无论是页面模块还是组件模块，都需要通过 `export default async () => {}` 返回一个对象来定义模块的配置和行为。本文档汇总了返回对象可以包含的所有属性。

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

使用场景：
- 同步加载组件，确保组件在使用前已注册
- 加载共享数据模块
- 加载配置文件
- 异步加载适合按需加载的场景

> 注意：
> - 使用 `await` 同步加载会阻塞执行，建议根据实际需求选择同步或异步方式
> - 如果没有按需加载的需求，建议直接使用 `<l-m>` 标签加载组件

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

`query` 参数仅在页面模块中可用，包含 URL 中的查询参数。通过 `query` 对象可以直接访问 URL 中的查询字符串参数。

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

使用示例：

```html
<template page>
  <style>
    :host { display: block; padding: 20px; }
  </style>
  <div>
    <h1>用户详情</h1>
    <p>用户ID: {{userId}}</p>
    <p>页面: {{page}}</p>
  </div>
  <script>
    export default async ({ query }) => {
      return {
        data: {
          userId: query.id || '未知',
          page: query.page || '1'
        }
      };
    };
  </script>
</template>
```

访问方式：
```html
<o-page src="./user.html?id=123&page=2"></o-page>
```

> 重要：不要使用类似 Vue 的 `this.$route.query` 方式获取查询参数，ofa.js 只支持通过函数参数获取。

### 完整参数示例

```javascript
export default async ({ load, url, query }) => {
  const { config } = await load("./config.js");
  
  return {
    data: {
      configData: config,
      moduleUrl: url,
      queryParams: query
    },
    ready() {
      console.log('模块地址:', url);
      console.log('查询参数:', query);
    }
  };
};
```

## 返回属性总览

| 属性 | 类型 | 页面模块 | 组件模块 | 说明 | 相关文档 |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ 必须 | 组件标签名 | [创建组件](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | 响应式数据对象 | [属性响应](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | 组件属性定义 | [传递特征属性](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | 方法和计算属性 | [计算属性](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | 侦听器 | [侦听器](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | DOM 创建完成时调用 | [生命周期](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | 挂载到 DOM 时调用 | [生命周期](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | 从 DOM 移除时调用 | [生命周期](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | 完全加载完成时调用 | [生命周期](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ 父页面 | ❌ | 路由变化时调用 | [嵌套页面/路由](../../documentation/nested-routes.md) |

> **特殊导出**：`export const parent = "./layout.html"` - 用于嵌套路由，指定父页面路径（不在返回对象中）。详见 [嵌套页面/路由](../../documentation/nested-routes.md)。

## 核心属性

### tag

`tag` 是组件的标签名，**组件模块必须定义此属性**。页面模块不需要定义 `tag`。

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> 注意：`tag` 的值必须与使用组件时的标签名一致。

### data

`data` 是响应式数据对象，用于存储组件或页面的状态数据。数据变化时会自动更新视图。

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "张三",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> 注意：`data` 是对象而非函数，与 Vue 框架不同。

### attrs

`attrs` 用于定义组件属性，接收外部传入的数据。只有组件模块需要定义 `attrs`。

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // 无默认值
      disabled: "",     // 有默认值
      size: "medium"    // 有默认值
    }
  };
};
```

使用组件时传入属性：

```html
<my-component title="标题" disabled size="large"></my-component>
```

> 重要规则：
> - 传递的 attribute 值必须是字符串，如果不是字符串将会被自动转换为字符串
> - 命名转换：`fullName` → `full-name`（kebab-case 格式）
> - `attrs` 和 `data` 的 key 不能重复

### proto

`proto` 用于定义方法和计算属性。计算属性使用 JavaScript 的 `get` 和 `set` 关键字定义。

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // 方法定义
      increment() {
        this.count++;
      },
      
      // 计算属性（getter）
      get doubleCount() {
        return this.count * 2;
      },
      
      // 计算属性
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

> 注意：ofa.js 使用 `get`/`set` 关键字定义计算属性，而非 Vue 的 `computed` 选项。

### watch

`watch` 用于定义侦听器，监听数据变化并执行相应逻辑。

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // 监听单个属性
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // 监听多个属性
      "count,name"() {
        console.log('count 或 name 发生变化');
      }
    }
  };
};
```

侦听器回调函数接收两个参数：
- `newValue`：变化后的新值
- `{ watchers }`：当前组件的所有侦听器对象

## 生命周期钩子

生命周期钩子允许你在组件的不同阶段执行特定逻辑。

### ready

`ready` 钩子在组件准备就绪时调用，此时组件的模板已经渲染完成，DOM 元素已经创建，但可能尚未插入到文档中。

```javascript
ready() {
  console.log('DOM 已创建');
  this.initDomElements();
}
```

### attached

`attached` 钩子在组件被插入到文档中时调用，表示组件已经挂载到页面上。

```javascript
attached() {
  console.log('已挂载到 DOM');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached

`detached` 钩子在组件从文档中移除时调用，表示组件即将被卸载。

```javascript
detached() {
  console.log('已从 DOM 移除');
  clearInterval(this._timer);
}
```

### loaded

`loaded` 钩子在组件及其所有子组件、异步资源全部加载完毕后触发。

```javascript
loaded() {
  console.log('完全加载完成');
}
```

### routerChange

`routerChange` 钩子在路由变化时调用，仅用于父页面监听子页面切换。

```javascript
routerChange() {
  this.refreshActive();
}
```

## 生命周期执行顺序

```
ready → attached → loaded
                 ↓
              detached（移除时）
```

## 特殊导出：parent

`parent` 用于嵌套路由，指定当前页面的父页面路径。这是一个独立的导出，不在返回对象中。

```html
<template page>
  <style>:host { display: block; }</style>
  <div>子页面内容</div>
  <script>
    // 指定父页面
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## 完整示例

### 组件模块

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>计数: {{count}}</p>
    <p>双倍: {{doubleCount}}</p>
    <button on:click="increment">增加</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "默认标题"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count 变化为:', newVal);
          }
        },
        ready() {
          console.log('组件准备就绪');
        },
        attached() {
          console.log('组件已挂载');
        },
        detached() {
          console.log('组件已卸载');
        }
      };
    };
  </script>
</template>
```

### 页面模块

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('页面准备就绪');
        },
        
        attached() {
          console.log('页面已挂载');
          console.log('查询参数:', query);
        },
        
        detached() {
          console.log('页面已卸载');
        }
      };
    };
  </script>
</template>
```

## 常见错误

### 1. attrs 和 data 的 key 重复

```javascript
// ❌ 错误
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // 与 attrs 重复
};

// ✅ 正确
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // 使用不同的 key
};
```

### 2. 使用 Vue 风格定义计算属性

```javascript
// ❌ 错误
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ 正确
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data 定义为函数

```javascript
// ❌ 错误
return {
  data() {
    return { count: 0 };
  }
};

// ✅ 正确
return {
  data: {
    count: 0
  }
};
```

### 4. 方法定义位置错误

```javascript
// ❌ 错误
return {
  methods: {
    handleClick() {}
  }
};

// ✅ 正确
return {
  proto: {
    handleClick() {}
  }
};
```
