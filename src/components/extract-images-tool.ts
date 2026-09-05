import { I18nService } from '../i18n/translations';
import type { ExtractedImageItem } from '../types';
import { DropzoneComponent } from './dropzone';
import { PDFService } from '../services/pdf-service';
import { PDFRenderService } from '../services/pdf-render.service';
import { NotificationService } from '../services/notification.service';

export class ExtractImagesToolComponent {
  private file: File | null = null;
  private arrayBuffer: ArrayBuffer | null = null;
  private pageCount: number = 0;
  private extractedImages: ExtractedImageItem[] = [];
  private isProcessing = false;
  private hasExtracted = false;
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'tool-view-container';
  }

  render(): HTMLElement {
    const t = I18nService.t();
    this.container.innerHTML = `
      <div class="tool-header-section">
        <h1 class="tool-view-title">${t.extractTool.title}</h1>
        <p class="tool-view-desc">${t.extractTool.subtitle}</p>
      </div>

      <div class="tool-body">
        ${!this.file ? `<div id="dropzone-slot"></div>` : `
          <div class="extract-workspace">
            <div class="file-summary-bar">
              <div class="file-info-col">
                <span class="file-name-highlight">${this.file.name}</span>
                <span class="file-pages-badge">${t.common.totalPages.replace('{total}', this.pageCount.toString())}</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="change-file-btn">
                ${t.actions.reset}
              </button>
            </div>

            ${!this.hasExtracted ? `
              <div class="extract-start-card">
                <div class="extract-start-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <h3>${this.file.name}</h3>
                <p>${t.extractTool.startPrompt}</p>
                <button class="btn btn-primary btn-lg" id="start-extract-btn" ${this.isProcessing ? 'disabled' : ''}>
                  ${this.isProcessing ? `
                    <span class="spinner"></span> ${t.actions.processing}
                  ` : `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    ${t.extractTool.extractBtn}
                  `}
                </button>
              </div>
            ` : `
              <div class="extracted-results-container">
                <div class="results-header-bar">
                  <span class="results-count-text">
                    ${t.extractTool.foundCount.replace('{count}', this.extractedImages.length.toString())}
                  </span>
                  ${this.extractedImages.length > 0 ? `
                    <button class="btn btn-primary btn-sm" id="download-all-zip-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      ${t.extractTool.downloadAllZip}
                    </button>
                  ` : ''}
                </div>

                ${this.extractedImages.length === 0 ? `
                  <div class="empty-state-box">
                    <p>${t.extractTool.noImagesFound}</p>
                  </div>
                ` : `
                  <div class="images-gallery-grid" id="images-gallery-grid"></div>
                `}
              </div>
            `}
          </div>
        `}
      </div>
    `;

    if (!this.file) {
      this.renderDropzone();
    } else {
      this.attachEvents();
      if (this.hasExtracted && this.extractedImages.length > 0) {
        this.renderImagesGallery();
      }
    }

    return this.container;
  }

  private renderDropzone() {
    const slot = this.container.querySelector('#dropzone-slot');
    if (!slot) return;

    slot.innerHTML = '';
    const dropzone = new DropzoneComponent({
      accept: '.pdf,application/pdf',
      multiple: false,
      onFilesSelected: (files) => this.handleFileSelected(files[0])
    });
    slot.appendChild(dropzone.render());
  }

  private async handleFileSelected(file?: File) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      NotificationService.warning(I18nService.t().notifications.selectPdfWarning);
      return;
    }

    this.file = file;
    this.arrayBuffer = await file.arrayBuffer();
    this.pageCount = await PDFRenderService.getPageCount(this.arrayBuffer);
    this.extractedImages = [];
    this.hasExtracted = false;

    this.render();
  }

  private attachEvents() {
    this.container.querySelector('#change-file-btn')?.addEventListener('click', () => {
      this.file = null;
      this.arrayBuffer = null;
      this.pageCount = 0;
      this.extractedImages = [];
      this.hasExtracted = false;
      this.render();
    });

    this.container.querySelector('#start-extract-btn')?.addEventListener('click', () => {
      this.extractImages();
    });

    this.container.querySelector('#download-all-zip-btn')?.addEventListener('click', async () => {
      if (!this.file || this.extractedImages.length === 0) return;
      const base = this.file.name.replace(/\.pdf$/i, '');
      const filesForZip = this.extractedImages.map(img => ({
        filename: img.name,
        data: img.blob
      }));
      await PDFService.downloadZip(filesForZip, `${base}_extracted_images.zip`);
    });
  }

  private async extractImages() {
    if (!this.file || !this.arrayBuffer) return;

    try {
      this.isProcessing = true;
      this.render();

      const images = await PDFService.extractEmbeddedImages(this.arrayBuffer, this.file.name);
      this.extractedImages = images;
      this.hasExtracted = true;

      NotificationService.success(I18nService.t().extractTool.successMessage);
      this.render();
    } catch (err) {
      console.error('Extract error:', err);
      NotificationService.error(I18nService.t().notifications.genericError);
    } finally {
      this.isProcessing = false;
      this.render();
    }
  }

  private renderImagesGallery() {
    const grid = this.container.querySelector('#images-gallery-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const t = I18nService.t();

    this.extractedImages.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'extracted-img-card';

      card.innerHTML = `
        <div class="card-top-info">
          <span class="img-badge-page">${t.extractTool.pageLabel.replace('{page}', item.pageNumber.toString())}</span>
          <span class="img-badge-dim">${item.width} × ${item.height}</span>
        </div>
        <div class="img-display-box">
          <img src="${item.dataUrl}" alt="${item.name}" />
        </div>
        <div class="img-card-footer">
          <span class="img-size-text">${item.sizeFormatted}</span>
          <button class="btn btn-secondary btn-sm download-single-img-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${t.extractTool.downloadSingle}
          </button>
        </div>
      `;

      card.querySelector('.download-single-img-btn')?.addEventListener('click', () => {
        PDFService.downloadBlob(item.blob, item.name);
      });

      grid.appendChild(card);
    });
  }
}
