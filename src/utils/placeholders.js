const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

const escapeXml = (value) =>
  String(value ?? '')
    .split('')
    .map((char) => ESCAPE_MAP[char] ?? char)
    .join('');

const toDisplayLine = (value) => escapeXml(String(value ?? '').toUpperCase());

const wrapText = (value, maxLength, maxLines) => {
  const normalized = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return [];
  }

  const words = normalized.split(' ');
  const lines = [];
  let current = '';

  for (const rawWord of words) {
    if (!rawWord) {
      continue;
    }

    let word = rawWord;
    while (word.length > maxLength) {
      const segment = word.slice(0, maxLength);
      word = word.slice(maxLength);

      if (current) {
        lines.push(current);
        current = '';
      }

      lines.push(segment);
      if (lines.length >= maxLines) {
        return lines.slice(0, maxLines).map(toDisplayLine);
      }
    }

    if (!word) {
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
        if (lines.length >= maxLines) {
          return lines.slice(0, maxLines).map(toDisplayLine);
        }
      }
      current = word;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines.slice(0, maxLines).map(toDisplayLine);
};

const buildPlaceholder = ({
  width,
  height,
  text,
  background,
  accent,
  textColor,
  borderRadius,
  fontSize,
  lineHeight,
  maxLineLength,
  maxLines,
  fallbackLabel,
}) => {
  const lines = wrapText(text, maxLineLength, maxLines);
  const displayLines =
    lines.length > 0 ? lines : [toDisplayLine(fallbackLabel)];
  const accessibleLabel = escapeXml(text || fallbackLabel);
  const lineCount = displayLines.length;
  const spacing = lineHeight;
  const startOffset = -((lineCount - 1) * spacing) / 2;

  const tspanElements = displayLines
    .map((line, index) => {
      const dy = index === 0 ? `${startOffset}em` : `${spacing}em`;
      return `<tspan x="50%" dy="${dy}">${line}</tspan>`;
    })
    .join('');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${accessibleLabel}">` +
    `<defs>` +
    `<linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="${background}" />` +
    `<stop offset="100%" stop-color="${accent}" />` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="100%" height="100%" fill="url(#gradient)" rx="${borderRadius}" ry="${borderRadius}" />` +
    `<text x="50%" y="50%" fill="${textColor}" font-family="'Inter','Segoe UI',sans-serif" font-size="${fontSize}" font-weight="600" text-anchor="middle" dominant-baseline="middle">` +
    `${tspanElements}` +
    `</text>` +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const createCoverPlaceholder = (text) =>
  buildPlaceholder({
    width: 300,
    height: 450,
    text,
    background: '#f4f5f8',
    accent: '#e0e5ef',
    textColor: '#1f2937',
    borderRadius: 28,
    fontSize: 28,
    lineHeight: 1.2,
    maxLineLength: 18,
    maxLines: 3,
    fallbackLabel: 'AniRanker',
  });

export const createPortraitPlaceholder = (text) =>
  buildPlaceholder({
    width: 256,
    height: 256,
    text,
    background: '#f7efe2',
    accent: '#e8d7bd',
    textColor: '#3a2f21',
    borderRadius: 32,
    fontSize: 32,
    lineHeight: 1.2,
    maxLineLength: 12,
    maxLines: 3,
    fallbackLabel: 'Portrait',
  });

export default {
  createCoverPlaceholder,
  createPortraitPlaceholder,
};
