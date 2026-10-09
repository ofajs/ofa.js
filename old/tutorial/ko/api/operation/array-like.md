# 하위 요소 추가 또는 삭제

요소 인스턴스는 배열과 유사한 특성을 가지며, 노드를 추가하거나 삭제할 때 배열의 몇 가지 메서드를 사용하면 됩니다. `push`, `unshift`, `pop`, `shift`, `splice` 메서드를 사용할 때 내부적으로 [$ 메서드](../instance/dollar.md)의 초기화 작업이 자동으로 수행되므로, 구체적인 요소 문자열이나 객체를 직접 입력할 수 있습니다.

마찬가지로, `forEach`, `map`, `some` 등과 같은 다른 배열 메서드를 사용할 수도 있습니다.

**템플릿 구문이 있는 요소에는 하위 요소를 추가하거나 삭제하지 마십시오.**

## push



끝에서 자식 요소를 추가합니다.

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



배열의 시작에 하위 요소를 추가합니다.

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



끝에서 하위 요소를 삭제합니다.

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



배열의 시작 부분에서 하위 요소를 삭제합니다.

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



기존 하위 요소를 삭제하거나 교체할 수 있으며, 새 하위 요소를 추가할 수도 있습니다. 사용 방식은 배열의 `splice` 메서드와 유사합니다.

<o-playground name="array-like - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">new li 1</li>`, `<li style="color:green;">new li 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

