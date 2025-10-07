const { XMLParser } = require("fast-xml-parser");

export function parseSitemapContent(content: string) {
  const parser = new XMLParser();
  const data = parser.parse(content);

  if (data.urlset) {
    return {
      type: "urlset",
      urls: data.urlset.url?.map((u: Record<string, string>) => u.loc),
    };
  } else if (data.sitemapindex) {
    return {
      type: "sitemapindex",
      sitemaps: data.sitemapindex.sitemap?.map(
        (s: Record<string, string>) => s.loc
      ),
    };
  }
  return { type: "fallback", urls: [] };
}
