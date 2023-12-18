import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
  input: "src/index.ts",
  output: {
    file: "./lib/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    nodePolyfills(),
    typescript({
      sourceMap: true,
      outputToFilesystem: false,
      declaration: true,
      declarationDir: "./lib",
    }),
  ],
  context: "this",
  moduleContext: "this",
};
