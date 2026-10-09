# shadow

Using the `shadow` property, you can obtain the shadow root instance of an element.

<o-playground name="shadow - shadow node" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

It is important to note that direct modification of elements within shadow nodes should be avoided in elements with template syntax to ensure consistency and maintainability of operations.

## Getting Element Instances Inside the Shadow Root of a Component from the Outside

You can also obtain a custom element instance from the outside, and then access elements within the shadow node through the `shadow` property, as shown below:

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - external access" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

