const path = require("path");
const fs = require("fs");

const packs = [
  {
    name: "stanz",
    dirs: ["../stanz/src", "./node_modules/stanz/src"],
  },
  {
    name: "xhear",
    dirs: ["../Xhear/packages/xhear", "./node_modules/xhear/src"],
  },
  {
    name: "drill.js",
    dirs: ["../drill.js/src", "./node_modules/drill.js/src"],
  },
  {
    name: "ofa-error",
    dirs: ["../ofa-errors/ofa-error", "./node_modules/ofa-errors/ofa-error"],
  },
];

const cwd = process.cwd();

packs.forEach(({ name, dirs }) => {
  for (let dir of dirs) {
    const directory = path.join(cwd, dir);
    if (fs.existsSync(directory)) {
      const targetDir = `packages/${name}`;
      if (fs.existsSync(targetDir)) {
        deleteDirectory(targetDir);
      }

      copyDirectory(directory, targetDir);
      break;
    }
  }
});

function deleteDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory ${directory} does not exist.`);
    return;
  }

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      deleteDirectory(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }

  fs.rmdirSync(directory);
}

function copyDirectory(source, destination, callback) {
  if (!fs.existsSync(source)) {
    console.log(`Source directory ${source} does not exist.`);
    return;
  }

  fs.mkdirSync(destination, { recursive: true });

  const files = fs.readdirSync(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destinationPath, callback);
    } else {
      const sourceContent = fs.readFileSync(sourcePath, "utf8");

      const modifiedContent = callback
        ? callback({ content: sourceContent, path: sourcePath })
        : sourceContent;

      fs.writeFileSync(destinationPath, modifiedContent);
    }
  }
}
