import * as pdfjsLib from 'pdfjs-dist';
import { ParsedDocument, DocumentPage } from '../types';

// Set up PDF.js worker using unpkg / cdnjs fallback to avoid bundler worker path resolution issues across various environments
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParseProgressCallback {
  (current: number, total: number, currentFilename: string): void;
}

/**
 * Extracts text from a single PDF File object entirely in the browser memory.
 */
export async function parseSinglePDF(file: File): Promise<ParsedDocument> {
  const fileId = `${file.name}-${file.size}-${file.lastModified}`;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    const pages: DocumentPage[] = [];
    let fullTextAccumulator = '';
    let totalExtractedCharacters = 0;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract string tokens
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        pages.push({
          pageNumber: pageNum,
          text: pageText,
        });

        fullTextAccumulator += ` ${pageText}`;
        totalExtractedCharacters += pageText.length;
      } catch (pageErr) {
        console.warn(`Error extracting page ${pageNum} from ${file.name}:`, pageErr);
        pages.push({
          pageNumber: pageNum,
          text: '',
        });
      }
    }

    // Scanned PDF detection heuristic:
    // If average characters per page is < 15, it's almost certainly an image/scanned PDF without OCR text layer
    const avgCharsPerPage = totalPages > 0 ? totalExtractedCharacters / totalPages : 0;
    const isScanned = avgCharsPerPage < 15;

    return {
      id: fileId,
      name: file.name,
      size: file.size,
      totalPages,
      pages,
      fullText: fullTextAccumulator.trim(),
      isScanned,
      isEncrypted: false,
      rawFile: file,
    };
  } catch (err: any) {
    console.error(`Failed to parse PDF: ${file.name}`, err);
    const isPassword = err?.name === 'PasswordException' || err?.message?.toLowerCase().includes('password');
    
    return {
      id: fileId,
      name: file.name,
      size: file.size,
      totalPages: 0,
      pages: [],
      fullText: '',
      isScanned: false,
      isEncrypted: isPassword,
      error: isPassword 
        ? 'Password-protected document. Please remove password before uploading.'
        : 'Could not read PDF format. The file might be corrupted or scanned.',
      rawFile: file,
    };
  }
}

/**
 * Parses multiple files sequentially with progress reporting to keep browser responsive.
 */
export async function parseMultiplePDFs(
  files: File[],
  onProgress?: ParseProgressCallback,
  signal?: AbortSignal
): Promise<ParsedDocument[]> {
  const results: ParsedDocument[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      break;
    }
    const file = files[i];
    if (onProgress) {
      onProgress(i + 1, total, file.name);
    }
    
    // Give browser event loop a breath between large PDFs
    await new Promise((res) => setTimeout(res, 4));
    
    const parsed = await parseSinglePDF(file);
    results.push(parsed);
  }

  return results;
}
