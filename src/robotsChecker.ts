import { fetchUrl } from "./fetcher";
import fs from "fs";
import path from "path";

export function extractSitemapsFromRobots(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.toLowerCase().startsWith("sitemap:"))
    .map((line) => line.slice(8).trim());
}

export async function checkRobots(
  baseUrl: string,
  outputDir = "robots_results"
): Promise<string[]> {
  const robotsUrl = new URL("/robots.txt", baseUrl).toString();
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(
    outputDir,
    `${baseUrl.replace(/[^a-z0-9]/gi, "_")}_robots.txt`
  );

  const res = await fetchUrl(robotsUrl);
  if (!res.success) {
    fs.writeFileSync(
      filePath,
      `robots.txt not found\nError: ${res.error || ""}`
    );
    console.log(`[robots] Not found at ${robotsUrl}`);
    return [];
  }

  fs.writeFileSync(filePath, res.content as string);
  console.log(`[robots] Saved at ${filePath}`);

  const sitemapUrls = extractSitemapsFromRobots(res.content as string);
  console.log(`[robots] Found ${sitemapUrls.length} sitemap(s)`);

  return sitemapUrls;
}
