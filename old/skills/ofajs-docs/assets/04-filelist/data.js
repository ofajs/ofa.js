export const fileData = {
  name: "root",
  type: "dir",
  children: [
    {
      name: "src",
      type: "dir",
      path: "/src",
      children: [
        {
          name: "components",
          type: "dir",
          children: [],
          path: "/src/components",
        },
        {
          name: "utils",
          type: "dir",
          children: [],
          path: "/src/utils",
        },
        {
          name: "index.js",
          type: "file",
          path: "/src/index.js",
          content: "// Main entry point\nconsole.log('Hello World');",
        },
      ],
    },
    {
      name: "docs",
      type: "dir",
      path: "/docs",
      children: [
        {
          name: "README.md",
          type: "file",
          path: "/docs/README.md",
          content: "# Documentation\n\nThis is a sample documentation file.",
        },
        {
          name: "CHANGELOG.md",
          type: "file",
          path: "/docs/CHANGELOG.md",
          content: "# Changelog\n\n## v1.0.0\n- Initial release",
        },
      ],
    },
    {
      name: "config.json",
      type: "file",
      path: "/config.json",
      content: '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
    },
    {
      name: "package.json",
      type: "file",
      path: "/package.json",
      content:
        '{\n  "name": "example-project",\n  "scripts": {\n    "dev": "node dev.js"\n  }\n}',
    },
    {
      name: "README.md",
      type: "file",
      path: "/README.md",
      content: "# My Project\n\nA sample project for ofa.js demo.",
    },
  ],
};

export const getContent = async (path) => {
  const findFile = (items, targetPath) => {
    for (const item of items) {
      if (item.path === targetPath) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const found = findFile(item.children, targetPath);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const file = findFile(fileData.children, path);
  return file?.content || "";
};
