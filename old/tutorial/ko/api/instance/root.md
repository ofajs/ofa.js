# root



`root` 속성을 사용하면 요소의 루트 노드를 가져올 수 있습니다.

페이지에서 보통 요소의 루트 노드는 모두 `document` 인스턴스입니다.

<o-playground name="root - 루트 노드" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">I am target</li>
      </ul>
      <div id="logger" style="padding:16px;color:green;"></div>
      <script>
        setTimeout(()=>{
          $('#logger').text = $("#target").root.ele === document;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 섀도우 노드 내의 요소

컴포넌트 내부 요소가 외부 환경과 격리되어 있기 때문에, 섀도우 노드 안의 요소들은 `root` 속성이 섀도우 루트 노드입니다.


<o-playground name="root - 그림자 노드" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-root.html"></l-m>
      <test-root></test-root>
      <script>
        setTimeout(()=>{
          $("test-root").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-root.html" active>
    <template component>
        <ul>
            <li>item 1</li>
            <li id="target">item 2</li>
            <li>item 3</li>
        </ul>
        <h3>logger1:</h3>
        <div id="logger1" style="color:red;">{{l1}}</div>
        <h3>logger2:</h3>
        <div id="logger2" style="color:green;">{{l2}}</div>
        <script>
            export default {
                tag:"test-root",
                data:{
                    l1:"",
                    l2:""
                },
                ready(){
                    this.l1 = this.shadow.$("#target").root === this.shadow;
                    this.l2 = this.root.ele === document;
                }
            };
        </script>
    </template>
  </code>
</o-playground>

