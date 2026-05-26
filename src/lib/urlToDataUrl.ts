/**
 * Fetches a remote URL and returns a base64 data URL. We need this for
 * embedding the user's avatar into the PDF — passing remote URLs directly to
 * `<Image>` triggers `@react-pdf/renderer`'s image fetch from a Node-style
 * environment that can fail under various browser CORS/CSP policies. Doing
 * the fetch ourselves and converting to a data URL is bulletproof.
 *
 * Cached in module scope by URL so we don't refetch when the user
 * re-downloads the PDF.
 */
const cache = new Map<string, string>();

export async function urlToDataUrl(url: string): Promise<string> {
  const hit = cache.get(url);
  if (hit) return hit;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const dataUrl = await blobToDataUrl(blob);
    cache.set(url, dataUrl);
    return dataUrl;
  } catch {
    // Fallback: 1x1 transparent PNG so the PDF doesn't blow up.
    const fallback =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    return fallback;
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('Unexpected FileReader result'));
    };
    reader.readAsDataURL(blob);
  });
}
