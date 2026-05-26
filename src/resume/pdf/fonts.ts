import { Font } from '@react-pdf/renderer';

let registered = false;

/**
 * Registers the OFL-licensed font families used by the PDF themes.
 * Idempotent. Must run before any PDF generation.
 */
export function registerFonts(): void {
  if (registered) return;
  registered = true;

  const base = `${window.location.origin}/fonts/`;

  Font.register({
    family: 'Geist',
    fonts: [
      { src: base + 'Geist-Regular.ttf', fontWeight: 400 },
      { src: base + 'Geist-Medium.ttf', fontWeight: 500 },
      { src: base + 'Geist-SemiBold.ttf', fontWeight: 600 },
    ],
  });

  Font.register({
    family: 'Geist Mono',
    fonts: [
      { src: base + 'GeistMono-Regular.ttf', fontWeight: 400 },
      { src: base + 'GeistMono-Medium.ttf', fontWeight: 500 },
    ],
  });

  Font.register({
    family: 'Inter',
    fonts: [
      { src: base + 'Inter-Regular.ttf', fontWeight: 400 },
      { src: base + 'Inter-Medium.ttf', fontWeight: 500 },
      { src: base + 'Inter-SemiBold.ttf', fontWeight: 600 },
      { src: base + 'Inter-Bold.ttf', fontWeight: 700 },
    ],
  });

  Font.register({
    family: 'JetBrains Mono',
    fonts: [
      { src: base + 'JetBrainsMono-Regular.ttf', fontWeight: 400 },
      { src: base + 'JetBrainsMono-Medium.ttf', fontWeight: 500 },
    ],
  });

  // Disable react-pdf's built-in hyphenator — we want clean line breaks.
  Font.registerHyphenationCallback((word) => [word]);
}
