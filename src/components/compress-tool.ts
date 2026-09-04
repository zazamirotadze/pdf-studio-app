import { I18nService } from '../i18n/translations';
import type { CompressLevel, CompressResult } from '../types';
import { DropzoneComponent } from './dropzone';
import { PDFService } from '../services/pdf-service';
import { PDFRenderService } from '../services/pdf-render.service';
import { NotificationService } from '../services/notification.service';

export class CompressToolComponent {
  private file: File | null = null;
  private arrayBuffer: ArrayBuffer | null = null;
  private pageCount: number = 0;
  private selectedLevel: CompressLevel = 'recommended';
  private isProcessing = false;
  private progressCurrent = 0;
  private progressTotal = 0;
  private result: CompressResult | null = null;
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'tool-view-container';
  }

  render(): HTMLElement {
    const t = I18nService.t();
    this.container.innerHTML = `
      <div class="tool-header-section">
        <h1 class="tool-view-title">${t.compressTool.title}</h1>
        <p class="tool-view-desc">${t.compressTool.subtitle}</p>
      </div>

      <div class="tool-body">
        ${!this.file ? `<div id="dropzone-slot"></div>` : `
          <div class="compress-workspace">
            <div class="file-summary-bar">
              <div class="file-info-col">
                <span class="file-name-highlight">${this.file.name}</span>
                <span class="file-pages-badge">სულ: ${this.pageCount} გვერდი</span>
                <span class="file-size-badge">${this.formatBytes(this.file.size)}</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="change-file-btn" ${this.isProcessing ? 'disabled' : ''}>
                ${t.actions.reset}
              </button>
            </div>

            <!-- Compression Level Selector -->
            <div class="compress-levels-card">
              <h3 class="levels-heading">${t.compressTool.levelsTitle}</h3>
              <div class="levels-options-grid">
                <!-- Extreme -->
                <div class="level-option-card ${this.selectedLevel === 'extreme' ? 'active' : ''}" data-level="extreme">
                  <div class="level-card-header">
                    <span class="level-icon">🚀</span>
                    <span class="level-badge">${t.compressTool.levels.extreme.badge}</span>
                  </div>
                  <h4 class="level-title">${t.compressTool.levels.extreme.title}</h4>
                  <p class="level-desc">${t.compressTool.levels.extreme.desc}</p>
                </div>

                <!-- Recommended -->
                <div class="level-option-card ${this.selectedLevel === 'recommended' ? 'active' : ''}" data-level="recommended">
                  <div class="level-card-header">
                    <span class="level-icon">⚖️</span>
                    <span class="level-badge badge-popular">${t.compressTool.levels.recommended.badge}</span>
                  </div>
                  <h4 class="level-title">${t.compressTool.levels.recommended.title}</h4>
                  <p class="level-desc">${t.compressTool.levels.recommended.desc}</p>
                </div>

                <!-- Low -->
                <div class="level-option-card ${this.selectedLevel === 'low' ? 'active' : ''}" data-level="low">
                  <div class="level-card-header">
                    <span class="level-icon">✨</span>
                    <span class="level-badge">${t.compressTool.levels.low.badge}</span>
                  </div>
                  <h4 class="level-title">${t.compressTool.levels.low.title}</h4>
                  <p class="level-desc">${t.compressTool.levels.low.desc}</p>
                </div>
              </div>
            </div>

            <!-- Real-time Progress Bar -->
            ${this.isProcessing ? `
              <div class="compress-progress-card">
                <div class="progress-info-row">
                  <span class="progress-text-label">
                    ${t.compressTool.progressText
                      .replace('{current}', this.progressCurrent.toString())
                      .replace('{total}', this.progressTotal.toString())
                      .replace('{percent}', this.getProgressPercent().toString())}
                  </span>
                  <span class="progress-percent-badge">${this.getProgressPercent()}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-bar-fill" style="width: ${this.getProgressPercent()}%;"></div>
                </div>
              </div>
            ` : ''}

            <!-- Result Comparison Card -->
            ${this.result ? `
              <div class="compress-result-card">
                <div class="result-card-header">
                  <span class="result-success-title">${t.compressTool.resultSuccess}</span>
                  <span class="savings-tag">
                    ${t.compressTool.savedBadge
                      .replace('{percent}', this.result.savedPercentage.toString())
                      .replace('{savedSize}', this.formatBytes(this.result.savedBytes))}
                  </span>
                </div>

                <div class="comparison-stats-row">
                  <div class="stat-box">
                    <span class="stat-label">${t.compressTool.originalSize}</span>
                    <span class="stat-value stat-original">${this.formatBytes(this.result.originalSize)}</span>
                  </div>
                  <div class="stat-arrow">➔</div>
                  <div class="stat-box">
                    <span class="stat-label">${t.compressTool.compressedSize}</span>
                    <span class="stat-value stat-compressed">${this.formatBytes(this.result.newSize)}</span>
                  </div>
                </div>

                <div class="result-action-row">
                  <button class="btn btn-primary btn-lg" id="download-compressed-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ${t.compressTool.downloadBtn}
                  </button>
                </div>
              </div>
            ` : ''}

            ${!this.result && !this.isProcessing ? `
              <div class="tool-action-bar">
                <button class="btn btn-primary btn-lg" id="start-compress-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                  ${t.compressTool.compressBtn}
                </button>
              </div>
            ` : ''}
          </div>
        `}
      </div>
    `;

    if (!this.file) {
      this.renderDropzone();
    } else {
      this.attachEvents();
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
      NotificationService.warning('გთხოვთ, აირჩიოთ PDF ფაილი');
      return;
    }

    this.file = file;
    this.arrayBuffer = await file.arrayBuffer();
    this.pageCount = await PDFRenderService.getPageCount(this.arrayBuffer);
    this.result = null;
    this.isProcessing = false;

    this.render();
  }

  private attachEvents() {
    this.container.querySelector('#change-file-btn')?.addEventListener('click', () => {
      this.file = null;
      this.arrayBuffer = null;
      this.pageCount = 0;
      this.result = null;
      this.isProcessing = false;
      this.render();
    });

    this.container.querySelectorAll('.level-option-card').forEach(card => {
      card.addEventListener('click', () => {
        if (this.isProcessing) return;
        const level = card.getAttribute('data-level') as CompressLevel;
        if (level) {
          this.selectedLevel = level;
          this.result = null;
          this.render();
        }
      });
    });

    this.container.querySelector('#start-compress-btn')?.addEventListener('click', () => {
      this.startCompression();
    });

    this.container.querySelector('#download-compressed-btn')?.addEventListener('click', () => {
      if (this.result && this.file) {
        const base = this.file.name.replace(/\.pdf$/i, '');
        PDFService.downloadBlob(this.result.bytes, `${base}_compressed.pdf`);
      }
    });
  }

  private async startCompression() {
    if (!this.file || !this.arrayBuffer) return;

    try {
      this.isProcessing = true;
      this.progressCurrent = 0;
      this.progressTotal = this.pageCount;
      this.result = null;
      this.render();

      const result = await PDFService.compressPdf(
        this.arrayBuffer,
        this.selectedLevel,
        (current, total) => {
          this.progressCurrent = current;
          this.progressTotal = total;
          this.updateProgressBar();
        }
      );

      this.result = result;
      this.isProcessing = false;
      NotificationService.success(I18nService.t().compressTool.successMessage);

      // Automatically trigger download
      const base = this.file.name.replace(/\.pdf$/i, '');
      PDFService.downloadBlob(result.bytes, `${base}_compressed.pdf`);

      this.render();
    } catch (err) {
      console.error('Compression error:', err);
      this.isProcessing = false;
      NotificationService.error(I18nService.t().notifications.genericError);
      this.render();
    }
  }

  private updateProgressBar() {
    const textEl = this.container.querySelector('.progress-text-label');
    const badgeEl = this.container.querySelector('.progress-percent-badge');
    const fillEl = this.container.querySelector('.progress-bar-fill') as HTMLElement;

    const percent = this.getProgressPercent();
    const t = I18nService.t();

    if (textEl) {
      textEl.textContent = t.compressTool.progressText
        .replace('{current}', this.progressCurrent.toString())
        .replace('{total}', this.progressTotal.toString())
        .replace('{percent}', percent.toString());
    }
    if (badgeEl) {
      badgeEl.textContent = `${percent}%`;
    }
    if (fillEl) {
      fillEl.style.width = `${percent}%`;
    }
  }

  private getProgressPercent(): number {
    if (this.progressTotal === 0) return 0;
    return Math.min(100, Math.round((this.progressCurrent / this.progressTotal) * 100));
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
