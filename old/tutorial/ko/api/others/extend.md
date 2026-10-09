# extend



`extend`는 인스턴스의 속성이나 메서드를 확장하기 위한 고급 메서드입니다.

> 일반적으로 사용자가 인스턴스의 속성이나 메서드를 확장하는 것은 학습 비용이 증가하기 때문에 권장되지 않습니다. 팀 내에 인스턴스의 동작을 사용자 정의해야 하는 특별한 상황이 없는 한 이러한 방식은 권장되지 않습니다.

<o-playground name="extend - 확장 인스턴스" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 확장 $ 하위 계층

jQuery와 유사하게, fn.extend를 통해 기본 인스턴스의 속성이나 메서드를 확장할 수 있습니다; fn에서 확장된 속성이나 메서드는 모든 인스턴스에 적용됩니다.

<o-playground name="extend - 확장 하부" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 확장 템플릿 문법

`extend`를 통해 속성이나 함수를 확장하면 템플릿 문법의 기능을 추가할 수 있으며, 심지어 컴포넌트에 전용 템플릿 문법 설탕(sugar)을 제공할 수도 있습니다. 하지만 주의할 점은 **공식적이지 않은** 템플릿 문법은 사용하지 않는 것이 좋습니다. 이러한 문법은 사용자에게 학습 비용을 추가로 발생시키고, 비공식 템플릿 문법 설탕이 많아지면 개발 경험이 저하될 수 있기 때문입니다.

### 확장 속성

확장 속성을 사용하여 템플릿에서 `:`을 통해 설정할 수 있습니다. 이제 `red` 속성을 확장하여 `red`가 `true`일 때 글꼴 색상이 빨간색으로 변경됩니다:

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - 확장 속성" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 템플릿 구문에 `red` 속성을 추가했습니다. `count % 3`이 0이 아닐 때 글꼴 색상이 빨간색으로 변경됩니다.

### 확장 메서드

`extend` 확장 메서드를 통해 템플릿 구문에서 사용할 수 있습니다. 메서드 이름은 콜론 앞 부분입니다. 여기서는 `color` 템플릿 구문을 확장했으며, 뒤에 오는 매개변수는 정의된 확장 메서드로 전달됩니다.

여기에 `always` 속성을 `true`로 설정하면, 컴포넌트가 화면을 새로고침해야 할 때마다 이 정의된 메서드가 호출됩니다. `always`를 설정하지 않으면 이 템플릿 구문 함수는 한 번만 실행됩니다.

여기서, `options`는 더 많은 매개변수를 제공하여 보다 맞춤형 템플릿 구문을 개발하는 데 도움을 줍니다:

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - 확장 메서드" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Add Count</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## 템플릿 문법 원리

지금까지, 당신은 이미 이해할 수 있을 것입니다. ofa.js의 많은 템플릿 문법은 실제로 `extend`를 통해 확장된 것입니다:

- `class`、`attr` 메서드는 뷰가 새로고침될 때마다 실행됩니다.
- `on`、`one` 같은 함수 바인딩은 한 번만 실행됩니다.

아래 예시를 통해 ofa.js의 템플릿 렌더링 원리를 더 잘 이해할 수 있습니다:

<o-playground name="extend - 템플릿 구문 원리" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

