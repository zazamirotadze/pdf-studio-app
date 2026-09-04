export type Language = 'ka' | 'en';

export const translations = {
  ka: {
    appTitle: 'PDF Studio',
    tagline: 'სწრაფი, მარტივი და 100% უსაფრთხო PDF ხელსაწყოები',
    privacyNotice: '🔒 ფაილები მუშავდება მხოლოდ თქვენს ბრაუზერში და არ იგზავნება სერვერზე.',

    nav: {
      merge: 'PDF შერწყმა',
      split: 'PDF დაშლა',
      extractImages: 'სურათების ამოღება'
    },

    dropzone: {
      dragHere: 'გადმოათრიეთ PDF ფაილი აქ',
      dragMultipleHere: 'გადმოათრიეთ PDF ფაილები აქ (ან ერთიდაიგივე რამდენჯერმე)',
      orClick: 'ან დააჭირეთ ასატვირთად',
      supported: 'მხარდაჭერილია: PDF დოკუმენტები',
      addMore: '+ კიდევ დამატება',
      clearAll: 'ყველას გასუფთავება'
    },

    actions: {
      download: 'ჩამოტვირთვა',
      downloadZip: 'ყველას გადმოწერა (ZIP)',
      processing: 'მუშავდება...',
      delete: 'წაშლა',
      duplicate: 'დუბლირება',
      moveUp: 'ზემოთ',
      moveDown: 'ქვემოთ',
      reset: 'ფაილის შეცვლა',
      addRange: '+ დიაპაზონის დამატება',
      removeRange: 'წაშლა'
    },

    mergeTool: {
      title: 'PDF ფაილების შერწყმა',
      subtitle: 'ატვირთეთ რამდენიმე ფაილი (ან ერთიდაიგივე რამდენჯერმე), დაალაგეთ თანმიმდევრობა და სურვილისამებრ მონიშნეთ კონკრეტული გვერდები.',
      customRangeCheckbox: 'გვერდების დიაპაზონის მითითება',
      fromPage: 'დან:',
      toPage: 'მდე:',
      totalPages: 'სულ: {total} გვ.',
      mergeBtn: 'PDF-ების შერწყმა',
      minFilesError: 'გთხოვთ ატვირთოთ მინიმუმ 1 ფაილი დასამერჯად.',
      invalidRangeError: 'გვერდების დიაპაზონი არასწორია ფაილისთვის: {name} (გვერდები უნდა იყოს 1-დან {total}-მდე)',
      successMessage: 'დოკუმენტები წარმატებით შეირწყა!'
    },

    splitTool: {
      title: 'PDF ფაილის დაშლა დიაპაზონებით',
      subtitle: 'დაამატეთ სასურველი რაოდენობის დიაპაზონები (+ და - ღილაკებით) და შექმენით შესაბამისი რაოდენობის ცალკეული PDF ფაილები.',
      partLabel: 'ნაწილი {index}:',
      fromLabel: 'დან გვერდი:',
      toLabel: 'მდე გვერდი:',
      splitBtn: 'PDF-ის დაშლა ({count} ნაწილი)',
      successMessage: 'PDF წარმატებით დაიშალა!',
      invalidRange: 'შეცდომა {index} ნაწილში: გვერდები უნდა იყოს 1-დან {total}-მდე და "დან" უნდა იყოს ნაკლები ან ტოლი "მდე"-ზე.'
    },

    extractTool: {
      title: 'სურათების ამოღება PDF-იდან',
      subtitle: 'ამოიღეთ დოკუმენტში ჩაშენებული ყველა სურათი და ფოტო ორიგინალი გარჩევადობითა და ხარისხით.',
      extractBtn: 'სურათების ამოღება',
      foundCount: 'ნაპოვნია {count} სურათი',
      noImagesFound: 'ამ PDF დოკუმენტში ჩაშენებული სურათები არ მოიძებნა.',
      pageLabel: 'გვერდი {page}',
      downloadSingle: 'გადმოწერა',
      downloadAllZip: 'ყველა სურათის გადმოწერა (ZIP)',
      successMessage: 'სურათები წარმატებით ამოიღო!'
    },

    notifications: {
      fileLoaded: 'ფაილი წარმატებით ჩაიტვირთა',
      errorLoading: 'ფაილის წაკითხვის შეცდომა',
      genericError: 'დაფიქსირდა შეცდომა ოპერაციისას'
    }
  },

  en: {
    appTitle: 'PDF Studio',
    tagline: 'Fast, Simple & 100% Private In-Browser PDF Tools',
    privacyNotice: '🔒 Privacy Guaranteed: All processing happens in your browser. No files are uploaded to any server.',

    nav: {
      merge: 'Merge PDF',
      split: 'Split PDF',
      extractImages: 'Extract Images'
    },

    dropzone: {
      dragHere: 'Drag & drop PDF file here',
      dragMultipleHere: 'Drag & drop PDF files here (or same file multiple times)',
      orClick: 'or click to browse files',
      supported: 'Supported: PDF documents',
      addMore: '+ Add More Files',
      clearAll: 'Clear All'
    },

    actions: {
      download: 'Download',
      downloadZip: 'Download All (ZIP)',
      processing: 'Processing...',
      delete: 'Delete',
      duplicate: 'Duplicate',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      reset: 'Change File',
      addRange: '+ Add Range',
      removeRange: 'Remove'
    },

    mergeTool: {
      title: 'Merge PDF Files',
      subtitle: 'Upload multiple files (or the same file multiple times), reorder them, and optionally select specific page ranges.',
      customRangeCheckbox: 'Specify page range',
      fromPage: 'From:',
      toPage: 'To:',
      totalPages: 'Total: {total} pages',
      mergeBtn: 'Merge PDFs',
      minFilesError: 'Please upload at least 1 PDF file to merge.',
      invalidRangeError: 'Invalid page range for file: {name} (must be between 1 and {total})',
      successMessage: 'Documents merged successfully!'
    },

    splitTool: {
      title: 'Split PDF by Custom Ranges',
      subtitle: 'Add as many range groups as needed (+ and - buttons) to generate exact PDF files for each range.',
      partLabel: 'Part {index}:',
      fromLabel: 'From page:',
      toLabel: 'To page:',
      splitBtn: 'Split PDF ({count} parts)',
      successMessage: 'PDF split successfully!',
      invalidRange: 'Error in part {index}: pages must be between 1 and {total} with "From" <= "To".'
    },

    extractTool: {
      title: 'Extract Images from PDF',
      subtitle: 'Extract all embedded images and photos from the PDF document in their original resolution and quality.',
      extractBtn: 'Extract Images',
      foundCount: 'Found {count} images',
      noImagesFound: 'No embedded images found in this PDF document.',
      pageLabel: 'Page {page}',
      downloadSingle: 'Download',
      downloadAllZip: 'Download All (ZIP)',
      successMessage: 'Images extracted successfully!'
    },

    notifications: {
      fileLoaded: 'File loaded successfully',
      errorLoading: 'Error loading file',
      genericError: 'An error occurred during operation'
    }
  }
};

export class I18nService {
  private static currentLang: Language = (localStorage.getItem('pdf_app_lang') as Language) || 'ka';
  private static listeners: Array<(lang: Language) => void> = [];

  static getLang(): Language {
    return this.currentLang;
  }

  static setLang(lang: Language) {
    this.currentLang = lang;
    localStorage.setItem('pdf_app_lang', lang);
    this.listeners.forEach(cb => cb(lang));
  }

  static t(): typeof translations['ka'] {
    return translations[this.currentLang];
  }

  static subscribe(callback: (lang: Language) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}
