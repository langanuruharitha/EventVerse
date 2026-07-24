// lib/utils/download-helper.ts

/**
 * Robust image download helper handling base64 data URLs, cross-origin URLs, and proxy fallbacks.
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<boolean> {
  try {
    let blob: Blob;

    if (imageUrl.startsWith('data:')) {
      const parts = imageUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      blob = new Blob([u8arr], { type: mime });
    } else {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Proxy image download failed');
      blob = await res.blob();
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Image download error:', error);
    // Direct link fallback
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return false;
  }
}

/**
 * Helper to generate and download a plain text design blueprint / specification document for vendors/bakers/artists.
 */
export function downloadSpecSheet(
  title: string,
  category: 'Decoration' | 'Cake' | 'Mehndi' | 'Theme Plan',
  details: Record<string, string | number | boolean | string[] | undefined | null>,
  filename: string
): void {
  let content = `==================================================\n`;
  content += `        EVENTVERSE DESIGN BLUEPRINT SPECIFICATION\n`;
  content += `==================================================\n\n`;
  content += `Category: ${category} Design Blueprint\n`;
  content += `Design Name / Theme: ${title}\n`;
  content += `Export Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
  content += `--------------------------------------------------\n`;
  content += `SPECIFICATIONS & REQUIREMENTS:\n`;
  content += `--------------------------------------------------\n`;

  Object.entries(details).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') return;
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase());

    if (Array.isArray(val)) {
      content += `${formattedKey}:\n`;
      val.forEach(item => {
        content += `  - ${item}\n`;
      });
    } else {
      content += `${formattedKey}: ${val}\n`;
    }
  });

  content += `\n--------------------------------------------------\n`;
  content += `VENDOR INSTRUCTIONS:\n`;
  content += `- Please review the parameters above for planning & execution.\n`;
  content += `- Contact the host for custom adjustments or material sourcing.\n`;
  content += `- Generated via EventVerse AI Design Studio.\n`;
  content += `==================================================\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
