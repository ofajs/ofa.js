# PATH

The `PATH` property is typically used on custom components or page components to obtain the file path where the component is registered. During development, this helps you understand the origin of the component, especially when you need to reference or load other resource files, as you can use the `PATH` property to construct file paths.

Here is a simple example demonstrating how to use the `PATH` attribute in a custom component:

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

In this example, we selected a `my-comp` element with an `id` of "myCustomComponent", and then obtained the file path of this custom component through the `PATH` attribute. You can use the `componentPath` variable in the script section as needed, for example, to construct paths for other resource files or perform other operations.