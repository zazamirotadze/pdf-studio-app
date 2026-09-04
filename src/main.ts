import './style.css';
import { I18nService } from './i18n/translations';
import type { ToolId } from './types';
import { HeaderComponent } from './components/header';
import { MergeToolComponent } from './components/merge-tool';
import { SplitToolComponent } from './components/split-tool';
import { ExtractImagesToolComponent } from './components/extract-images-tool';
import { CompressToolComponent } from './components/compress-tool';

class App {
  private appRoot: HTMLElement;
  private currentTool: ToolId = 'merge';
  private headerComponent: HeaderComponent;

  constructor() {
    this.appRoot = document.querySelector<HTMLDivElement>('#app')!;
    this.headerComponent = new HeaderComponent((toolId) => this.navigateTo(toolId));

    // Restore saved theme
    const savedTheme = localStorage.getItem('pdf_app_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-theme');
    }

    // Subscribe to language change to re-render
    I18nService.subscribe(() => {
      this.render();
    });

    this.render();
  }

  private navigateTo(toolId: ToolId) {
    this.currentTool = toolId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  private render() {
    this.appRoot.innerHTML = '';

    // Update SEO meta and title according to active language
    const lang = I18nService.getLang();
    document.documentElement.lang = lang;
    if (lang === 'ka') {
      document.title = 'PDF Studio — PDF ფაილების გაერთიანება, დაშლა, შეკუმშვა და სურათების ამოღება ონლაინ';
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'უფასო ონლაინ PDF ხელსაწყოები: PDF ფაილების გაერთიანება გვერდების დიაპაზონით, PDF-ის დაშლა ნაწილებად, PDF-ის შეკუმშვა და სურათების ამოღება. 100% ლოკალური და უსაფრთხო ბრაუზერში.');
    } else {
      document.title = 'PDF Studio — Merge, Split, Compress & Extract Images from PDF Online';
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'Free online PDF tools: Merge PDF files with page ranges, split PDF by custom ranges, compress PDF, and extract images. 100% private and client-side.');
    }

    // Render Header
    this.headerComponent.setActiveTool(this.currentTool);
    this.appRoot.appendChild(this.headerComponent.render());

    // Main content wrapper
    const mainWrapper = document.createElement('main');
    mainWrapper.className = 'app-main-content';

    let currentView: HTMLElement;

    switch (this.currentTool) {
      case 'split':
        currentView = new SplitToolComponent().render();
        break;
      case 'extract-images':
        currentView = new ExtractImagesToolComponent().render();
        break;
      case 'compress':
        currentView = new CompressToolComponent().render();
        break;
      case 'merge':
      default:
        currentView = new MergeToolComponent().render();
        break;
    }

    mainWrapper.appendChild(currentView);
    this.appRoot.appendChild(mainWrapper);

    // Render Footer
    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    const t = I18nService.t();
    footer.innerHTML = `
      <div class="footer-container">
        <p class="footer-copyright">© ${new Date().getFullYear()} ${t.appTitle}. 100% Client-Side PDF Tools.</p>
        <p class="footer-note">${t.privacyNotice}</p>
      </div>
    `;
    this.appRoot.appendChild(footer);
  }
}

// Start application
new App();
