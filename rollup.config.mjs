import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import { copyFileSync } from "fs";

// Plugin to copy file to root after build (for HACS)
function copyToRoot() {
  return {
    name: "copy-to-root",
    writeBundle() {
      copyFileSync(
        "dist/homematicip-local-climate-scheduler-card.js",
        "homematicip-local-climate-scheduler-card.js"
      );
      console.log("✓ Copied to root for HACS");
    },
  };
}

export default {
  input: "src/homematicip-local-climate-scheduler-card.ts",
  output: {
    file: "dist/homematicip-local-climate-scheduler-card.js",
    format: "es",
    sourcemap: false,
  },
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: false,
      inlineSources: false,
    }),
    json(),
    terser({
      compress: {
        drop_console: true,
        passes: 2,
        pure_getters: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
    }),
    copyToRoot(),
  ],
  external: [],
};
