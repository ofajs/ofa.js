# replace-temp 컴포넌트

우리가 `select`나 `table` 같은 특수 요소 내에서 목록 렌더링을 시도할 때, 브라우저가 자동으로 `<x-fill>` 컴포넌트를 제거하여 목록 렌더링이 실패할 수 있습니다. 이 경우 `replace-temp` 방식을 사용하여 이 문제를 해결할 수 있습니다.

사용 방법은: `<template>` 태그에 `is="replace-temp"`를 설정하고, 브라우저가 자동으로 수정하는 요소 내부에 배치합니다.

<o-playground name="replace-temp 컴포넌트" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <select>
            <template is="replace-temp">
                <x-fill :value="items">
                    <option>{{$data}}</option>
                </x-fill>
            </template>
        </select>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              items: ["A", "B", "C"],
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

