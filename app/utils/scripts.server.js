// app/utils/scripts.server.js
import { join } from "path";
import { readdirSync } from "fs";

export function getPublicScripts() {
  const publicDir = join(process.cwd(), "public", "scripts");

  try {
    const files = readdirSync(publicDir);

    return files.map(filename => {
      const filePath = join(publicDir, filename);

      return {
        path: `/scripts/${filename}`
      };
    });
  } catch (error) {
    console.error("Error reading scripts directory:", error);
    return [];
  }
}
