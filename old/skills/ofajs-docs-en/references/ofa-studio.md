# OFA Studio

OFA Studio is an online development tool for ofa.js, allowing you to develop ofa.js applications directly in the browser without installing any development environment.

## Accessing OFA Studio

Open the OFA Studio URL in your browser to start using it.

## Main Features

### 1. Project Management

- Create new projects
- Open existing projects
- Save projects to local

### 2. Code Editing

- Syntax highlighting
- Auto-completion
- Error prompts

### 3. Real-Time Preview

- Real-time preview of code changes
- Hot reload support
- Multi-device preview

### 4. Project Structure

```
my-project/
├── index.html          # Entry file
├── app-config.js       # Application configuration
├── pages/              # Page modules
│   ├── home.html
│   └── about.html
└── components/         # Component modules
    ├── header.html
    └── footer.html
```

## Creating a New Project

1. Open OFA Studio
2. Click "New Project"
3. Select a template or start from scratch
4. Choose a local directory to save the project

## Development Workflow

### 1. Create Pages

Create page modules in the `pages/` directory:

```html
<!-- pages/home.html -->
<template page>
  <style>
    :host {
      display: block;
      padding: 20px;
    }
  </style>
  
  <h1>Welcome to My App</h1>
  
  <script>
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

### 2. Create Components

Create reusable components in the `components/` directory:

```html
<!-- components/my-button.html -->
<template component>
  <style>
    :host {
      display: inline-block;
    }
    button {
      padding: 10px 20px;
      background: #007acc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #005a9e;
    }
  </style>
  
  <button on:click="handleClick">
    <slot></slot>
  </button>
  
  <script>
    export default {
      tag: "my-button",
      proto: {
        handleClick() {
          this.emit("click");
        }
      }
    };
  </script>
</template>
```

### 3. Use Components

Import and use components in pages:

```html
<template page>
  <l-m src="../components/my-button.html"></l-m>
  
  <my-button on:click="handleButtonClick">
    Click Me
  </my-button>
  
  <script>
    export default async () => {
      return {
        proto: {
          handleButtonClick() {
            console.log("Button clicked!");
          }
        }
      };
    };
  </script>
</template>
```

## Deployment

### Development Environment

In development environment, you can directly open the `index.html` file or use a local server.

### Production Environment

For production environment deployment, it's recommended to:

1. Compress code files
2. Use CDN to accelerate static resources
3. Configure server caching strategy

## Key Points

- **Browser-Based**: Develop directly in the browser
- **No Installation**: No need to install development environment
- **Real-Time Preview**: Real-time preview of code changes
- **Project Management**: Create, open, and save projects
- **Modular Development**: Pages and components are independent modules
