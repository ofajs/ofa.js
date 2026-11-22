# 호스트 스타일 주입

Web Components에서 `slot` 슬롯의 제한으로 인해 슬롯 내 다중 레벨 요소의 스타일을 직접 설정할 수 없습니다. 이 문제를 해결하기 위해 ofa.js는 `<inject-host>` 컴포넌트를 제공하여 컴포넌트 내부에서 호스트 요소로 스타일을 주입할 수 있도록 하여 슬롯 콘텐츠 내 다중 레벨 요소의 스타일 제어를 가능하게 합니다.

> 주의, 가급적 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 선택기를 사용하여 슬롯 콘텐츠의 스타일을 설정하는 것을 권장합니다. 요구 사항을 충족할 수 없는 경우에만 `<inject-host>` 컴포넌트를 사용하십시오.

## 기본 사용법

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 직접 자식 요소의 스타일 설정 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 여러 계층 중첩 스타일도 설정할 수 있습니다 */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## 사례

다음 예시는 `<inject-host>`를 사용하여 슬롯 내에 중첩된 요소의 스타일을 설정하는 방법을 보여줍니다. 두 개의 컴포넌트를 생성합니다: `user-list` 컴포넌트는 목록 컨테이너 역할을 하고, `user-list-item` 컴포넌트는 목록 항목 역할을 합니다. `<inject-host>`를 통해 `user-list` 컴포넌트에서 `user-list-item` 및 그 내부 요소의 스타일을 설정할 수 있습니다.

<o-playground name="호스트 스타일 주입" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>장삼</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">이사</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        나이: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

실행 결과에서 볼 수 있습니다:- `user-list-item` 컴포넌트의 배경색은 aqua입니다 (`user-list` 컴포넌트의 `<inject-host>`를 통해 설정)
- 이름의 텍스트 색상은 빨간색입니다 (`user-list` 컴포넌트의 `<inject-host>`에서 `user-list-item .item-name` 스타일을 설정하여)

## 작동 원리

`<inject-host>` 컴포넌트는 내부에 포함된 `<style>` 태그 내용을 컴포넌트의 호스트 요소에 주입합니다. 이렇게 하면 주입된 스타일 규칙이 컴포넌트 경계를 넘어 slot 슬롯 내의 요소에 적용될 수 있습니다.

이러한 방식을 통해, 당신은:- 슬롯 콘텐츠의 임의 깊이 요소 스타일 설정
- 완전한 선택자 경로를 사용하여 스타일이 대상 요소에만 적용되도록 보장
- 컴포넌트 스타일의 캡슐화를 유지하면서 유연한 스타일 침투 구현

## 주의사항

⚠️ **스타일 오염 위험**：주입된 스타일이 호스트 요소의 스코프에 적용되므로 다른 컴포넌트 내의 요소에 영향을 줄 수 있습니다. 사용 시 다음 원칙을 반드시 준수하십시오:

1. **구체적인 선택자 사용**: 가능한 완전한 컴포넌트 태그 경로를 사용하고, 너무 광범위한 선택자는 피하세요.
2. **네임스페이스 접두사 추가**: 스타일 클래스에 고유한 접두사를 추가하여 다른 컴포넌트와의 충돌 가능성을 줄이세요.
3. **일반 태그 선택자 사용 피하기**: 가능한 클래스명이나 속성 선택자를 사용하여 태그 선택자를 대체하세요.
4. **컴포넌트 설계 재고**: `<inject-host>`를 사용하지 않도록 컴포넌트 설계를 최적화할 수 있는지 고려하세요. 예를 들어, 하위 컴포넌트에서 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 선택자를 함께 사용하는 것이 더 우아할 수 있습니다.

```html
<!-- 권장 ✅: 구체적인 선택자 사용 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 비권장 ❌: 너무 일반적인 선택자 사용 -->
<inject-host>
    <style>
        .content {  /* 다른 구성 요소와 충돌하기 쉬움 */
            color: red;
        }
    </style>
</inject-host>
```

### 성능 팁

`<inject-host>`는 호스트 스타일을 다시 주입하게 되어, 결과적으로 컴포넌트의 리플로우나 리페인트를 유발할 수 있으므로, 빈번하게 업데이트되는 상황에서는 신중하게 사용하십시오.  
슬롯 내 첫 번째 수준 요소에만 스타일을 적용할 경우, [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 의사 클래스 선택자를 우선 사용하면 침투식 주입으로 인한 추가 렌더링 오버헤드를 피할 수 있어 더 나은 성능을 얻을 수 있습니다.