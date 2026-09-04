import { I18nService } from '../i18n/translations';

export interface DropzoneOptions {
  accept: string;
  multiple: boolean;
  isImages?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export class DropzoneComponent {
  private options: DropzoneOptions;

  constructor(options: DropzoneOptions) {
    this.options = options;
  }

  render(): HTMLElement {
    const t = I18nService.t();
    const container = document.createElement('div');
    container.className = 'dropzone-wrapper';

    const inputId = `file-input-${Math.random().toString(36).substring(2, 9)}`;

    container.innerHTML = `
      <div class="dropzone-area" id="drop-area">
        <input 
          type="file" 
          id="${inputId}" 
          class="dropzone-input" 
          accept="${this.options.accept}" 
          ${this.options.multiple ? 'multiple' : ''}
        />
        <div class="dropzone-content">
          <div class="dropzone-icon-bubble">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 class="dropzone-title">
            ${this.options.multiple ? t.dropzone.dragMultipleHere : t.dropzone.dragHere}
          </h3>
          <p class="dropzone-subtitle">
            <label for="${inputId}" class="dropzone-browse-link">${t.dropzone.orClick}</label>
          </p>
          <span class="dropzone-formats">
            ${t.dropzone.supported}
          </span>
        </div>
      </div>
    `;

    const dropArea = container.querySelector('#drop-area') as HTMLElement;
    const fileInput = container.querySelector(`#${inputId}`) as HTMLInputElement;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-active');
      });
    });

    dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt?.files && dt.files.length > 0) {
        const fileList = Array.from(dt.files);
        this.options.onFilesSelected(fileList);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const fileList = Array.from(fileInput.files);
        this.options.onFilesSelected(fileList);
        fileInput.value = ''; // reset to allow selecting the same file again
      }
    });

    return container;
  }
}
