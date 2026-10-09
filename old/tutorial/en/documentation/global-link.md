# global-link component

`global-link` is a utility component that allows all components to share styles.

## Basic Usage

After referencing the `global-link` component after `ofa.js`, you can reference a style file via `global-link` to let all components load that style file.

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>global-link Example</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## Applicable Scenarios

⚠️ **Warning**: `global-link` pollutes the global style scope, just like global variables.

**Never use this component in new projects!** If you use `global-link` in a new project, it indicates a problem with your project architecture design, and it is a sign of a garbage project.

Only use in the following scenarios:

- Legacy project migration (temporary solution)
- Shit mountain code, garbage project (temporary firefighting)

## Alternatives

You can create a `public.css` file and then import it in each of your component modules separately (using the `link` tag). This way, you can achieve the effect you want while avoiding polluting the global styles.

```html
<!-- In the component module -->
<link rel="stylesheet" href="./public.css">
```

## Notes

You must first use the `o-global-link` tag for initialization; only after initialization is complete will subsequent components take effect with the global styles.