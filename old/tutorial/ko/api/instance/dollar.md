# $

`$` 메서드는 ofa.js의 핵심 함수로, DOM 요소 인스턴스를 가져오고 조작하는 데 사용됩니다. 아래에서는 `$`의 주요 기능을 자세히 소개합니다:

## 요소 인스턴스 가져오기

`$` 메서드를 사용하면 페이지에서 [CSS 선택자](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list)와 일치하는 첫 번째 요소 인스턴스를 가져와 조작할 수 있습니다. 다음은 예시입니다.

<o-playground name="$ - 요소 가져오기">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

위의 예시에서 우리는 `$` 기호를 사용해 `id`가 "target1"인 요소 인스턴스를 선택하고, `text` 속성을 설정해 그 텍스트 내용을 수정했습니다.

## 자식 요소 인스턴스 찾기

인스턴스도 `$` 메소드를 가지며, 인스턴스의 `$` 메소드를 통해 요소 인스턴스의 첫 번째 조건에 맞는 하위 요소 인스턴스를 가져올 수 있습니다.

<o-playground name="$ - 하위 요소 찾기">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>타겟</h3>
        <p>저는 target1입니다</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = '타겟 제목 변경';
      </script>
    </template>
  </code>
</o-playground>

획득한 요소 인스턴스를 다른 곳에 직접 삽입하지 마십시오. 이러한 작업은 원래 요소에 영향을 미칠 수 있습니다. 복사본이 필요한 경우 [clone](./clone.md) 메서드를 사용할 수 있습니다.

<o-playground name="$ - 인스턴스 특성" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## 그림자 노드 내의 하위 요소 가져오기

[shadow](./shadow.md) 속성으로 인스턴스를 가져온 후, `$` 메서드를 통해 원하는 요소를 가져올 수 있습니다:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## 요소를 직접 인스턴스화

다음과 같은 방법으로 네이티브 요소를 바로 `$` 인스턴스 객체로 초기화할 수 있습니다:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

이렇게 하면 기존 HTML 요소를 `$` 인스턴스로 쉽게 변환하여 `$`가 제공하는 기능을 사용하여 조작하고 처리할 수 있습니다.

## 요소 인스턴스 생성

뿐만 아니라, `$`는 기존 요소 인스턴스를 가져오는 것 외에도 새 요소 인스턴스를 생성하여 페이지에 추가하는 데 사용할 수 있습니다.

### 문자열을 통해 생성

`$` 함수를 사용하여 문자열을 통해 새 요소 인스턴스를 생성할 수 있습니다. 아래와 같습니다:

<o-playground name="$ - 문자열 생성" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">add target 1 text</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `$` 함수를 사용하여 지정된 스타일과 텍스트 내용을 가진 새 요소 인스턴스를 생성하고, `id`가 "target1"인 기존 요소 인스턴스 내에 추가합니다.

### 객체 생성을 통한

`$` 함수를 사용하여 객체 방식으로 새 요소 인스턴스를 생성할 수도 있습니다. 아래와 같습니다:

<o-playground name="$ - 객체 생성" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `$` 함수를 사용하여 객체 방식으로 태그 유형, 텍스트 콘텐츠 및 스타일 속성을 포함한 새 요소 인스턴스를 정의하고, 이를 `id`가 "target1"인 기존 요소 인스턴스 내에 추가합니다.

## 가져온 예시와 페이지/컴포넌트 인스턴스의 관계

`$` 메서드는 전역에서 해당 페이지 또는 컴포넌트 요소의 인스턴스를 가져오는 데 사용할 수 있으며, 그 기능은 페이지 또는 컴포넌트 모듈 내 생명주기 메서드의 `this` 참조와 동일합니다.

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => OFAJS 컴포넌트 예제
  },300);
</script>
```

```html
<!-- test-comp.html -->
 <template component>
  <div>
    <p>{{title}}</p>
  </div>
  <script>
    export default async ({ load }) => {
      return {
        tag: "test-comp",
        data: {
          title: "OFAJS 컴포넌트 예제",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
 </template>
```