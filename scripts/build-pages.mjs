import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const build = spawnSync(process.execPath, ["scripts/run-framework.mjs", "build"], {
  stdio: "inherit",
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const output = path.resolve("dist/pages");
await rm(output, { recursive: true, force: true });
await cp("dist/client", output, { recursive: true });
await mkdir(path.join(output, "_worker.js"));
await cp("dist/server", path.join(output, "_worker.js/server"), {
  recursive: true,
  filter: (source) => !source.endsWith("wrangler.json") && !source.endsWith(".map"),
});

// Keep the framework's module paths intact inside the Pages Worker bundle.
await writeFile(path.join(output, "_worker.js/index.js"), `
import app from "./server/index.js";
export default {
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
};
`);

// Serve static files directly, while the homepage and API retain their server behavior.
const publicFiles = await readdir("public");
await writeFile(path.join(output, "_routes.json"), JSON.stringify({
  version: 1,
  include: ["/*"],
  exclude: ["/_next/static/*", ...publicFiles.map((file) => "/" + file)],
}, null, 2));
console.log("Cloudflare Pages output ready in dist/pages");
// The Vite plugin emits a Workers redirect. Pages must use its own root config.
await rm(".wrangler/deploy/config.json", { force: true });
