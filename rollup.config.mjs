import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "./src/index.ts",
  output: {
    file: "./lib/bundle.js",
    format: "esm",
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: true,
      outputToFilesystem: false,
      declaration: true,
      declarationDir: "./lib",
      tsconfig: "tsconfig.rollup.json",
    }),
  ],
  context: "this",
  moduleContext: "this",
};
