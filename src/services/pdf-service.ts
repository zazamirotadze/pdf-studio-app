import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import type { ExtractedImageItem } from '../types';

export class PDFService {
  /**
   * Merges multiple PDF items with custom page indices
   */
  static async mergePdfsWithRanges(
    items: Array<{ arrayBuffer: ArrayBuffer; pageIndices: number[] }>
  ): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();

    for (const item of items) {
      if (item.pageIndices.length === 0) continue;
      const srcPdf = await PDFDocument.load(item.arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(srcPdf, item.pageIndices);
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  }

  /**
   * Splits a PDF into multiple distinct PDF files based on range groups
   */
  static async splitPdfByRanges(
    pdfBuffer: ArrayBuffer,
    ranges: Array<{ from: number; to: number }>,
    baseName: string
  ): Promise<Array<{ filename: string; bytes: Uint8Array }>> {
    const srcPdf = await PDFDocument.load(pdfBuffer);
    const totalPages = srcPdf.getPageCount();
    const cleanName = baseName.replace(/\.pdf$/i, '');
    const results: Array<{ filename: string; bytes: Uint8Array }> = [];

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const from = Math.max(1, Math.min(range.from, range.to));
      const to = Math.min(totalPages, Math.max(range.from, range.to));

      const pageIndices: number[] = [];
      for (let p = from; p <= to; p++) {
        pageIndices.push(p - 1);
      }

      const partPdf = await PDFDocument.create();
      const copiedPages = await partPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach(page => partPdf.addPage(page));

      const bytes = await partPdf.save();
      const filename = `${cleanName}_part_${i + 1}_(pages_${from}-${to}).pdf`;
      results.push({ filename, bytes });
    }

    return results;
  }

