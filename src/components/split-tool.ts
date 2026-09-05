import { I18nService } from '../i18n/translations';
import type { SplitRangeGroup } from '../types';
import { DropzoneComponent } from './dropzone';
import { PDFService } from '../services/pdf-service';
import { PDFRenderService } from '../services/pdf-render.service';
import { NotificationService } from '../services/notification.service';

export class SplitToolComponent {
  private file: File | null = null;
  private arrayBuffer: ArrayBuffer | null = null;
  private pageCount: number = 0;
  private rangeGroups: SplitRangeGroup[] = [];
  private isProcessing = false;
  private generatedParts: Array<{ filename: string; bytes: Uint8Array }> | null = null;
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'tool-view-container';
  }

  render(): HTMLElement {
    const t = I18nService.t();
    this.container.innerHTML = `
      <div class="tool-header-section">
        <h1 class="tool-view-title">${t.splitTool.title}</h1>
        <p class="tool-view-desc">${t.splitTool.subtitle}</p>
      </div>

      <div class="tool-body">
        ${!this.file ? `<div id="dropzone-slot"></div>` : `
          <div class="split-workspace-clean">
            <div class="file-summary-bar">
              <div class="file-info-col">
                <span class="file-name-highlight">${this.file.name}</span>
                <span class="file-pages-badge">${t.common.totalPages.replace('{total}', this.pageCount.toString())}</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="change-file-btn">
                ${t.actions.reset}
              </button>
            </div>

            <div class="split-ranges-card">
              <div class="ranges-header">
                <h3 class="ranges-title">${t.splitTool.rangesTitle}</h3>
                <button class="btn btn-secondary btn-sm" id="add-range-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  ${t.actions.addRange}
                </button>
              </div>

              <div class="range-groups-list" id="range-groups-list"></div>
            </div>

            ${this.generatedParts ? `
              <div class="generated-parts-card">
                <div class="generated-header">
                  <span class="generated-title">${t.splitTool.generatedTitle.replace('{count}', this.generatedParts.length.toString())}</span>
                  <button class="btn btn-primary btn-sm" id="download-zip-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ${t.actions.downloadZip}
                  </button>
                </div>
                <div class="parts-list" id="parts-list"></div>
              </div>
            ` : ''}

            <div class="tool-action-bar" id="split-action-slot"></div>
          </div>
        `}
      </div>
    `;

    if (!this.file) {
      this.renderDropzone();
    } else {
      this.attachEvents();
      this.renderRangeGroups();
      this.renderActions();
      if (this.generatedParts) {
        this.renderGeneratedParts();
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
    this.generatedParts = null;

    // Initialize with 1 default range group: 1 to pageCount
    this.rangeGroups = [
      {
        id: `range-${Date.now()}-1`,
        from: 1,
        to: this.pageCount
      }
    ];

    this.render();
  }

  private attachEvents() {
    this.container.querySelector('#change-file-btn')?.addEventListener('click', () => {
      this.file = null;
      this.arrayBuffer = null;
      this.pageCount = 0;
      this.rangeGroups = [];
      this.generatedParts = null;
      this.render();
    });

    this.container.querySelector('#add-range-btn')?.addEventListener('click', () => {
      this.addNewRange();
    });
  }

  private addNewRange() {
    const lastRange = this.rangeGroups[this.rangeGroups.length - 1];
    let nextFrom = 1;
    let nextTo = this.pageCount;

    if (lastRange) {
      if (lastRange.to < this.pageCount) {
        nextFrom = lastRange.to + 1;
        nextTo = this.pageCount;
      } else {
        nextFrom = 1;
        nextTo = this.pageCount;
      }
    }

    this.rangeGroups.push({
      id: `range-${Date.now()}-${this.rangeGroups.length + 1}`,
      from: nextFrom,
      to: nextTo
    });

    this.generatedParts = null;
    this.renderRangeGroups();
    this.renderActions();
  }

  private renderRangeGroups() {
    const listContainer = this.container.querySelector('#range-groups-list');
    if (!listContainer) return;

    const t = I18nService.t();
    listContainer.innerHTML = '';

    this.rangeGroups.forEach((group, index) => {
      const row = document.createElement('div');
      row.className = 'range-group-row';

      row.innerHTML = `
        <div class="range-part-badge">
          ${t.splitTool.partLabel.replace('{index}', (index + 1).toString())}
        </div>

        <div class="range-inputs-pair">
          <div class="input-with-tag">
            <span class="field-tag">${t.splitTool.fromLabel}</span>
            <input 
              type="number" 
              class="form-control range-val-input from-input" 
              min="1" 
              max="${this.pageCount}" 
              value="${group.from}" 
              data-id="${group.id}" 
            />
          </div>
          <span class="range-dash">—</span>
          <div class="input-with-tag">
            <span class="field-tag">${t.splitTool.toLabel}</span>
            <input 
              type="number" 
              class="form-control range-val-input to-input" 
              min="1" 
              max="${this.pageCount}" 
              value="${group.to}" 
              data-id="${group.id}" 
            />
          </div>
        </div>

        <div class="range-pages-summary">
          <span>${t.common.pagesCount.replace('{count}', Math.max(0, group.to - group.from + 1).toString())}</span>
        </div>

        <div class="range-controls">
          <button class="btn-micro btn-danger remove-range-btn" title="${t.actions.removeRange}" ${this.rangeGroups.length === 1 ? 'disabled' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;

      const fromIn = row.querySelector('.from-input') as HTMLInputElement;
      fromIn?.addEventListener('input', () => {
        group.from = parseInt(fromIn.value, 10) || 1;
        this.generatedParts = null;
        row.querySelector('.range-pages-summary span')!.textContent = t.common.pagesCount.replace('{count}', Math.max(0, group.to - group.from + 1).toString());
      });

      const toIn = row.querySelector('.to-input') as HTMLInputElement;
      toIn?.addEventListener('input', () => {
        group.to = parseInt(toIn.value, 10) || this.pageCount;
        this.generatedParts = null;
        row.querySelector('.range-pages-summary span')!.textContent = t.common.pagesCount.replace('{count}', Math.max(0, group.to - group.from + 1).toString());
      });

      row.querySelector('.remove-range-btn')?.addEventListener('click', () => {
        if (this.rangeGroups.length > 1) {
          this.rangeGroups.splice(index, 1);
          this.generatedParts = null;
          this.renderRangeGroups();
          this.renderActions();
        }
      });

      listContainer.appendChild(row);
    });
  }

  private renderGeneratedParts() {
    const partsList = this.container.querySelector('#parts-list');
    if (!partsList || !this.generatedParts) return;

    partsList.innerHTML = '';
    const t = I18nService.t();

    this.generatedParts.forEach((part, index) => {
      const partRow = document.createElement('div');
      partRow.className = 'generated-part-item';
      const sizeKb = (part.bytes.length / 1024).toFixed(1) + ' KB';

      partRow.innerHTML = `
        <div class="part-item-left">
          <span class="part-number-circle">${index + 1}</span>
          <span class="part-name-text">${part.filename}</span>
          <span class="part-size-pill">${sizeKb}</span>
        </div>
        <button class="btn btn-secondary btn-sm download-single-part-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${t.actions.download}
        </button>
      `;

      partRow.querySelector('.download-single-part-btn')?.addEventListener('click', () => {
        PDFService.downloadBlob(part.bytes, part.filename);
      });

      partsList.appendChild(partRow);
    });

    this.container.querySelector('#download-zip-btn')?.addEventListener('click', async () => {
      if (!this.file || !this.generatedParts) return;
      const base = this.file.name.replace(/\.pdf$/i, '');
      const filesForZip = this.generatedParts.map(p => ({ filename: p.filename, data: p.bytes }));
      await PDFService.downloadZip(filesForZip, `${base}_split_parts.zip`);
    });
  }

  private renderActions() {
    const slot = this.container.querySelector('#split-action-slot');
    if (!slot || !this.file) return;

    const t = I18nService.t();
    const btnLabel = t.splitTool.splitBtn.replace('{count}', this.rangeGroups.length.toString());

    slot.innerHTML = `
      <div class="action-bar-content">
        <button class="btn btn-primary btn-lg" id="start-split-btn" ${this.isProcessing ? 'disabled' : ''}>
          ${this.isProcessing ? `
            <span class="spinner"></span> ${t.actions.processing}
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            ${btnLabel}
          `}
        </button>
      </div>
    `;

    slot.querySelector('#start-split-btn')?.addEventListener('click', () => this.handleSplit());
  }

  private async handleSplit() {
    if (!this.file || !this.arrayBuffer) return;

    // Validate each range
    for (let i = 0; i < this.rangeGroups.length; i++) {
      const g = this.rangeGroups[i];
      if (g.from < 1 || g.to > this.pageCount || g.from > g.to) {
        NotificationService.error(
          I18nService.t().splitTool.invalidRange
            .replace('{index}', (i + 1).toString())
            .replace('{total}', this.pageCount.toString())
        );
        return;
      }
    }

    try {
      this.isProcessing = true;
      this.renderActions();

      const parts = await PDFService.splitPdfByRanges(
        this.arrayBuffer,
        this.rangeGroups,
        this.file.name
      );

      this.generatedParts = parts;

      // If single part, also trigger direct download
      if (parts.length === 1) {
        PDFService.downloadBlob(parts[0].bytes, parts[0].filename);
      } else {
        // Automatically download ZIP as well for convenience
        const base = this.file.name.replace(/\.pdf$/i, '');
        const filesForZip = parts.map(p => ({ filename: p.filename, data: p.bytes }));
        await PDFService.downloadZip(filesForZip, `${base}_split_parts.zip`);
      }

      NotificationService.success(I18nService.t().splitTool.successMessage);
      this.render();
    } catch (err) {
      console.error('Split error:', err);
      NotificationService.error(I18nService.t().notifications.genericError);
    } finally {
      this.isProcessing = false;
      this.renderActions();
    }
  }
}
