#!/usr/bin/env node
/**
 * 把 .agents/skills/ofajs-docs 打包成可分发的 zip。
 *
 * 默认输出：.agents/skills/ofajs-docs.zip
 *
 * zip 顶层包含 ofajs-docs/ 目录，符合 Claude Skills 的
 * “<skill-name>/SKILL.md” 上传格式；本地安装时直接解压到 .agents/skills：
 *
 *   unzip .agents/skills/ofajs-docs.zip -d .agents/skills
 *
 * 有些 agent 要求 SKILL.md 直接位于 zip 根目录，可加 --flat：
 *
 *   node scripts/build-skill.mjs --flat
 *   # → .agents/skills/ofajs-docs-flat.zip
 *
 * 使用 Node 内置模块手写 ZIP，不引入 zip/压缩依赖。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillName = "ofajs-docs";
const skillDir = path.join(root, ".agents", "skills", skillName);
const outputDir = path.join(root, ".agents", "skills");
const flat = process.argv.includes("--flat");
const outputFile = path.join(
  outputDir,
  flat ? `${skillName}-flat.zip` : `${skillName}.zip`,
);

if (!fs.existsSync(path.join(skillDir, "SKILL.md"))) {
  console.error(`[build:skill] 找不到 ${path.relative(root, skillDir)}/SKILL.md`);
  process.exit(1);
}

const skillSource = fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8");
const frontmatter = skillSource.match(/^---\n([\s\S]*?)\n---/);
const declaredName = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1].trim();

if (declaredName !== skillName) {
  console.error(
    `[build:skill] SKILL.md 的 name 必须是 "${skillName}"，实际为 "${declaredName || "(missing)"}"`,
  );
  process.exit(1);
}

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i += 1) {
  let value = i;
  for (let j = 0; j < 8; j += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  CRC_TABLE[i] = value >>> 0;
}

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const collectFiles = (dir, prefix = "") =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const relative = path.posix.join(prefix, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(path.join(dir, entry.name), relative);
      }
      if (!entry.isFile() || entry.name === ".DS_Store") return [];
      return [{ absolute: path.join(dir, entry.name), relative }];
    })
    .sort((a, b) => a.relative.localeCompare(b.relative));

const files = collectFiles(skillDir);
const archivePrefix = flat ? "" : `${skillName}/`;
const localParts = [];
const centralParts = [];
let offset = 0;

// 固定为 1980-01-01 00:00，保证重复打包得到相同字节。
const dosTime = 0;
const dosDate = 0x21;

for (const file of files) {
  const name = Buffer.from(archivePrefix + file.relative, "utf8");
  const raw = fs.readFileSync(file.absolute);
  const crc = crc32(raw);
  const deflated = zlib.deflateRawSync(raw, { level: 9 });
  const useDeflate = deflated.length < raw.length;
  const method = useDeflate ? 8 : 0;
  const payload = useDeflate ? deflated : raw;

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 文件名
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(dosTime, 10);
  local.writeUInt16LE(dosDate, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(payload.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);
  localParts.push(local, name, payload);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(dosTime, 12);
  central.writeUInt16LE(dosDate, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(payload.length, 20);
  central.writeUInt32LE(raw.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt16LE(0, 30); // extra
  central.writeUInt16LE(0, 32); // comment
  central.writeUInt16LE(0, 34); // disk
  central.writeUInt16LE(0, 36); // internal attributes
  central.writeUInt32LE((0o100644 << 16) >>> 0, 38); // external attributes
  central.writeUInt32LE(offset, 42);
  centralParts.push(central, name);

  offset += local.length + name.length + payload.length;
}

const centralOffset = offset;
const centralSize = centralParts.reduce((size, part) => size + part.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(centralOffset, 16);
end.writeUInt16LE(0, 20);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, Buffer.concat([...localParts, ...centralParts, end]));

const size = fs.statSync(outputFile).size;
console.log(`[build:skill] ${path.relative(root, outputFile)}`);
console.log(`[build:skill] ${files.length} files, ${(size / 1024).toFixed(1)} KB`);
for (const file of files) console.log(`  ${archivePrefix}${file.relative}`);
