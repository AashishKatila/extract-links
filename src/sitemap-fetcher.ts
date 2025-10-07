import { fetchUrl } from "./fetcher";

export async function fetchSitemap(sitemapUrl: string) {
  const res = await fetchUrl(sitemapUrl);
  if (!res.success) {
    return { success: false, error: res.error };
  }
  return { success: true, content: res.content };
}
