import { I18nService } from '../i18n/translations';
import type { ToolId } from '../types';

export class HeaderComponent {
  private activeTool: ToolId = 'merge';
  private onToolChangeCallback: (toolId: ToolId) => void;

  constructor(onToolChange: (toolId: ToolId) => void) {
    this.onToolChangeCallback = onToolChange;
  }

  setActiveTool(toolId: ToolId) {
    this.activeTool = toolId;
  }

  render(): HTMLElement {
    const t = I18nService.t();
    const currentLang = I18nService.getLang();

    const header = document.createElement('header');
    header.className = 'app-header';

    header.innerHTML = `
      <div class="header-container">
        <div class="header-brand" id="brand-logo" role="button" tabindex="0">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">${t.appTitle}</span>
          </div>
        </div>

        <nav class="header-nav-tabs">
          <button class="nav-tab-btn ${this.activeTool === 'merge' ? 'active' : ''}" data-tool="merge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
            <span>${t.nav.merge}</span>
          </button>
          <button class="nav-tab-btn ${this.activeTool === 'split' ? 'active' : ''}" data-tool="split">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            <span>${t.nav.split}</span>
          </button>
          <button class="nav-tab-btn ${this.activeTool === 'extract-images' ? 'active' : ''}" data-tool="extract-images">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>${t.nav.extractImages}</span>
          </button>
        </nav>

        <div class="header-actions">
          <div class="lang-switch-group">
            <button class="lang-btn ${currentLang === 'ka' ? 'active' : ''}" data-lang="ka">GE</button>
            <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
          </div>
          <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle Theme" aria-label="Toggle Theme">
            <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Tab buttons
    header.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = (e.currentTarget as HTMLElement).getAttribute('data-tool') as ToolId;
        if (tool) {
          this.onToolChangeCallback(tool);
        }
      });
    });

    header.querySelector('#brand-logo')?.addEventListener('click', () => {
      this.onToolChangeCallback('merge');
    });

    header.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = (e.currentTarget as HTMLElement).getAttribute('data-lang') as 'ka' | 'en';
        if (lang) {
          I18nService.setLang(lang);
        }
      });
    });

    header.querySelector('#theme-toggle-btn')?.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('pdf_app_theme', isDark ? 'dark' : 'light');
    });

    return header;
  }
}
