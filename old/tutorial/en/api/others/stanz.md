# Instance Data Features

Instance objects obtained or created through `$` possess complete stanz data characteristics, because `$` instances are inherited from stanz. This means you can utilize the data manipulation methods and features provided by `stanz` to operate on and listen to the data of the instance object.

> The following example uses regular elements, because custom components usually come with pre-registered data, whereas regular elements typically contain only tag information and are therefore more suitable for demonstration.

## watch

Instances can listen for value changes through the `watch` method; even if the value of a sub-object of an object is modified, the change can be detected in the object's `watch` method.

Below is an example showing how to use the `$` instance and the `watch` method:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "I am bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "change bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first create a `$` instance object `target`, and then use the `watch` method to monitor its changes. Even if we modify the value of a sub-object of the object, such as the value of `target.bbb.child.val`, the `watch` method can detect these changes and update the content of the `logger` element. This demonstrates the powerful features of the `$` instance object, allowing you to easily monitor changes in objects.

## watchTick

`watchTick` is similar to the `watch` method in functionality, but `watchTick` has a throttling operation inside, which executes once in a single thread, so in some scenarios with higher performance requirements, it can monitor data changes more effectively.

Below is an example demonstrating how to use the `watchTick` method of the `$` instance:

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch runs: ' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick runs: ' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first create a `$` instance object `target`. Then, we use the `watch` method and the `watchTick` method to listen for changes in the object. The `watch` method runs immediately when the data changes, whereas the `watchTick` method executes once under a single thread, thus limiting the frequency of the listening operation. You can choose to use either the `watch` or the `watchTick` method to listen for data changes according to your needs.

## unwatch

`unwatch` method is used to cancel the monitoring of data, and can revoke the previously registered `watch` or `watchTick` listeners.

Here is an example demonstrating how to use the `unwatch` method of a `$` instance:

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first create a `$` instance object `target`, and then use the `watch` method and the `watchTick` method to register two listeners respectively. After that, we pass the previously saved listener return values `tid1` and `tid2` to the `unwatch` method to revoke these two listeners. This means that the property change in the first `setTimeout` will not trigger any listener, because the listeners have been revoked.

## Values that are not listened to

In the `$` instance, property names starting with an underscore `_` indicate that these values will not be watched by the `watch` or `watchTick` methods. This is useful for temporary or private properties, allowing you to modify them freely without triggering watchers.

Inside the template, this is called [non-reactive data](../../documentation/state-management.md).

Below is an example demonstrating how to use attribute values starting with an underscore to avoid being listened to:

<o-playground name="stanz - Non-reactive data" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

In this example, we create a `$` instance object `target`, and then use the `watch` method to listen for changes to property values. In `setTimeout`, we attempt to change the `_aaa` property value, but this change will not trigger the listener. This is very useful for situations where you need to update property values without triggering a listener.

## Basic Features

Object data set on the instance will be converted into a Stanz instance, and this Stanz instance allows for monitoring.

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

We can also use `$.stanz` to create a Stanz data object that is not bound to an instance.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

These examples demonstrate the basic feature of setting object data as a Stanz instance for monitoring.

For more complete features, please refer to [stanz](https://github.com/ofajs/stanz).