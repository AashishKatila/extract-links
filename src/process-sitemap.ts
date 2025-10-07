import { fetchSitemap } from "./sitemap-fetcher";
import { parseSitemapContent } from "./sitemap-parser";
import { saveUrlsToFile } from "./sitemap-saver";
import path from "path";

export async function processSitemap(
  sitemapUrl: string,
  outputDir = "sitemap-urls",
  baseName?: string
): Promise<string[]> {
  console.log(`[sitemap] Fetching ${sitemapUrl}`);

  const res = await fetchSitemap(sitemapUrl);
  if (!res.success) {
    console.error(`[sitemap] Failed: ${res.error}`);
    return [];
  }

  const parsed = parseSitemapContent(res.content as string);
  let allUrls: string[] = [];

  if (parsed.type === "urlset" || parsed.type === "fallback") {
    const urls = parsed.urls || [];
    allUrls.push(...urls);

    const sitemapFileName = path.basename(sitemapUrl) || "urls";
    saveUrlsToFile(outputDir, sitemapFileName, urls);
  } else if (parsed.type === "sitemapindex") {
    const sitemaps = parsed.sitemaps || [];
    console.log(`[sitemap] Found ${sitemaps.length} child sitemaps`);

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
