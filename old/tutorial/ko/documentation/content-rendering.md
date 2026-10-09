# 템플릿 렌더링

ofa.js는 강력한 템플릿 렌더링 엔진을 제공하며, 풍부한 템플릿 문법을 포함하여 개발자가 애플리케이션을 빠르게 구축할 수 있도록 도와줍니다. 먼저 가장 많이 사용되는 텍스트 렌더링부터 소개하겠습니다.

## 페이지 데이터 바인딩

ofa.js에서 각 페이지에는 `data` 객체가 있으며, 페이지에서 사용할 변수를 정의할 수 있습니다. 페이지 렌더링이 시작되면 자동으로 `data` 객체의 데이터를 템플릿과 바인딩한 후, 템플릿에서 `{{변수명}}` 구문을 사용하여 해당 변수의 값을 렌더링합니다.

## 텍스트 렌더링

텍스트 렌더링은 가장 기본적인 렌더링 방식이며, 템플릿에서 `{{변수명}}` 구문을 사용하여 `data` 객체에 해당하는 변수의 값을 표시할 수 있습니다.

<o-playground name="텍스트 렌더링 예제" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## HTML 콘텐츠 렌더링

요소에 `:html` 지시문을 추가하면 해당 변수의 HTML 문자열을 구문 분석하여 안전하게 요소 내부에 삽입할 수 있어, 풍부한 텍스트 동적 렌더링이나 외부 HTML 조각의 임베딩을 쉽게 구현할 수 있습니다.

<o-playground name="렌더링 HTML 콘텐츠 예제" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

