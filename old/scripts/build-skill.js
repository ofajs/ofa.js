const shell = require("shelljs");
const path = require("path");
const fs = require("fs");

const skillsDir = path.join(__dirname, "..", "skills");
const repoVersion = require("../package.json").version;

function updateSkillVersion(skillDir) {
  const skillPath = path.join(skillsDir, skillDir, "SKILL.md");
  const content = fs.readFileSync(skillPath, "utf8");

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.error(`Error: No frontmatter found in ${skillPath}`);
    return false;
  }

  const frontmatter = match[1];
  const versionMatch = frontmatter.match(/^version:\s*(\S+)/m);
  let newVersion;

  if (versionMatch) {
    const parts = versionMatch[1].split(".");
    const isSameBase =
      parts.length === 4 && parts.slice(0, 3).join(".") === repoVersion;
    newVersion = isSameBase
      ? `${repoVersion}.${Number(parts[3]) + 1}`
      : `${repoVersion}.0`;
  } else {
    newVersion = `${repoVersion}.0`;
  }

  const newFrontmatter = versionMatch
    ? frontmatter.replace(/^version:\s*\S+/m, `version: ${newVersion}`)
    : `${frontmatter}\nversion: ${newVersion}`;

  fs.writeFileSync(
    skillPath,
    content.replace(match[0], `---\n${newFrontmatter}\n---`)
  );
  console.log(`${skillPath} version: ${newVersion}`);
  return true;
}

function createZip(sourceDir, zipName) {
  const sourcePath = path.join(skillsDir, sourceDir);
  const outputPath = path.join(skillsDir, zipName);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source directory ${sourcePath} does not exist`);
    return false;
  }

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log(`Removed existing ${outputPath}`);
  }

  const currentDir = process.cwd();
  process.chdir(skillsDir);

  const result = shell.exec(`zip -r "${outputPath}" ${sourceDir}`, {
    silent: false,
  });

  process.chdir(currentDir);

  if (result.code !== 0) {
    console.error(`Error: Failed to create zip file for ${sourceDir}`);
    return false;
  }

  const stats = fs.statSync(outputPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`Successfully created ${outputPath}`);
  console.log(`File size: ${sizeInMB} MB`);
  return true;
}

if (!updateSkillVersion("ofajs-docs") || !updateSkillVersion("ofajs-docs-en")) {
  process.exit(1);
}

const success1 = createZip("ofajs-docs", "ofajs-docs.zip");
const success2 = createZip("ofajs-docs-en", "ofajs-docs-en.zip");

if (!success1 || !success2) {
  process.exit(1);
}
