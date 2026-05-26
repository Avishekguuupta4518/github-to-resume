import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import type { PaperSize } from '@/store/prefsStore';
import { urlToDataUrl } from './urlToDataUrl';

interface DownloadArgs {
  data: ResumeData;
  theme: ThemeTokens;
  paperSize: PaperSize;
}

/**
 * Generates a vector PDF for the supplied résumé data and triggers a
 * browser download. `@react-pdf/renderer` and the document component are
 * dynamically imported so the home route doesn't pay for them.
 */
export async function downloadResumePdf({
  data,
  theme,
  paperSize,
}: DownloadArgs): Promise<void> {
  const [{ pdf }, { ResumeDocument }, { registerFonts }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/resume/pdf/ResumeDocument'),
    import('@/resume/pdf/fonts'),
  ]);

  registerFonts();

  const avatarDataUrl = await urlToDataUrl(data.profile.avatarUrl);

  const doc = (
    <ResumeDocument
      data={data}
      theme={theme}
      avatarDataUrl={avatarDataUrl}
      paperSize={paperSize}
    />
  );

  const blob = await pdf(doc).toBlob();
  saveBlob(blob, `${data.profile.login}-resume.pdf`);
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}