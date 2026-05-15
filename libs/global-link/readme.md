# global link

A tool that allows all components to share styles.

## How to use it?

Reference the `global-link` component after `ofa.js`, and reference the style file through global-link, so that all components can load the style file.

```html
...
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.22/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.22/libs/global-link/dist/global-link.min.js"></script>
...

<body>
<o-global-link href="./global.css"></o-global-link>
</body>
```

## Notes

The o-global-link tag must be used first for initialization. Only after initialization is completed, the global style will take effect on subsequent components.