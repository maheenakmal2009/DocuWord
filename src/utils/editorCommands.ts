import { ActiveFormats, Margins, PageSize } from '../types/document';

/**
 * Execute standard document editing command
 */
export function execDocCommand(command: string, value: string | undefined = undefined): boolean {
  try {
    return document.execCommand(command, false, value);
  } catch (err) {
    console.error(`execCommand error: ${command}`, err);
    return false;
  }
}

/**
 * Insert HTML directly at current cursor position
 */
export function insertHtmlAtCursor(html: string) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();

  const el = document.createElement('div');
  el.innerHTML = html;
  const frag = document.createDocumentFragment();
  let node: Node | null;
  let lastNode: Node | null = null;
  while ((node = el.firstChild)) {
    lastNode = frag.appendChild(node);
  }
  range.insertNode(frag);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * Insert a structured table with header row
 */
export function insertTable(rows: number = 3, cols: number = 3) {
  let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><thead><tr>`;
  for (let c = 0; c < cols; c++) {
    tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; background-color: #f1f5f9; font-weight: 600;">Header ${c + 1}</th>`;
  }
  tableHtml += `</tr></thead><tbody>`;

  for (let r = 0; r < rows; r++) {
    tableHtml += `<tr>`;
    for (let c = 0; c < cols; c++) {
      tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Cell ${r + 1},${c + 1}</td>`;
    }
    tableHtml += `</tr>`;
  }
  tableHtml += `</tbody></table><p><br></p>`;

  insertHtmlAtCursor(tableHtml);
}

/**
 * Insert an image with optional caption
 */
export function insertImage(src: string, alt: string = 'Document Image', caption?: string) {
  let imgHtml = `<figure style="margin: 18px auto; text-align: center; max-width: 100%;">
    <img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 0 auto; display: block;" />`;
  if (caption) {
    imgHtml += `<figcaption style="font-size: 0.825rem; color: #64748b; margin-top: 6px; font-style: italic;">${caption}</figcaption>`;
  }
  imgHtml += `</figure><p><br></p>`;
  insertHtmlAtCursor(imgHtml);
}

/**
 * Insert a callout box
 */
export function insertCallout(type: 'info' | 'warning' | 'success' = 'info', message: string = 'Note: Enter important notes or highlights here.') {
  const styles = {
    info: 'border-left: 4px solid #3b82f6; background-color: #eff6ff; color: #1e3a8a;',
    warning: 'border-left: 4px solid #f59e0b; background-color: #fffbeb; color: #78350f;',
    success: 'border-left: 4px solid #10b981; background-color: #ecfdf5; color: #064e3b;'
  };
  const html = `<div class="callout-box ${type}" style="${styles[type]} padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
    <strong>${type.toUpperCase()}:</strong> ${message}
  </div><p><br></p>`;
  insertHtmlAtCursor(html);
}

/**
 * Insert a page break line
 */
export function insertPageBreak() {
  const breakHtml = `<hr class="docuword-page-break" /><p><br></p>`;
  insertHtmlAtCursor(breakHtml);
}

/**
 * Insert current Date/Time formatted
 */
export function insertDate() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  insertHtmlAtCursor(`<span>${dateStr}</span>`);
}

/**
 * Insert Special Character
 */
export function insertSymbol(symbol: string) {
  insertHtmlAtCursor(`<span>${symbol}</span>`);
}

/**
 * Insert Hyperlink
 */
