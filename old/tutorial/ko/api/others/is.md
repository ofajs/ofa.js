# is



`is` 메서드는 요소가 표현식과 일치하는지 확인하는 데 사용됩니다.

<o-playground name="is - 요소 감지" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          Is li: ${target.is('li')} <br>
          Is div: ${target.is('div')} <br>
          Have id: ${target.is('[id]')} <br>
          Have class: ${target.is('[class]')} <br>
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

