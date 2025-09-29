import { XMLParser } from "fast-xml-parser";

export function parseSitemap(xml: string): {
  type: "urlset" | "sitemapindex" | "fallback";
  urls?: string[];
  sitemaps?: string[];
} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true,
  });
  let obj;
  try {
    obj = parser.parse(xml);
  } catch {
    obj = null;
  }

  // URL list sitemap
  if (obj?.urlset?.url) {
    const urls = Array.isArray(obj.urlset.url)
      ? obj.urlset.url.map((u: any) => u.loc)
      : [obj.urlset.url.loc];
    return { type: "urlset", urls };
  }

  // Sitemap index
  if (obj?.sitemapindex?.sitemap) {
    const sitemaps = Array.isArray(obj.sitemapindex.sitemap)
      ? obj.sitemapindex.sitemap.map((s: any) => s.loc)
      : [obj.sitemapindex.sitemap.loc];
    return { type: "sitemapindex", sitemaps };
  }

  // Fallback: extract all URLs using regex
  const regex = /https?:\/\/[^\s"'<>]+/g;
  const matches = xml.match(regex) || [];
  return { type: "fallback", urls: [...new Set(matches)] };
}
