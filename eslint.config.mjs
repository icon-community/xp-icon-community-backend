import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["tests/**/*.js"],
    languageOptions: { globals: { ...globals.mocha } },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];
