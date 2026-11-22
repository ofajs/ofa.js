const { readdir, readFile, writeFile } = require("fs/promises");
const { join } = require("path");

const assetsDir = join(
  __dirname,
  "../../skills/ofajs-docs/assets/full-coverage",
);
const targetFile = join(
  __dirname,
  "../../skills/ofajs-docs/references/full-coverage.md",
);

async function main() {
  const files = await readdir(assetsDir);

  const fileContents = [];

  for (const file of files) {
    const filePath = join(assetsDir, file);
    const content = await readFile(filePath, "utf-8");
    fileContents.push(`**${file}**\n\`\`\`html\n${content}\n\`\`\``);
  }

  const newContent = fileContents.join("\n\n");

  const mdContent = await readFile(targetFile, "utf-8");

  const startMarker = "<!-- 源文件内容start -->";
  const endMarker = "<!-- 源文件内容end -->";

  const startIndex = mdContent.indexOf(startMarker);
  const endIndex = mdContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("无法找到标记注释");
  }

  const before = mdContent.substring(0, startIndex + startMarker.length);
  const after = mdContent.substring(endIndex);

  const updatedContent = `${before}\n\n${newContent}\n\n${after}`;

  await writeFile(targetFile, updatedContent, "utf-8");

  console.log("文件内容已成功更新");
}

main().catch(console.error);
