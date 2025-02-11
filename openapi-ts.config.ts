import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://api.naucomnha.com/api-json",
  output: "src/client",
  exportCore: true,
});
