import fs from "fs";
import path from "path";

export function saveUrlsToFile(
  outputDir: string,
  fileName: string,
  urls: string[]
) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(urls, null, 2));
  console.log(`[sitemap] Saved ${urls.length} URLs → ${filePath}`);
}
