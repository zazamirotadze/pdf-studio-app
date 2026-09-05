export type Language = 'ka' | 'en';

export const translations = {
  ka: {
    appTitle: 'PDF Studio',
    tagline: 'სწრაფი, მარტივი და 100% უსაფრთხო PDF ხელსაწყოები',
    privacyNotice: '🔒 ფაილები მუშავდება მხოლოდ თქვენს ბრაუზერში და არ იგზავნება სერვერზე.',
    footerRights: 'ყველა უფლება დაცულია. 100% ლოკალური PDF ხელსაწყოები.',
    themeToggle: 'თემის შეცვლა',

    common: {
      totalPages: 'სულ: {total} გვერდი',
      pagesCount: '({count} გვ.)',
      pageSingle: '{count} გვერდი',
      selectPdfWarning: 'გთხოვთ, აირჩიოთ PDF ფაილი'
    },

    nav: {
      merge: 'PDF გაერთიანება',
      split: 'PDF დაშლა',
      extractImages: 'სურათების ამოღება',
      compress: 'PDF შეკუმშვა'
    },

    dropzone: {
      dragHere: 'ჩააგდეთ PDF ფაილი აქ',
      dragMultipleHere: 'ჩააგდეთ PDF ფაილები აქ (შეგიძლიათ ერთი და იგივე ფაილი რამდენჯერმე)',
      orClick: 'ან დააჭირეთ ფაილის ასარჩევად',
      supported: 'მხარდაჭერილია: PDF დოკუმენტები',
      addMore: '+ ფაილის დამატება',
      clearAll: 'სიის გასუფთავება'
    },

    actions: {
      download: 'ჩამოტვირთვა',
      downloadZip: 'ყველას ჩამოტვირთვა (ZIP)',
      processing: 'მიმდინარეობს დამუშავება...',
      delete: 'წაშლა',
      duplicate: 'დუბლირება',
      moveUp: 'ზემოთ გადატანა',
      moveDown: 'ქვემოთ გადატანა',
      reset: 'ფაილის შეცვლა',
      addRange: '+ დიაპაზონის დამატება',
      removeRange: 'დიაპაზონის წაშლა'
    },

    mergeTool: {
      title: 'PDF ფაილების გაერთიანება',
      subtitle: 'ატვირთეთ რამდენიმე ფაილი (ან ერთი და იგივე დოკუმენტი რამდენჯერმე), განსაზღვრეთ თანმიმდევრობა და სურვილისამებრ მიუთითეთ გვერდების დიაპაზონი.',
      filesToMergeBadge: '{count} ფაილი გასაერთიანებლად',
      reorderTooltip: 'თანმიმდევრობის შეცვლა',
      customRangeCheckbox: 'გვერდების დიაპაზონის მითითება',
      fromPage: 'დან:',
      toPage: 'მდე:',
      totalPages: 'სულ: {total} გვ.',
      mergeBtn: 'PDF-ების გაერთიანება',
      minFilesError: 'გთხოვთ, ატვირთოთ მინიმუმ 1 ფაილი გასაერთიანებლად.',
      invalidRangeError: 'გვერდების დიაპაზონი არასწორია ფაილისთვის: «{name}» (გვერდები უნდა იყოს 1-დან {total}-მდე).',
      successMessage: 'დოკუმენტები წარმატებით გაერთიანდა!'
    },

    splitTool: {
      title: 'PDF ფაილის დაშლა დიაპაზონებით',
      subtitle: 'დაამატეთ სასურველი რაოდენობის დიაპაზონები (+ და - ღილაკებით) და შექმენით შესაბამისი რაოდენობის ცალკეული PDF ფაილები.',
      rangesTitle: 'დაშლის დიაპაზონები',
      partLabel: 'ნაწილი {index}:',
      fromLabel: 'გვერდიდან:',
      toLabel: 'გვერდამდე:',
      generatedTitle: '🎉 შექმნილი PDF ფაილები ({count}):',
      splitBtn: 'PDF-ის დაშლა ({count} ნაწილი)',
      successMessage: 'PDF დოკუმენტი წარმატებით დაიშალა!',
      invalidRange: 'შეცდომა {index}-ე ნაწილში: გვერდების ნომრები უნდა იყოს 1-დან {total}-მდე და საწყისი გვერდი არ უნდა აღემატებოდეს საბოლოოს.'
    },

    extractTool: {
      title: 'სურათების ამოღება PDF-იდან',
      subtitle: 'დოკუმენტიდან ყველა ჩაშენებული სურათისა და ფოტოს ამოღება ორიგინალი გარჩევადობითა და ხარისხით.',
      startPrompt: 'დააჭირეთ ღილაკს დოკუმენტიდან ყველა ჩაშენებული სურათისა და გრაფიკის ამოსაღებად.',
      extractBtn: 'სურათების ამოღება',
      foundCount: 'ნაპოვნია {count} სურათი',
      noImagesFound: 'ამ PDF დოკუმენტში ჩაშენებული სურათები არ მოიძებნა.',
      pageLabel: 'გვერდი {page}',
      downloadSingle: 'ჩამოტვირთვა',
      downloadAllZip: 'ყველა სურათის ჩამოტვირთვა (ZIP)',
      successMessage: 'სურათები წარმატებით ამოღებულია!'
    },

    compressTool: {
      title: 'PDF ფაილის შეკუმშვა',
      subtitle: 'შეამცირეთ PDF დოკუმენტის ზომა ხარისხის მაქსიმალური შენარჩუნებით. 100% უფასო და უსაფრთხო.',
      levelsTitle: 'აირჩიეთ შეკუმშვის დონე:',
      levels: {
        extreme: {
          title: 'მაქსიმალური შეკუმშვა',
          badge: 'უმცირესი ზომა',
          desc: 'ფაილის ზომის უდიდესი შემცირება. საუკეთესოა ელ-ფოსტით (Gmail/Outlook) გასაგზავნად.'
        },
        recommended: {
          title: 'რეკომენდებული შეკუმშვა',
          badge: 'ოპტიმალური',
          desc: 'იდეალური ბალანსი გამოსახულების კარგ ხარისხსა და მცირე ზომას შორის.'
        },
        low: {
          title: 'მცირე შეკუმშვა',
          badge: 'მაღალი ხარისხი',
          desc: 'მაღალი ვიზუალური ხარისხის შენარჩუნება ზომის მსუბუქი ოპტიმიზაციით.'
        }
      },
      compressBtn: 'PDF-ის შეკუმშვა',
      progressText: 'მიმდინარეობს გვერდის დამუშავება: {current} / {total} ({percent}%)',
      resultSuccess: '🎉 PDF დოკუმენტი წარმატებით შეიკუმშა!',
      originalSize: 'საწყისი ზომა',
      compressedSize: 'ახალი ზომა',
      savedBadge: 'დაზოგილია {percent}% ({savedSize})',
      downloadBtn: 'შეკუმშული PDF-ის ჩამოტვირთვა',
      successMessage: 'PDF წარმატებით შეიკუმშა!'
    },

    notifications: {
      fileLoaded: 'ფაილი წარმატებით ჩაიტვირთა',
      errorLoading: 'ფაილის წაკითხვისას დაფიქსირდა შეცდომა',
      genericError: 'ოპერაციის შესრულებისას დაფიქსირდა შეცდომა',
      selectPdfWarning: 'გთხოვთ, აირჩიოთ PDF ფაილი'
    }
  },

  en: {
    appTitle: 'PDF Studio',
    tagline: 'Fast, Simple & 100% Private In-Browser PDF Tools',
    privacyNotice: '🔒 Privacy Guaranteed: All processing happens in your browser. No files are uploaded to any server.',
    footerRights: 'All rights reserved. 100% Client-Side PDF Tools.',
    themeToggle: 'Toggle Theme',

    common: {
      totalPages: 'Total: {total} pages',
      pagesCount: '({count} pages)',
      pageSingle: '{count} page',
      selectPdfWarning: 'Please select a valid PDF file'
    },

    nav: {
      merge: 'Merge PDF',
      split: 'Split PDF',
      extractImages: 'Extract Images',
      compress: 'Compress PDF'
    },

    dropzone: {
      dragHere: 'Drop PDF file here',
      dragMultipleHere: 'Drop PDF files here (or the same file multiple times)',
      orClick: 'or click to browse files',
      supported: 'Supported: PDF documents',
      addMore: '+ Add More Files',
      clearAll: 'Clear List'
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
      removeRange: 'Remove Range'
    },

    mergeTool: {
      title: 'Merge PDF Files',
      subtitle: 'Upload multiple files (or the same file multiple times), reorder them, and optionally select specific page ranges.',
      filesToMergeBadge: '{count} file(s) to merge',
      reorderTooltip: 'Reorder',
      customRangeCheckbox: 'Specify page range',
      fromPage: 'From:',
      toPage: 'To:',
      totalPages: 'Total: {total} pages',
      mergeBtn: 'Merge PDFs',
      minFilesError: 'Please upload at least 1 PDF file to merge.',
      invalidRangeError: 'Invalid page range for file: «{name}» (must be between 1 and {total}).',
      successMessage: 'Documents merged successfully!'
    },

    splitTool: {
      title: 'Split PDF by Custom Ranges',
      subtitle: 'Add as many range groups as needed (+ and - buttons) to generate exact PDF files for each range.',
      rangesTitle: 'Split Ranges',
      partLabel: 'Part {index}:',
      fromLabel: 'From page:',
      toLabel: 'To page:',
      generatedTitle: '🎉 Created PDF Files ({count}):',
      splitBtn: 'Split PDF ({count} parts)',
      successMessage: 'PDF split successfully!',
      invalidRange: 'Error in part {index}: page numbers must be between 1 and {total} and "From" cannot exceed "To".'
    },

    extractTool: {
      title: 'Extract Images from PDF',
      subtitle: 'Extract all embedded images and photos from the PDF document in their original resolution and quality.',
      startPrompt: 'Click the button to extract all embedded images and graphics from the document.',
      extractBtn: 'Extract Images',
      foundCount: 'Found {count} images',
      noImagesFound: 'No embedded images found in this PDF document.',
      pageLabel: 'Page {page}',
      downloadSingle: 'Download',
      downloadAllZip: 'Download All (ZIP)',
      successMessage: 'Images extracted successfully!'
    },

    compressTool: {
      title: 'Compress PDF File',
      subtitle: 'Reduce the file size of your PDF while maintaining optimal visual quality. 100% free & secure.',
      levelsTitle: 'Choose Compression Level:',
      levels: {
        extreme: {
          title: 'Extreme Compression',
          badge: 'Smallest size',
          desc: 'Maximum file size reduction. Best for emailing or slow connections.'
        },
        recommended: {
          title: 'Recommended Compression',
          badge: 'Optimal',
          desc: 'Best balance between good image quality and small file size.'
        },
        low: {
          title: 'Low Compression',
          badge: 'High quality',
          desc: 'Maintains high visual quality with moderate size reduction.'
        }
      },
      compressBtn: 'Compress PDF',
      progressText: 'Processing page: {current} / {total} ({percent}%)',
      resultSuccess: '🎉 PDF successfully compressed!',
      originalSize: 'Original size',
      compressedSize: 'Compressed size',
      savedBadge: 'Saved {percent}% ({savedSize})',
      downloadBtn: 'Download Compressed PDF',
      successMessage: 'PDF compressed successfully!'
    },

    notifications: {
      fileLoaded: 'File loaded successfully',
      errorLoading: 'Error loading file',
      genericError: 'An error occurred during operation',
      selectPdfWarning: 'Please select a valid PDF file'
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
