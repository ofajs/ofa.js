# 스타일 쿼리

`match-var`는 ofa.js에서 CSS 변수를 기반으로 스타일을 매칭하는 기능 컴포넌트입니다. `match-var`를 통해 현재 컴포넌트의 CSS 변수 값에 따라 동적으로 다른 스타일을 매칭하고 적용할 수 있습니다. 이 특성은 스타일과 관련된 컨텍스트 상태 전달에 특화되어 있으며 JavaScript를 사용할 필요가 없어 더욱 편리하게 사용할 수 있으며, 테마 색상 등 스타일 전달 요구사항에 적합합니다.

## 핵심 개념

- **match-var**: 스타일 매칭 컴포넌트, CSS 변수 값에 따라 내부 스타일 적용 여부 결정
- **속성 매칭**: 컴포넌트 속성을 통해 매칭할 CSS 변수와 예상 값 정의
- **스타일 적용**: 매칭 성공 시 내부 `<style>` 태그의 스타일이 컴포넌트에 적용됨

## 기본 사용법

`match-var` 컴포넌트는 속성을 통해 일치시켜야 할 CSS 변수와 기대값을 정의합니다. 컴포넌트의 CSS 변수 값이 지정된 속성 값과 일치할 때, 내부에 정의된 스타일이 적용됩니다.

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

### 속성

`match-var` 컴포넌트는 임의의 속성을 사용하여 CSS 변수의 일치 규칙을 정의합니다. 속성 이름은 CSS 변수 이름( `--` 접두사 제외)에 해당하고, 속성 값은 일치시키려는 값입니다.

### 작동 원리

1. **브라우저 지원**: 브라우저가 `@container style()` 쿼리를 지원하면 CSS 네이티브 기능을 바로 사용합니다.
2. **폴백 처리**: 지원하지 않을 경우 CSS 변수 값 변화를 폴링으로 감지하여, 조건에 맞으면 동적으로 스타일을 주입합니다.
3. **수동 새로고침**: `$.checkMatch()` 메서드로 수동으로 스타일 감지를 트리거할 수 있습니다.

## 기본 예제

<o-playground name="기본 예제" style="--editor-height: 500px">
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
      <button on:click="changeTheme">테마 전환</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          CSS 변수에 따라 다른 스타일 표시
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          밝은 테마 표시
        </theme-box>
        <theme-box style="--theme: dark;">
          어두운 테마 표시
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

## 다중 조건 매칭

여러 속성을 동시에 사용하여 더 복잡한 일치 조건을 정의할 수 있으며, 모든 CSS 변수가 일치할 때만 스타일이 적용됩니다.

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

## 다중 조건 매칭 예제

<o-playground name="속성 매칭 예제" style="--editor-height: 500px">
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
      <div>테마: {{theme}} <button on:click="changeTheme">테마 전환</button></div>
      <div>크기: {{size}} <button on:click="changeSize">크기 전환</button></div>
      <div class="content">
        <test-card>
          <div>다중 조건 스타일 매칭 예제</div>
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

## checkMatch 수동 새로고침

특정 상황에서는 CSS 변수의 변화가 자동으로 감지되지 않을 수 있으며, 이때 수동으로 `$.checkMatch()` 메서드를 호출해 스타일 검사를 트리거할 수 있습니다.

> 현재 Firefox는 `@container style()` 쿼리를 지원하지 않으므로 수동으로 `$.checkMatch()`를 호출해야 합니다. 향후 브라우저가 기본적으로 지원하게 되면 시스템이 자동으로 변수 변경을 감지하므로 수동으로 트리거할 필요가 없습니다.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // 수동으로 스타일 감지 트리거
    $.checkMatch();
  }
}
```

## 모범 사례

1. **CSS 네이티브 기능 우선 사용**: `match-var`는 브라우저 네이티브 `@container style()` 쿼리를 우선 사용하며, 최신 브라우저에서 성능이 더 좋습니다.
2. **스타일 합리적으로 구성**: 관련된 매칭 스타일을 함께 배치하여 유지보수와 이해를 용이하게 합니다.
3. **data() 바인딩 사용**: `data()` 디렉티브와 결합하여 반응형 스타일 전환을 구현할 수 있습니다.