export function insertLink(url: string, text?: string) {
  if (text) {
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${text}</a>`;
    insertHtmlAtCursor(linkHtml);
  } else {
    execDocCommand('createLink', url);
  }
}

/**
 * Format block style (Paragraph, H1, H2, H3, Blockquote, Pre)
 */
export function formatBlock(tag: string) {
  execDocCommand('formatBlock', `<${tag}>`);
}

/**
 * Helper to find current selected table element
 */
export function getSelectedTableContext(): { table: HTMLTableElement | null; tr: HTMLTableRowElement | null; td: HTMLTableCellElement | null } {
  const sel = window.getSelection();
  if (!sel || !sel.anchorNode) {
    return { table: null, tr: null, td: null };
  }

  let node: Node | null = sel.anchorNode;
  let td: HTMLTableCellElement | null = null;
  let tr: HTMLTableRowElement | null = null;
  let table: HTMLTableElement | null = null;

  while (node && node !== document.body) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      td = node as HTMLTableCellElement;
    }
    if (node.nodeName === 'TR') {
      tr = node as HTMLTableRowElement;
    }
    if (node.nodeName === 'TABLE') {
      table = node as HTMLTableElement;
      break;
    }
    node = node.parentNode;
  }

  return { table, tr, td };
}

/**
 * Table Operations
 */
export function addTableRow(position: 'above' | 'below') {
  const { table, tr } = getSelectedTableContext();
  if (!table || !tr) return;

  const colCount = tr.cells.length;
  const newRow = document.createElement('tr');
  for (let i = 0; i < colCount; i++) {
    const cell = document.createElement('td');
    cell.style.border = '1px solid #cbd5e1';
    cell.style.padding = '8px 12px';
    cell.innerHTML = '&nbsp;';
    newRow.appendChild(cell);
  }

  if (position === 'above') {
    tr.parentNode?.insertBefore(newRow, tr);
  } else {
    tr.parentNode?.insertBefore(newRow, tr.nextSibling);
  }
}

export function addTableColumn(position: 'left' | 'right') {
  const { table, td } = getSelectedTableContext();
  if (!table || !td) return;

  const colIndex = td.cellIndex;
  const rows = table.rows;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const isHeader = row.cells[0]?.nodeName === 'TH';
    const newCell = document.createElement(isHeader ? 'th' : 'td');
    newCell.style.border = '1px solid #cbd5e1';
    newCell.style.padding = '8px 12px';
    if (isHeader) {
      newCell.style.backgroundColor = '#f1f5f9';
      newCell.style.fontWeight = '600';
      newCell.innerText = `Header`;
    } else {
      newCell.innerHTML = '&nbsp;';
    }

    if (position === 'left') {
      row.insertBefore(newCell, row.cells[colIndex]);
    } else {
      row.insertBefore(newCell, row.cells[colIndex]?.nextSibling || null);
    }
  }
}

export function deleteTableRow() {
  const { tr } = getSelectedTableContext();
  if (!tr) return;
  tr.remove();
}

export function deleteTableColumn() {
  const { table, td } = getSelectedTableContext();
  if (!table || !td) return;

  const colIndex = td.cellIndex;
  for (let r = 0; r < table.rows.length; r++) {
    table.rows[r].deleteCell(colIndex);
  }
}

export function deleteTable() {
  const { table } = getSelectedTableContext();
  if (!table) return;
  table.remove();
}

/**
 * Detect active formatting tags at the current cursor / selection
 */
export function queryActiveFormats(): ActiveFormats {
  const defaults: ActiveFormats = {
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    subscript: false,
    superscript: false,
    fontName: 'Calibri',
    fontSize: '11pt',
    foreColor: '#0f172a',
    hiliteColor: 'transparent',
    align: 'left',
    heading: 'p',
    list: 'none'
  };

  try {
    defaults.bold = document.queryCommandState('bold');
    defaults.italic = document.queryCommandState('italic');
    defaults.underline = document.queryCommandState('underline');
    defaults.strikeThrough = document.queryCommandState('strikeThrough');
    defaults.subscript = document.queryCommandState('subscript');
    defaults.superscript = document.queryCommandState('superscript');

    if (document.queryCommandState('justifyCenter')) defaults.align = 'center';
    else if (document.queryCommandState('justifyRight')) defaults.align = 'right';
    else if (document.queryCommandState('justifyFull')) defaults.align = 'justify';
    else defaults.align = 'left';

    if (document.queryCommandState('insertUnorderedList')) defaults.list = 'ul';
    else if (document.queryCommandState('insertOrderedList')) defaults.list = 'ol';

    // Find block format (Heading / P)
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== document.body) {
        const name = node.nodeName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'blockquote', 'pre', 'p'].includes(name)) {
          defaults.heading = name;
          break;
        }
        node = node.parentNode;
      }
    }
  } catch {
    // Ignore browser query errors
  }

  return defaults;
}

/**
 * Export document content to MS Word (.docx / .doc) format
 * Uses Microsoft Word HTML XML wrapper that opens flawlessly in Word & Pages
 */
export function exportToWordDocument(title: string, htmlContent: string, margins: Margins, pageSize: PageSize) {
  const filename = `${title.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Document'}.doc`;

  const sizeDimensions = {
    letter: { width: '8.5in', height: '11.0in' },
    a4: { width: '8.27in', height: '11.69in' },
    legal: { width: '8.5in', height: '14.0in' }
  }[pageSize] || { width: '8.5in', height: '11.0in' };

  const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: ${sizeDimensions.width} ${sizeDimensions.height};
      margin: ${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1e293b;
    }
    h1 { font-size: 22pt; color: #0f172a; margin-top: 18pt; margin-bottom: 8pt; font-weight: bold; }
    h2 { font-size: 16pt; color: #1e293b; margin-top: 14pt; margin-bottom: 6pt; font-weight: bold; }
    h3 { font-size: 13pt; color: #334155; margin-top: 10pt; margin-bottom: 4pt; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
    th, td { border: 1px solid #cbd5e1; padding: 6pt 10pt; font-size: 10pt; }
    th { background-color: #f1f5f9; font-weight: bold; }
    blockquote { border-left: 3pt solid #2563eb; padding-left: 10pt; margin: 10pt 0; color: #475569; font-style: italic; }
    .callout-box { border-left: 3pt solid #2563eb; background-color: #eff6ff; padding: 10pt; margin: 10pt 0; }
  </style>
</head>
<body>
  <div class="Section1">
    ${htmlContent}
  </div>
</body>
</html>
  `.trim();

  const blob = new Blob([wordHtml], { type: 'application/msword;charset=utf-8' });
  triggerDownload(blob, filename);
}

/**
 * Export to Standalone HTML file
 */
export function exportToHtml(title: string, htmlContent: string) {
  const filename = `${title.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Document'}.html`;
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1 { border-bottom: 2px solid #2563eb; padding-bottom: 8px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    th { background: #f1f5f9; }
    blockquote { border-left: 4px solid #2563eb; padding-left: 12px; color: #475569; font-style: italic; }
    .callout-box { border-left: 4px solid #3b82f6; background-color: #eff6ff; padding: 12px; border-radius: 4px; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, filename);
}

/**
 * Export to Plain Text
 */
export function exportToTxt(title: string, htmlContent: string) {
  const filename = `${title.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Document'}.txt`;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const text = tempDiv.innerText || tempDiv.textContent || '';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, filename);
}

/**
 * Export to Markdown format
 */
export function exportToMarkdown(title: string, htmlContent: string) {
  const filename = `${title.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Document'}.md`;
  let md = htmlContent
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n');

  // Strip other remaining HTML tags
  const temp = document.createElement('div');
  temp.innerHTML = md;
  const cleanMd = `# ${title}\n\n` + (temp.innerText || temp.textContent || '');

  const blob = new Blob([cleanMd], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
