# ofa-formdata（formData 插件）

ofa.js 的可选插件：把一个容器内全部表单项的值与一个 **stanz 对象双向绑定**
——表单变化实时汇入对象，对象变化实时回填表单。引用才生效，不进 ofa.js
默认构建。

## 引入方式

| 场景 | 方式 |
|------|------|
| dist 经典脚本（配 dist ofa.js） | `<script src="dist/ofa.min.js"></script>` `<script src="dist/formdata.min.js"></script>`（全局 `ofaFormData.formData`） |
| dist ESM | `import { formData } from ".../packages/plugins/formdata/dist/formdata.min.mjs"` |
| monorepo / npm 源码 | `import { formData } from ".../plugins/formdata/formdata.mjs"` |

> 必须在 ofa.js 之后加载：插件挂接页面已加载的全局 `$`（`$.stanz` 与页面
> 框架是同一实例），缺失时直接抛错提示。

## 用法

```html
<template component>
  <input type="text" name="username" />
  <input type="checkbox" name="agree" />
  <script>
    export default {
      attached() {
        // 收集 shadow 内全部表单项（默认 input,select,textarea）
        this.fdata = formData(this.shadow);
      },
      detached() {
        this.fdata.revoke();   // 卸载时释放两侧监听
      },
    };
  </script>
</template>
```

```javascript
const data = formData($container, "input,select,textarea"); // 自定义选择器
const data2 = formData($("#myForm"), ".use-it", { wait: 500 }); // 收集防抖

data.username;          // 读
data.username = "Yao";  // 写 → 表单元素自动更新（双向）
data.revoke();          // 释放
```

- 表单项须设置 `name` attribute；checkbox 聚合成数组、select 多选、
  radio/file 均有处理
- **自定义表单组件**：暴露 `value` 属性 + 设置 `name` attribute 即可参与
  收集与回填
- 容器内 `o-if` 显隐 / `o-fill` 项增删时，键会自动跟随增减

## API

```javascript
formData(el, expr?, opts?)
// el    容器的 $ 实例（组件 this、this.shadow、$("#myForm") 均可）
// expr  表单项选择器，默认 "input,select,textarea"
// opts  { wait?: number } 收集防抖间隔，默认 200ms
// 返回  与表单双向同步的 stanz 对象；.revoke() 释放
```

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/` 下含源码形态与 dist 形态两条冒烟页。
