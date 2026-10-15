import fs from "node:fs";
import path from "node:path";

if (fs.existsSync("out")) {
  // Mirror static output into .next so Cloudflare Pages works even if output directory is set to .next
  fs.cpSync("out", ".next", { recursive: true, force: true });

  // Mirror static output into .vercel/output/static in case next-on-pages preset is selected
  const vercelStaticDir = path.join(".vercel", "output", "static");
  fs.mkdirSync(vercelStaticDir, { recursive: true });
  fs.cpSync("out", vercelStaticDir, { recursive: true, force: true });

  console.log("[copy-static] Mirrored static files to .next and .vercel/output/static");
}
