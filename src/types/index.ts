export type ToolId = 'merge' | 'split' | 'extract-images';

export type Language = 'ka' | 'en';

export interface MergeFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  thumbnailUrl: string;
  arrayBuffer: ArrayBuffer;
  useCustomRange: boolean;
  pageFrom: number;
  pageTo: number;
}

export interface SplitRangeGroup {
  id: string;
  from: number;
  to: number;
}

export interface ExtractedImageItem {
  id: string;
  name: string;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
  pageNumber: number;
  sizeFormatted: string;
}