  /**
   * Extracts STRICTLY embedded raster images/photos from a PDF.
   * NEVER creates full page screenshots! Only extracts the actual image assets.
   */
  static async extractEmbeddedImages(
    pdfBuffer: ArrayBuffer,
    baseName: string
  ): Promise<ExtractedImageItem[]> {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer.slice(0) });
    const pdf = await loadingTask.promise;
    const cleanName = baseName.replace(/\.pdf$/i, '');
    const extractedImages: ExtractedImageItem[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const operatorList = await page.getOperatorList();
      const fns = operatorList.fnArray;
      const args = operatorList.argsArray;

      const seenObjKeys = new Set<string>();

      for (let i = 0; i < fns.length; i++) {
        const fn = fns[i];
        const arg = args[i];

        // 1. Check paintImageXObject (XObject embedded images)
        if (fn === (pdfjsLib as any).OPS.paintImageXObject && arg && arg[0]) {
          const objId = arg[0];
          if (seenObjKeys.has(objId)) continue;
          seenObjKeys.add(objId);

          try {
            const resolver = (objId.startsWith('g_') ? page.commonObjs : page.objs);
            const imgData = await new Promise<any>((resolve) => {
              if (resolver.has(objId)) {
                try {
                  const directObj = resolver.get(objId);
                  if (directObj) {
                    resolve(directObj);
                    return;
                  }
                } catch {
                  // If not yet ready synchronously, fallback to callback
                }
              }
              resolver.get(objId, (obj: any) => resolve(obj));
            });

            if (imgData) {
              const item = await this.convertRawImageToItem(imgData, pageNum, extractedImages.length + 1, cleanName);
              if (item) {
                extractedImages.push(item);
              }
            }
          } catch (e) {
            console.warn(`Could not extract image object ${objId} on page ${pageNum}:`, e);
          }
        }

        // 2. Check paintInlineImageXObject (inline embedded images)
        if (fn === (pdfjsLib as any).OPS.paintInlineImageXObject && arg && arg[0]) {
          const inlineImg = arg[0];
          try {
            const item = await this.convertRawImageToItem(inlineImg, pageNum, extractedImages.length + 1, cleanName);
            if (item) {
              extractedImages.push(item);
            }
          } catch (e) {
            console.warn(`Could not extract inline image on page ${pageNum}:`, e);
          }
        }
      }
    }

    // Absolutely NO fallback to screenshots! If 0 images found, return empty list!
    return extractedImages;
  }

  /**
   * Converts raw PDF.js Image object / ImageBitmap / pixel buffer into an ExtractedImageItem
   */
  private static async convertRawImageToItem(
    imgData: any,
    pageNumber: number,
    imgIndex: number,
    baseName: string
  ): Promise<ExtractedImageItem | null> {
    try {
      let width = imgData.width;
      let height = imgData.height;

      if (!width || !height || width < 5 || height < 5) {
        return null;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Case A: imgData or imgData.bitmap is an ImageBitmap or HTMLImageElement or Canvas
      const drawable = imgData.bitmap || (imgData instanceof ImageBitmap ? imgData : null);
      if (drawable) {
        ctx.drawImage(drawable, 0, 0);
      } else if (imgData.data) {
        // Case B: Raw pixel buffer (Uint8ClampedArray / Uint8Array)
        const rawBuffer = imgData.data;
        const totalPixels = width * height;
        const imageData = ctx.createImageData(width, height);
        const targetData = imageData.data;

        if (rawBuffer.length === totalPixels * 4) {
          // RGBA 32bpp
          targetData.set(rawBuffer);
        } else if (rawBuffer.length === totalPixels * 3) {
          // RGB 24bpp -> RGBA
          let src = 0;
          let dst = 0;
          for (let p = 0; p < totalPixels; p++) {
            targetData[dst] = rawBuffer[src];
            targetData[dst + 1] = rawBuffer[src + 1];
            targetData[dst + 2] = rawBuffer[src + 2];
            targetData[dst + 3] = 255;
            src += 3;
            dst += 4;
          }
        } else if (rawBuffer.length === totalPixels) {
          // Grayscale 8bpp -> RGBA
          let src = 0;
          let dst = 0;
          for (let p = 0; p < totalPixels; p++) {
            const val = rawBuffer[src];
            targetData[dst] = val;
            targetData[dst + 1] = val;
            targetData[dst + 2] = val;
            targetData[dst + 3] = 255;
            src += 1;
            dst += 4;
          }
        } else if (rawBuffer.length < totalPixels) {
          // 1-bit monochrome mask
          let dst = 0;
          for (let byteIdx = 0; byteIdx < rawBuffer.length; byteIdx++) {
            const byte = rawBuffer[byteIdx];
            for (let bit = 7; bit >= 0; bit--) {
              if (dst >= totalPixels * 4) break;
              const isWhite = (byte >> bit) & 1;
              const color = isWhite ? 255 : 0;
              targetData[dst] = color;
              targetData[dst + 1] = color;
              targetData[dst + 2] = color;
              targetData[dst + 3] = 255;
              dst += 4;
            }
          }
        } else {
          return null;
        }

        ctx.putImageData(imageData, 0, 0);
      } else {
        return null;
      }

      const dataUrl = canvas.toDataURL('image/png');
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));

      const sizeKb = (blob.size / 1024).toFixed(1) + ' KB';

      return {
        id: `img-p${pageNumber}-${imgIndex}-${Math.random().toString(36).substring(2, 6)}`,
        name: `${baseName}_image_p${pageNumber}_${imgIndex}.png`,
        dataUrl,
        blob,
        width,
        height,
        format: 'png',
        pageNumber,
        sizeFormatted: sizeKb
      };
    } catch (e) {
      console.warn('Error converting raw image to item:', e);
      return null;
    }
  }

  /**
   * Bundles files into a ZIP and triggers download
   */
  static async downloadZip(
    files: Array<{ filename: string; data: Uint8Array | Blob }>,
    zipFilename: string
  ) {
    const zip = new JSZip();
    for (const f of files) {
      zip.file(f.filename, f.data);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    this.downloadBlob(zipBlob, zipFilename);
  }

  /**
   * Triggers download for a single Blob or Uint8Array
   */
  static downloadBlob(data: Blob | Uint8Array, filename: string) {
    const blob = data instanceof Blob ? data : new Blob([data as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }
}
