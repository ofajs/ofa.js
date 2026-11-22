# Child Elements

Getting sub-element instances is very simple; you just need to treat the instance as an array and access its sub-element instances via numeric indexing.

<o-playground name="children" style="--editor-height: 380px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="color:red;"></div>
      <div id="logger2" style="color:blue;"></div>
      <script>
        setTimeout(()=>{
          $("#logger1").text = $('ul').length;
          $("#logger2").text = $('ul')[1].text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## length

Get the number of child elements of the target element, as shown in the example above:

```javascript
$("#logger1").text = $('ul').length;
```