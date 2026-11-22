# wrap

The `wrap` method is used to wrap a layer of elements around the target element. Before performing the `wrap` operation, the initialization of the [$ method](../instance/dollar.md) is automatically executed, so you can directly fill in the specific element string or object.

<o-playground name="wrap - wrap element" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>I am 1</div>
        <div id="target">I am 2</div>
        <div>I am 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Notes

The target element **must have a parent node**, otherwise the wrapping operation will fail.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // Error: no parent element, cannot wrap
$el.$('#target').wrap("<div>new div</div>"); // Correct: has parent element
```

**Please note, do not operate inside template components such as o-fill or o-if.**