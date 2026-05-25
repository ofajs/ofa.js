# global link

A tool that allows all components to share styles.

## How to use it?

Reference the `global-link` component after `ofa.js`, and reference the style file through global-link, so that all components can load the style file.

```html
...
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.7.0/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.7.0/libs/global-link/dist/global-link.min.js"></script>
...

<body>
<o-global-link href="./global.css"></o-global-link>
</body>
```

## Use Cases

⚠️ **Use with caution**: `global-link` pollutes the global style scope, just like global variables. Only use it in these scenarios:

- Legacy project migration
- Private projects
- Messy code / bad projects (temporary workaround)

**Recommendation**: In new projects or controllable projects, prefer component-based style solutions.

**Alternative**: Create a `public.css` file and import it in each of your component modules using `link` tags. This achieves the same effect while avoiding global scope pollution.

## Notes

The o-global-link tag must be used first for initialization. Only after initialization is completed, the global style will take effect on subsequent components.