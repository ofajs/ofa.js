# 속성 응답

앞서 [속성 바인딩](./property-binding.md)에서는 간단한 속성 반응 메커니즘, 즉 컴포넌트의 속성 값을 텍스트로 렌더링하는 방법을 소개했습니다.

ofa.js는 기본 속성 값에 대한 반응형 지원뿐만 아니라 다층 중첩 객체 내부 속성 값에 대한 반응형 렌더링도 지원합니다.

<o-playground name="비반응형 데이터 예제" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">증가</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

ofa.js 인스턴스 객체에 바인딩된 모든 데이터는 자동으로 반응형 데이터로 변환됩니다. 반응형 데이터는 문자열, 숫자, 불리언, 배열, 객체 등 기본 데이터 유형만 지원합니다. 함수, 클래스 인스턴스와 같은 복잡한 데이터 유형은 **비반응형 속성**으로 저장해야 하며, 이러한 속성의 변경은 컴포넌트의 재렌더링을 트리거하지 않습니다.

## 비반응형 데이터

때로는 반응형 업데이트가 필요 없는 데이터를 저장해야 할 때가 있습니다. 예를 들어 Promise 인스턴스, 정규 표현식 객체 또는 기타 복잡한 객체 등입니다. 이때는 비반응형 속성을 사용해야 합니다. 이러한 속성의 변경은 컴포넌트의 재렌더링을 트리거하지 않으며, 뷰와 연동할 필요 없는 데이터를 저장하는 데 적합합니다.

비반응형 속성의 명명은 일반적으로 속성 이름 앞에 밑줄 `_`을 접두사로 추가하여 반응형 속성과 구분합니다.

<o-playground name="비반응형 데이터 예시" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">파란색 증가</button>
      <button on:click="_count2++">초록색 증가</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

`Green increments` 버튼을 클릭할 때, `_count2`의 값은 실제로 증가했지만, 이는 반응형 속성이 아니므로 뷰 업데이트를 트리거하지 않습니다. 따라서 화면의 표시는 변경되지 않습니다. `Blue increases` 버튼을 클릭할 때, `count`는 반응형 속성이므로 전체 컴포넌트의 재렌더링을 트리거하며, 이때 Green의 표시 내용도 동기적으로 업데이트됩니다.

비반응형 객체 데이터는 반응형 객체 데이터보다 성능이 더 좋습니다. 비반응형 데이터는 컴포넌트의 재렌더링을 유발하지 않기 때문입니다.


