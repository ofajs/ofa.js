# Style Queries

`match-var` is a feature component in ofa.js used for style matching based on CSS variables. With `match-var`, you can dynamically match and apply different styles according to the current component's CSS variable values. This feature is specifically designed for style-related context state passing, requires no JavaScript, is more convenient to use, and is suitable for style-propagation needs such as theme colors.

## Core Concepts

- **match-var**: Style matching component, determines whether to apply internal styles based on CSS variable values
- **Attribute matching**: Through component properties, define the CSS variables to match and the expected values
- **Style application**: When matched successfully, the styles inside the `<style>` tag will be applied to the component

## Basic Usage

The `match-var` component defines the CSS variable to match and its expected value through attributes. When the component's CSS variable value matches the specified attribute value, the internally defined styles are applied.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Attributes

`match-var` component uses arbitrary attributes to define matching rules for CSS variables. The attribute name corresponds to the CSS variable name (without the `--` prefix), and the attribute value is the expected match value.

### Working Principle

1. **Browser Support**: If the browser supports `@container style()` queries, it will directly use native CSS capabilities.
2. **Fallback Handling**: If not supported, it will poll to detect changes in CSS variable values and dynamically inject styles upon successful matching.
3. **Manual Refresh**: You can manually trigger style detection via the `$.checkMatch()` method.

## Basic Example

<o-playground name="Basic Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">Switch Theme</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          Display different styles based on CSS variable
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Display light theme
        </theme-box>
        <theme-box style="--theme: dark;">
          Display dark theme
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Multi-Condition Matching

Multiple attributes can be used simultaneously to define more complex matching conditions; styles are applied only when all CSS variables match.

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## Multi-condition Matching Example

<o-playground name="Attribute Matching Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>Theme: {{theme}} <button on:click="changeTheme">Switch Theme</button></div>
      <div>Size: {{size}} <button on:click="changeSize">Switch Size</button></div>
      <div class="content">
        <test-card>
          <div>Multi-condition style matching example</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch manual refresh

In some cases, changes to CSS variables may not be automatically detected. You can then manually call the `$.checkMatch()` method to trigger style detection.

> Currently, Firefox does not support the `@container style()` query, so you need to manually call `$.checkMatch()`; once browsers natively support it in the future, the system will automatically detect variable changes without requiring manual triggering.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Manually trigger style detection
    $.checkMatch();
  }
}
```

## Best Practices

1. **Prioritize native CSS capabilities**: `match-var` will prefer the browser-native `@container style()` query, offering better performance in modern browsers  
2. **Organize styles logically**: Keep related matching styles together for easier maintenance and comprehension  
3. **Use data() binding**: Combine with the `data()` directive to achieve responsive style switching