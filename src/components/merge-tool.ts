import { I18nService } from '../i18n/translations';
import type { MergeFileItem } from '../types';
import { DropzoneComponent } from './dropzone';
import { PDFService } from '../services/pdf-service';
import { PDFRenderService } from '../services/pdf-render.service';
import { NotificationService } from '../services/notification.service';

export class MergeToolComponent {
  private files: MergeFileItem[] = [];
  private isProcessing = false;
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'tool-view-container';
  }

  render(): HTMLElement {
    const t = I18nService.t();
    this.container.innerHTML = `
      <div class="tool-header-section">
        <h1 class="tool-view-title">${t.mergeTool.title}</h1>
        <p class="tool-view-desc">${t.mergeTool.subtitle}</p>
      </div>

      <div class="tool-body">
        <div id="dropzone-slot"></div>
        <div id="files-list-slot" class="files-list-wrapper"></div>
        <div id="actions-slot" class="tool-action-bar"></div>
      </div>
    `;

    this.renderDropzone();
    this.renderFilesList();
    this.renderActions();

    return this.container;
  }

  private renderDropzone() {
    const slot = this.container.querySelector('#dropzone-slot');
    if (!slot) return;

    slot.innerHTML = '';
    const dropzone = new DropzoneComponent({
      accept: '.pdf,application/pdf',
      multiple: true,
      onFilesSelected: (newFiles) => this.handleFilesAdded(newFiles)
    });
    slot.appendChild(dropzone.render());
  }

  private async handleFilesAdded(newFiles: File[]) {
    const pdfFiles = newFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      NotificationService.warning(I18nService.t().notifications.selectPdfWarning);
      return;
    }

    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pageCount = await PDFRenderService.getPageCount(arrayBuffer);
      const thumb = await PDFRenderService.renderPageThumbnail(arrayBuffer, 1, 0.4);

      this.files.push({
        id: `merge-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
        thumbnailUrl: thumb,
        arrayBuffer,
        useCustomRange: false,
        pageFrom: 1,
        pageTo: pageCount
      });
    }

    NotificationService.success(I18nService.t().notifications.fileLoaded);
    this.renderFilesList();
    this.renderActions();
  }

  private renderFilesList() {
    const slot = this.container.querySelector('#files-list-slot');
    if (!slot) return;

    if (this.files.length === 0) {
      slot.innerHTML = '';
      return;
    }

    const t = I18nService.t();
    slot.innerHTML = `
      <div class="files-header-info">
        <span class="badge-count">${t.mergeTool.filesToMergeBadge.replace('{count}', this.files.length.toString())}</span>
        <button class="btn-text-danger" id="clear-all-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          ${t.dropzone.clearAll}
        </button>
      </div>
      <div class="merge-vertical-list" id="merge-items-container"></div>
    `;

    slot.querySelector('#clear-all-btn')?.addEventListener('click', () => {
      this.files = [];
      this.renderFilesList();
      this.renderActions();
    });

    const listContainer = slot.querySelector('#merge-items-container') as HTMLElement;

    this.files.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'merge-item-row';
      itemEl.draggable = true;
      itemEl.dataset.index = index.toString();

      const sizeFormatted = (item.size / (1024 * 1024)).toFixed(2) + ' MB';

      itemEl.innerHTML = `
        <div class="row-drag-handle" title="${t.mergeTool.reorderTooltip}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
          <span class="row-number-pill">${index + 1}</span>
        </div>

        <div class="row-thumb-box">
          ${item.thumbnailUrl ? `<img src="${item.thumbnailUrl}" alt="${item.name}" />` : `
            <div class="thumb-placeholder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
          `}
        </div>

        <div class="row-main-content">
          <div class="row-file-info">
            <span class="row-file-name" title="${item.name}">${item.name}</span>
            <div class="row-file-meta">
              <span class="meta-tag total-tag">${t.mergeTool.totalPages.replace('{total}', item.pageCount.toString())}</span>
              <span class="meta-tag size-tag">${sizeFormatted}</span>
            </div>
          </div>

          <!-- Page Range Selection Section -->
          <div class="row-range-config">
            <label class="range-checkbox-label">
              <input type="checkbox" class="range-toggle-checkbox" id="range-toggle-${item.id}" ${item.useCustomRange ? 'checked' : ''} />
              <span>${t.mergeTool.customRangeCheckbox}</span>
            </label>

            <div class="range-inputs-box ${item.useCustomRange ? 'visible' : ''}" id="range-box-${item.id}">
              <div class="range-field">
                <span class="range-label">${t.mergeTool.fromPage}</span>
                <input 
                  type="number" 
                  class="form-control range-num-input" 
                  id="from-input-${item.id}" 
                  min="1" 
                  max="${item.pageCount}" 
                  value="${item.pageFrom}" 
                />
              </div>
              <div class="range-field">
                <span class="range-label">${t.mergeTool.toPage}</span>
                <input 
                  type="number" 
                  class="form-control range-num-input" 
                  id="to-input-${item.id}" 
                  min="1" 
                  max="${item.pageCount}" 
                  value="${item.pageTo}" 
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row-actions">
          <div class="order-buttons">
            <button class="btn-micro move-up-btn" title="${t.actions.moveUp}" ${index === 0 ? 'disabled' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <button class="btn-micro move-down-btn" title="${t.actions.moveDown}" ${index === this.files.length - 1 ? 'disabled' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
          <button class="btn-micro duplicate-btn" title="${t.actions.duplicate}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button class="btn-micro btn-danger delete-btn" title="${t.actions.delete}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;

      // Checkbox event
      const rangeCheckbox = itemEl.querySelector(`#range-toggle-${item.id}`) as HTMLInputElement;
      const rangeBox = itemEl.querySelector(`#range-box-${item.id}`) as HTMLElement;
      rangeCheckbox?.addEventListener('change', () => {
        item.useCustomRange = rangeCheckbox.checked;
        if (rangeCheckbox.checked) {
          rangeBox.classList.add('visible');
        } else {
          rangeBox.classList.remove('visible');
        }
      });

      // From / To inputs
      const fromInput = itemEl.querySelector(`#from-input-${item.id}`) as HTMLInputElement;
      fromInput?.addEventListener('input', () => {
        item.pageFrom = parseInt(fromInput.value, 10) || 1;
      });

      const toInput = itemEl.querySelector(`#to-input-${item.id}`) as HTMLInputElement;
      toInput?.addEventListener('input', () => {
        item.pageTo = parseInt(toInput.value, 10) || item.pageCount;
      });

      // Move Up / Move Down
      itemEl.querySelector('.move-up-btn')?.addEventListener('click', () => {
        if (index > 0) {
          const temp = this.files[index - 1];
          this.files[index - 1] = this.files[index];
          this.files[index] = temp;
          this.renderFilesList();
        }
      });

      itemEl.querySelector('.move-down-btn')?.addEventListener('click', () => {
        if (index < this.files.length - 1) {
          const temp = this.files[index + 1];
          this.files[index + 1] = this.files[index];
          this.files[index] = temp;
          this.renderFilesList();
        }
      });

      // Duplicate
      itemEl.querySelector('.duplicate-btn')?.addEventListener('click', () => {
        const clone: MergeFileItem = {
          ...item,
          id: `merge-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          useCustomRange: true,
          pageFrom: 1,
          pageTo: item.pageCount
        };
        this.files.splice(index + 1, 0, clone);
        this.renderFilesList();
        this.renderActions();
      });

      // Delete
      itemEl.querySelector('.delete-btn')?.addEventListener('click', () => {
        this.files.splice(index, 1);
        this.renderFilesList();
        this.renderActions();
      });

      // Drag & Drop reordering
      itemEl.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', index.toString());
        itemEl.classList.add('dragging');
      });

      itemEl.addEventListener('dragend', () => {
        itemEl.classList.remove('dragging');
      });

      itemEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        itemEl.classList.add('drag-over-row');
      });

      itemEl.addEventListener('dragleave', () => {
        itemEl.classList.remove('drag-over-row');
      });

      itemEl.addEventListener('drop', (e) => {
        e.preventDefault();
        itemEl.classList.remove('drag-over-row');
        const fromIdx = parseInt(e.dataTransfer?.getData('text/plain') || '-1', 10);
        if (fromIdx >= 0 && fromIdx !== index) {
          const [movedItem] = this.files.splice(fromIdx, 1);
          this.files.splice(index, 0, movedItem);
          this.renderFilesList();
        }
      });

      listContainer.appendChild(itemEl);
    });
  }

  private renderActions() {
    const slot = this.container.querySelector('#actions-slot');
    if (!slot) return;

    if (this.files.length === 0) {
      slot.innerHTML = '';
      return;
    }

    const t = I18nService.t();
    slot.innerHTML = `
      <div class="action-bar-content">
        <button class="btn btn-primary btn-lg" id="start-merge-btn" ${this.isProcessing ? 'disabled' : ''}>
          ${this.isProcessing ? `
            <span class="spinner"></span> ${t.actions.processing}
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
            ${t.mergeTool.mergeBtn} (${this.files.length})
          `}
        </button>
      </div>
    `;

    slot.querySelector('#start-merge-btn')?.addEventListener('click', () => this.handleMerge());
  }

  private async handleMerge() {
    if (this.files.length === 0) {
      NotificationService.warning(I18nService.t().mergeTool.minFilesError);
      return;
    }

    // Validate ranges
    for (const item of this.files) {
      if (item.useCustomRange) {
        if (item.pageFrom < 1 || item.pageTo > item.pageCount || item.pageFrom > item.pageTo) {
          NotificationService.error(
            I18nService.t().mergeTool.invalidRangeError
              .replace('{name}', item.name)
              .replace('{total}', item.pageCount.toString())
          );
          return;
        }
      }
    }

    try {
      this.isProcessing = true;
      this.renderActions();

      const itemsToMerge = this.files.map(item => {
        let indices: number[] = [];
        if (item.useCustomRange) {
          for (let p = item.pageFrom; p <= item.pageTo; p++) {
            indices.push(p - 1);
          }
        } else {
          for (let p = 1; p <= item.pageCount; p++) {
            indices.push(p - 1);
          }
        }
        return {
          arrayBuffer: item.arrayBuffer,
          pageIndices: indices
        };
      });

      const mergedBytes = await PDFService.mergePdfsWithRanges(itemsToMerge);
      PDFService.downloadBlob(mergedBytes, 'merged_document.pdf');
      NotificationService.success(I18nService.t().mergeTool.successMessage);
    } catch (err) {
      console.error('Merge error:', err);
      NotificationService.error(I18nService.t().notifications.genericError);
    } finally {
      this.isProcessing = false;
      this.renderActions();
    }
  }
}
