import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';

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
    typescript({ sourceMap: true, outputToFilesystem: false }),
  ],
  context: 'this',
  moduleContext: 'this',
};