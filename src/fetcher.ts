import { Impit } from "impit";

export async function fetchUrl(url: string): Promise<{
  success: boolean;
  status?: number;
  content?: string;
  error?: string;
}> {
  const impit = new Impit();

  try {
    const request = new Request(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "*/*",
      },
    });

    const resp = await fetch(request);

    const status = resp.status;
    const content = await resp.text();

    if (status === 200) {
      return { success: true, status, content };
    } else {
      return {
        success: false,
        status,
        error: `HTTP status ${status}`,
        content,
      };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}
