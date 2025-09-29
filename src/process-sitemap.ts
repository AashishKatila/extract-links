import { fetchUrl } from "./fetcher";
import fs from "fs";
import path from "path";
import { parseSitemap } from "./sitemap-parser";

export async function processSitemap(
  sitemapUrl: string,
  outputDir = "sitemap-urls",
  baseName?: string
): Promise<string[]> {
  console.log(`[sitemap] Fetching ${sitemapUrl}`);
  const res = await fetchUrl(sitemapUrl);
  if (!res.success) {
    console.error(`[sitemap] Failed: ${res.error}`);
    return [];
  }

  const parsed = parseSitemap(res.content as string);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let allUrls: string[] = [];

  if (parsed.type === "urlset" || parsed.type === "fallback") {
    const urls = parsed.urls || [];
    allUrls.push(...urls);

    const urlParts = sitemapUrl.split("/");
    const sitemapFileName = urlParts[urlParts.length - 1] || "urls";
    const filename = path.join(outputDir, `${sitemapFileName}.json`);
    fs.writeFileSync(filename, JSON.stringify(urls, null, 2));
    console.log(`[sitemap] Saved ${urls.length} URLs to ${filename}`);
  } else if (parsed.type === "sitemapindex") {
    const sitemaps = parsed.sitemaps || [];
    console.log(
      `[sitemap] Sitemap ${sitemapUrl}-${sitemaps.length} child sitemaps`
    );

    for (let i = 0; i < sitemaps.length; i++) {
      const childBaseName = baseName
        ? `${baseName}_child${i + 1}`
        : `child${i + 1}`;
      const childUrls = await processSitemap(
        sitemaps[i],
        outputDir,
        childBaseName
      );
      allUrls.push(...childUrls);
    }
  }

  return allUrls;
}
