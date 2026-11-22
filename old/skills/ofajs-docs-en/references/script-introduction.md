# Script Introduction

ofa.js is a frontend framework that can run directly in the browser without any build tools. You only need to import the ofa.js script through a `<script>` tag to start developing.

## Import Method

### CDN Import (Recommended)

Import ofa.js through CDN, this is the simplest and recommended way:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My ofa.js App</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>
  
  <!-- Your application code -->
  <o-page src="./home.html"></o-page>
</body>
</html>
```

### Local Import

You can also download the ofa.js file to your local project and import it:

```html
<script src="./dist/ofa.min.mjs" type="module"></script>
```

## Version Selection

### Latest Version

Use the latest version from the main branch:

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>
```

### Specific Version

Use a specific version of ofa.js:

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@v4.0.0/dist/ofa.min.mjs" type="module"></script>
```

## Import Type

ofa.js uses ES Module format, so you must add `type="module"` attribute:

```html
<!-- ✅ Correct -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>

<!-- ❌ Wrong -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs"></script>
```

## File Types

ofa.js provides two file types:

| File | Description | Use Case |
|------|------|------|
| `ofa.min.mjs` | Compressed version | Production environment |
| `ofa.mjs` | Uncompressed version | Development and debugging |

## Browser Support

ofa.js supports all modern browsers:

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ofa.js Demo</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <!-- Import ofa.js -->
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>
  
  <!-- Load page module -->
  <o-page src="./home.html"></o-page>
</body>
</html>
```

## Key Points

- **CDN Import**: Recommended to use CDN import
- **ES Module**: Must add `type="module"` attribute
- **Version Selection**: Can use latest or specific version
- **File Types**: Choose compressed or uncompressed version as needed
- **Browser Support**: Supports all modern browsers
