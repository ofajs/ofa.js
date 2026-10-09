# 슬롯

슬롯은 컴포넌트에서 외부 콘텐츠를 받기 위한 자리 표시자입니다. 슬롯을 사용하면 재사용 가능한 컴포넌트를 만들면서도, 이를 사용하는 사람이 컴포넌트 내부의 콘텐츠를 자유롭게 지정할 수 있습니다.

## 기본 슬롯

<o-playground name="기본 슬롯 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>슬롯 콘텐츠：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 슬롯 기본 내용

부모 컴포넌트가 슬롯 내용을 제공하지 않을 때, `<slot></slot>` 내부의 요소가 기본 내용으로 표시됩니다.

<o-playground name="슬롯 기본 콘텐츠 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>슬롯 콘텐츠 있음：</h3>
      <demo-comp>
        <div>이것은 사용자 지정 콘텐츠입니다</div>
      </demo-comp>
      <h3>슬롯 콘텐츠 없음 (기본 콘텐츠 표시)：</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>슬롯 콘텐츠：
      <span style="color: red;">
        <slot>
          <div>이것은 기본 콘텐츠입니다</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 명명된 슬롯

컴포넌트가 여러 개의 슬롯 위치를 필요로 할 때, 명명된 슬롯을 사용하여 서로 다른 슬롯을 구분할 수 있습니다. `<slot name="xxx">`를 통해 명명된 슬롯을 정의하고, 사용 시 `slot="xxx"` 속성을 통해 내용이 어떤 슬롯에 들어갈지 지정합니다.

<o-playground name="네임드 슬롯 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Footer Content</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>슬롯 내용:
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 다중 레벨 슬롯 전달

슬롯 내용은 여러 계층의 컴포넌트를 통해 전달될 수 있습니다. 부모 컴포넌트가 자식 컴포넌트에 슬롯 내용을 전달한 후, 자식 컴포넌트는 이를 자신의 자식 컴포넌트로 다시 전달하여 슬롯의 다중 계층 투과 전달을 구현할 수 있습니다.

<o-playground name="다층 레벨 슬롯 전달 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">가장 외부에서 온 제목</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>외부 컴포넌트</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>내부 컴포넌트</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

위의 예시에서:- 가장 바깥쪽 부모 컴포넌트는 `slot="header"`의 내용을 정의합니다.
- 바깥쪽 컴포넌트(outer-comp)가 이 슬롯 내용을 받아 내부 컴포넌트(inner-comp)로 전달합니다.
- 내부 컴포넌트는 최종적으로 가장 바깥쪽의 슬롯 내용을 렌더링합니다.