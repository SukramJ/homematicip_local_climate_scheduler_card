import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
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
  input: "src/homematic-schedule-card.ts",
  output: {
    file: "dist/homematicip-local-climate-scheduler-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    json(),
    terser({
      compress: {
        drop_console: false,
      },
      output: {
        comments: false,
      },
    }),
    copyToRoot(),
  ],
  external: [],
};
