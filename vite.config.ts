import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy this to GitHub Pages at https://<user>.github.io/painted-differently/
// set base to "/painted-differently/". If you deploy to a custom domain or the
// root of your Pages site, set base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/painted-differently/",
});
