const fs = require("fs");
const args = process.argv.slice(2);
const path = require("path");

// 递归遍历目录
async function traverseDirectory(directoryPath, newVer) {
  const files = await fs.promises.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && !file.startsWith(".")) {
        await traverseDirectory(filePath, newVer);
      }
    } else {
      await processFile(filePath, newVer);
    }
  }
}

// 处理文件内容
async function processFile(filePath, newVer) {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  const reg = new RegExp(`ofa.js@\\d+\.\\d+\.\\d+`, "g");
  if (reg.test(fileContent)) {
    const updatedContent = fileContent.replace(reg, `ofa.js@${newVer}`);

    await fs.promises.writeFile(filePath, updatedContent, "utf-8");

    console.log(`Updated: ${filePath}`);
  }
}

function incrementPackageVersion() {
  // 读取 package.json 文件
  const packageJson = JSON.parse(fs.readFileSync("package.json"));

  // 获取当前版本号和递增后的版本号
  let oldVersion = packageJson.version;
  let newVersion;

  if (args.includes("-m")) {
    newVersion = incrementMiddleVersion(oldVersion);
  } else {
    newVersion = incrementLastVersion(oldVersion);
  }

  traverseDirectory(process.env.PWD, newVersion)
    .then(() => {
      console.log("Finished updating files.");
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  // 将递增后的版本号写回 package.json 文件
  packageJson.version = newVersion;
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

  console.log(
    `Version number has been updated from ${oldVersion} to ${newVersion}`
  );
}

function incrementLastVersion(versionString) {
  const parts = versionString.split(".");
  const lastPartIndex = parts.length - 1;
  parts[lastPartIndex] = String(Number(parts[lastPartIndex]) + 1);
  return parts.join(".");
}

function incrementMiddleVersion(versionString) {
  const parts = versionString.split(".");
  const middlePartIndex = Math.floor(parts.length / 2);
  let newParts = parts.slice(0, middlePartIndex + 1);
  newParts[middlePartIndex] = String(Number(newParts[middlePartIndex]) + 1);
  for (let i = middlePartIndex + 1; i < parts.length; i++) {
    newParts.push("0");
  }
  return newParts.join(".");
}

incrementPackageVersion();
