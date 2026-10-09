# 비명시적 컴포넌트

ofa.js에는 두 가지 비명시적 컴포넌트가 내장되어 있습니다:

* 조건부 렌더링 컴포넌트：`x-if`、`x-else-if`、`x-else`
* 채우기 컴포넌트：`x-fill`

이 두 컴포넌트의 기능은 각각 `o-if` 및 `o-fill` 컴포넌트와 동일하지만, 실제로 DOM에 렌더링되지 않고 내부 요소를 직접 해당 영역에 렌더링합니다.

예를 들어:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 스타일이 빨간색이 아닌 이유는 o-if 컴포넌트 자체가 DOM에 존재하기 때문입니다 -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- 스타일이 빨간색인 이유는 x-if 컴포넌트가 DOM에 렌더링되지 않기 때문입니다 -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="명시적이지 않은 컴포넌트" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* 자식 레벨의 .item 요소를 빨간색으로 선택합니다 */
            color:red;
        }
        /* o-if 컴포넌트 내부의 .item 요소를 선택해야 합니다 */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- o-if 컴포넌트 자체가 DOM에 존재하기 때문에 빨간색으로 표시되지 않습니다 -->
                <div class="item">빨간색으로 표시되지 않습니다</div>
            </o-if>
            <x-if :value="true">
                <!-- x-if 컴포넌트가 DOM에 렌더링되지 않기 때문에 빨간색으로 표시됩니다 -->
                <div class="item">빨간색으로 표시됩니다</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if 조건부 렌더링 컴포넌트

`x-if`는 [o-if](./conditional-rendering.md)와 기능이 완전히 동일하며, 조건식의 참/거짓 값에 따라 콘텐츠를 렌더링할지 여부를 결정하는 데 사용됩니다. 차이점은 `x-if` 자체는 DOM 요소로 존재하지 않으며, 그 내부 콘텐츠가 부모 컨테이너에 직접 렌더링된다는 점입니다.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>환영합니다, 사용자님!</p>
    </x-if>
</div>
```

`x-if`는 `x-else-if` 및 `x-else`와 함께 사용할 수도 있습니다:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>관리자 패널</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>사용자 센터</p>
    </x-else-if>
    <x-else>
        <p>로그인하세요</p>
    </x-else>
</div>
```

## x-fill 채우기 컴포넌트

`x-fill`은 [o-fill](./list-rendering.md)과 기능이 완전히 동일하며, 배열 데이터를 여러 DOM 요소로 렌더링하는 데 사용됩니다. `x-if`와 유사하게 `x-fill` 자체는 DOM에 렌더링되지 않으며, 내부 템플릿이 부모 컨테이너에 직접 렌더링됩니다.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

명명된 템플릿 사용 예:

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## 성능 설명

기능상의 차이 외에도, 비명시적 컴포넌트의 렌더링 성능은 명시적 컴포넌트(`o-if`, `o-fill`)보다 **훨씬 떨어집니다**. 이는 비명시적 컴포넌트가 실제로 DOM에 렌더링되지 않으며, 내부 요소의 위치 지정 및 업데이트를 처리하기 위해 추가적인 시뮬레이션 렌더링 로직이 필요하기 때문입니다.

또한, 비명시적 컴포넌트는 눈에 띄지 않는 버그를 유발할 수 있습니다: 실제로 DOM에 들어가지 않기 때문에 DOM 구조에 의존하는 작업(예: 이벤트 바인딩, 스타일 계산 또는 서드파티 라이브러리 조회)이 실패하거나 예상치 못한 동작을 보일 수 있습니다.

따라서 **명시적 컴포넌트**(`o-if`, `o-else-if`, `o-else`, `o-fill`)를 **우선적으로 사용**하고, 특정 시나리오에서만 비명시적 컴포넌트를 사용할 것을 권장합니다.

## 사용 시나리오

비록 비명시적 구성 요소의 성능은 떨어지지만, 다음과 같은 시나리오에서 사용될 수 있습니다:

1. **추가적인 DOM 계층 구조를 피할 때**: `o-if` 또는 `o-fill` 요소가 DOM 구조의 일부가 되는 것을 원하지 않을 때
2. **스타일 상속**: 내부 요소가 중간 컴포넌트 요소의 영향을 받지 않고 부모 컨테이너의 스타일을 직접 상속받도록 해야 할 때
3. **CSS 선택자 제한**: 부모 직계 자식 선택자(예: `.container > .item`)를 사용하여 스타일을 정밀하게 제어해야 하지만 중간에 추가적인 포장 요소가 없어야 할 때