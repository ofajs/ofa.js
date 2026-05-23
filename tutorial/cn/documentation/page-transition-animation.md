# 页面切换动画

`pageAnime` 配置项用于控制页面切换时的过渡动画效果，提升用户体验。

## 基本配置

在 `app-config.js` 中配置页面切换动画：

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## 动画状态

页面切换动画包含三个状态：

| 状态 | 说明 | 触发时机 |
|------|------|----------|
| `current` | 当前页面动画结束后的样式 | 页面切换完成后 |
| `next` | 新页面进入时的起始样式 | 新页面开始进入时 |
| `previous` | 旧页面离开时的目标样式 | 旧页面开始离开时 |

### 状态详解

**current（当前状态）**
- 页面切换完成后的最终样式
- 通常是页面的正常显示状态
- 例如：`opacity: 1, transform: "translate(0, 0)"`

**next（下一页状态）**
- 新页面进入时的初始样式
- 用于定义新页面从哪里开始进入
- 例如：`opacity: 0, transform: "translate(30px, 0)"` 表示从右侧进入

**previous（上一页状态）**
- 旧页面离开时的目标样式
- 用于定义旧页面要到哪里去
- 例如：`opacity: 0, transform: "translate(-30px, 0)"` 表示向左离开

## 内置动画效果

### 左右滑动（默认）

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

效果说明：
- 新页面从右侧滑入（初始位置在右侧 30px，透明度为 0）
- 旧页面向左滑出（最终位置在左侧 -30px，透明度为 0）
- 最终两个页面都回到正常位置（透明度为 1，位置为 0）

### 淡入淡出

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

效果说明：
- 新页面从透明渐变为可见
- 旧页面从可见渐变为透明
- 适合简洁、优雅的应用风格

### 上下滑动

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

效果说明：
- 新页面从下方滑入
- 旧页面向上方滑出
- 适合垂直滚动风格的应用

### 缩放效果

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

效果说明：
- 新页面从小放大到正常大小
- 旧页面从正常大小放大消失
- 适合卡片式或模态框风格的应用

### 翻转效果

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "rotateY(0deg)",
  },
  next: {
    opacity: 0,
    transform: "rotateY(-90deg)",
  },
  previous: {
    opacity: 0,
    transform: "rotateY(90deg)",
  },
};
```

效果说明：
- 新页面从左侧翻转进入
- 旧页面向右侧翻转离开
- 适合需要3D效果的应用

## 自定义动画

### 组合多个属性

可以组合多个 CSS 属性创建复杂动画：

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  },
  next: {
    opacity: 0,
    transform: "translate(50px, 50px) scale(0.9)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-50px, -50px) scale(1.1)",
  },
};
```

### 使用不同的缓动函数

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## 支持的 CSS 属性

`pageAnime` 支持所有 CSS 可动画属性：

### 常用属性

- `opacity` - 透明度（0-1）
- `transform` - 变换
  - `translate(x, y)` - 位移
  - `scale(n)` - 缩放
  - `rotate(deg)` - 旋转
  - `rotateX/Y(deg)` - 3D旋转
- `width` / `height` - 宽高
- `margin` / `padding` - 外边距/内边距
- `background-color` - 背景色
- `border-radius` - 圆角

### 注意事项

1. **性能优化**：优先使用 `transform` 和 `opacity`，它们性能最好
2. **避免布局抖动**：避免使用会触发布局重排的属性（如 `width`, `height`, `margin`）
3. **过渡时间**：ofa.js 会自动添加过渡效果，默认为 300ms

## 完整示例

<o-playground name="页面切换动画示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    // 页面切换动画配置
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 最佳实践

### 1. 保持动画简洁

避免过于复杂的动画，简洁的动画效果更好：

```javascript
// ✅ 推荐：简洁有效
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ 不推荐：过于复杂
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg) scale(1)",
    borderRadius: "0",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 30px) rotate(45deg) scale(0.5)",
    borderRadius: "50%",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, -30px) rotate(-45deg) scale(1.5)",
    borderRadius: "100%",
  },
};
```

### 2. 考虑用户体验

- 动画时间不宜过长（建议 200-400ms）
- 避免使用让用户眩晕的动画
- 确保动画流畅，不卡顿

### 3. 适配不同设备

在低端设备上，可以考虑禁用或简化动画：

```javascript
// 检测设备性能
const isLowEndDevice = navigator.hardwareConcurrency < 4;

export const pageAnime = isLowEndDevice ? {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
} : {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```
