import { processSitemap } from "./processSitemap";
import { checkRobots } from "./robotsChecker";
import { COMMON_SITEMAP_PATHS } from "./utils";

(async () => {
  const baseUrl = process.argv[2];
  if (!baseUrl) {
    console.error("Usage: npx ts-node index.ts <base_url>");
    process.exit(1);
  }

  const sitemaps = await checkRobots(baseUrl);

  if (sitemaps.length > 0) {
    for (let i = 0; i < sitemaps.length; i++) {
      await processSitemap(sitemaps[i], "sitemap_urls", `sitemap${i + 1}`);
    }
  } else {
    if (sitemaps.length === 0) {
      console.log(
        "[index] No sitemaps in robots.txt. Trying common sitemap paths..."
      );
      for (let i = 0; i < COMMON_SITEMAP_PATHS.length; i++) {
        const fallbackUrl = new URL(
          COMMON_SITEMAP_PATHS[i],
          baseUrl
        ).toString();
        try {
          const urls = await processSitemap(
            fallbackUrl,
            "sitemap_urls",
            `fallback${i + 1}`
          );
          if (urls.length > 0) {
            console.log(
              `[index] Found valid sitemap at ${fallbackUrl}, stopping further checks.`
            );
            break;
          } else {
            console.log(
              `[index] No URLs found at ${fallbackUrl}, trying next.`
            );
          }
        } catch (err: any) {
          console.log(`[index] Failed to fetch ${fallbackUrl}: ${err.message}`);
        }
      }
    }
  }
})();
