const path = require("path");
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, "package.json"));
const terser = require("@rollup/plugin-terser");

const banner = `//! ${PACKAGE.name} - v${PACKAGE.version} ${
  PACKAGE.homepage
}  (c) ${PACKAGE.startyear}-${new Date().getFullYear()} ${PACKAGE.author.name}`;

module.exports = [
  {
    input: "packages/ofa/main.mjs",
    output: [
      {
        file: "dist/ofa.mjs",
        format: "es",
        banner,
      },
      {
        file: "dist/ofa.js",
        format: "umd",
        name: "$",
        banner,
      },
    ],
    plugins: [],
  },
  {
    input: "packages/ofa/main.mjs",
    output: [
      {
        file: "dist/ofa.min.mjs",
        format: "es",
        banner,
        sourcemap: true,
      },
      {
        file: "dist/ofa.min.js",
        format: "umd",
        name: "$",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
  {
    input: "libs/router/router.mjs",
    output: [
      {
        file: "libs/router/dist/router.min.mjs",
        format: "esm",
        banner,
        sourcemap: true,
      },
      {
        file: "libs/router/dist/router.min.js",
        format: "umd",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
  {
    input: "libs/scsr/scsr.mjs",
    output: [
      {
        file: "libs/scsr/dist/scsr.min.mjs",
        format: "esm",
        banner,
        sourcemap: true,
      },
      {
        file: "libs/scsr/dist/scsr.min.js",
        format: "umd",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
  {
    input: "libs/body-ghost/body-ghost.js",
    output: [
      {
        file: "libs/body-ghost/dist/body-ghost.min.mjs",
        format: "esm",
        banner,
        sourcemap: true,
      },
      {
        file: "libs/body-ghost/dist/body-ghost.min.js",
        format: "umd",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
  {
    input: "libs/global-link/global-link.js",
    output: [
      {
        file: "libs/global-link/dist/global-link.min.mjs",
        format: "esm",
        banner,
        sourcemap: true,
      },
      {
        file: "libs/global-link/dist/global-link.min.js",
        format: "umd",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
];
