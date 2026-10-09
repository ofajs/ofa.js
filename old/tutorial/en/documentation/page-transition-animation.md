# Page transition animation

`pageAnime` configuration item is used to control the transition animation effects during page switching, enhancing the user experience.

## Basic Configuration

Configure page transition animation in `app-config.js`:

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

## Animation State

The page switching animation includes three states:

| State | Description | Trigger Timing |
|------|------|----------|
| `current` | The style after the current page's animation ends | When the page switch is complete |
| `next` | The starting style when the new page enters | When the new page starts to enter |
| `previous` | The target style when the old page leaves | When the old page starts to leave |### Status Details

**current（Current Status）**- Final style after page transition completes
- Usually the normal display state of the page
- Example: `opacity: 1, transform: "translate(0, 0)"`

**next (next page state)**- Initial style when a new page enters
- Used to define where a new page starts from when entering
- For example: `opacity: 0, transform: "translate(30px, 0)"` means entering from the right side

**previous (previous page state)**- Target style when the old page leaves
- Used to define where the old page goes to
- Example: `opacity: 0, transform: "translate(-30px, 0)"` indicates leaving to the left

## Built-in Animation Effects

### Left and Right Swipe (Default)

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

Effect Description：- The new page slides in from the right (initial position at 30px on the right, opacity 0)
- The old page slides out to the left (final position at -30px on the left, opacity 0)
- Finally, both pages return to their normal positions (opacity 1, position 0)

### Fade In and Fade Out

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

Effect Description：- The new page gradually changes from transparent to visible.
- The old page gradually changes from visible to transparent.
- Suitable for a simple and elegant application style.

### Swipe Up and Down

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

Effect Description：- New page slides in from the bottom
- Old page slides out upwards
- Suitable for apps with vertical scrolling style

### Zoom Effect

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

Effect Description：- New page scales up from small to normal size
- Old page scales up from normal size and disappears
- Suitable for card-style or modal-style applications

### Flip Effect

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

Effect Description：- New page flips in from the left
- Old page flips out to the right
- Suitable for applications requiring 3D effects

## Custom Animation

### Combining Multiple Attributes

You can combine multiple CSS properties to create complex animations:

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

### Using Different Easing Functions

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

## Supported CSS Properties

`pageAnime` supports all CSS animatable properties:

### Common Attributes

- `opacity` - Transparency (0-1)
- `transform` - Transformation
  - `translate(x, y)` - Translation
  - `scale(n)` - Scaling
  - `rotate(deg)` - Rotation
  - `rotateX/Y(deg)` - 3D Rotation
- `width` / `height` - Width/Height
- `margin` / `padding` - Margin/Padding
- `background-color` - Background Color
- `border-radius` - Border Radius

### Precautions

1. **Performance Optimization**: Prioritize using `transform` and `opacity`, as they offer the best performance
2. **Avoid Layout Thrashing**: Avoid using properties that trigger layout reflow (such as `width`, `height`, `margin`)
3. **Transition Duration**: ofa.js automatically adds transition effects, with a default of 300ms

## Complete Example

<o-playground name="Page Transition Animation Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Application home page URL
    export const home = "./home.html";
    // Page transition animation configuration
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

## Best Practices

### 1. Keep Animations Simple

Avoid overly complex animations, simple animation effects are better:

```javascript
// ✅ Recommended: Concise and effective
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ Not recommended: Overly complex
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

### 2. Consider User Experience

- Animation duration should not be too long (recommended 200-400ms)
- Avoid animations that cause dizziness or disorientation
- Ensure animations are smooth and free from stuttering

### 3. Adapt to Different Devices

On low-end devices, consider disabling or simplifying animations:

```javascript
// Detect device performance
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