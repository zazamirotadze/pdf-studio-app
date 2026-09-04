import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
if (typeof window !== 'undefined') {
  try {
    // Use worker URL from CDN or internal worker bundled
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker setup fallback:', e);
  }
}

export class PDFRenderService {
  /**
   * Renders a specific page of a PDF ArrayBuffer to an image data URL (thumbnail)
   */
  static async renderPageThumbnail(
    pdfData: ArrayBuffer | Uint8Array,
    pageNumber: number = 1,
    scale: number = 0.5
  ): Promise<string> {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfData.slice(0) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);

      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas 2D context not available');
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await (page.render(renderContext as any) as any).promise;
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (err) {
      console.error('Error rendering page thumbnail:', err);
      return '';
    }
  }

  /**
   * Renders all pages of a PDF to high-resolution data URLs
   */
  static async renderAllPagesToImages(
    pdfData: ArrayBuffer | Uint8Array,
    scale: number = 1.5,
    format: 'image/jpeg' | 'image/png' = 'image/png'
  ): Promise<Array<{ pageNumber: number; dataUrl: string; width: number; height: number }>> {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData.slice(0) });
    const pdf = await loadingTask.promise;
    const results: Array<{ pageNumber: number; dataUrl: string; width: number; height: number }> = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await (page.render({
        canvasContext: context,
        viewport: viewport,
      } as any) as any).promise;

      results.push({
        pageNumber: i,
        dataUrl: canvas.toDataURL(format, format === 'image/jpeg' ? 0.92 : 1.0),
        width: viewport.width,
        height: viewport.height
      });
    }

    return results;
  }

  /**
   * Returns page count of a PDF file
   */
  static async getPageCount(pdfData: ArrayBuffer | Uint8Array): Promise<number> {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfData.slice(0) });
      const pdf = await loadingTask.promise;
      return pdf.numPages;
    } catch (err) {
      console.error('Error reading page count:', err);
      return 1;
    }
  }
}
