import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    { file: "index.js", format: "commonjs" },
    { file: "dist/index.js", format: "umd", name: "Deact", sourcemap: true }
  ],
  plugins: [typescript()]
};
