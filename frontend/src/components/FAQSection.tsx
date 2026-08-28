import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'Do you upload my PDF documents to your servers?',
    a: 'No. Never. DocSweep runs 100% locally in your web browser memory using client-side Web Workers and PDF.js. Your sensitive contracts, invoices, and private data never touch our servers.',
  },
  {
    q: 'How many PDFs can I search at once?',
    a: 'You can search anywhere from 1 to 500+ PDFs simultaneously in seconds. The free tier lets you search up to 10 PDFs without paying a single cent. For larger batches, you can unlock higher limits with an affordable one-time pass.',
  },
  {
    q: 'What is the "Document Audit" feature?',
    a: 'Document Audit allows you to define multiple criteria (e.g. "GDPR", "Automatic Renewal", "Governing Law") and see a clean compliance matrix showing exactly which contracts contain or are missing each clause.',
  },
  {
    q: 'Can I search scanned PDF files without text layers?',
    a: 'DocSweep detects scanned or image-only PDFs and flags them for you. Text search works instantly on all standard PDFs with text layers (over 95% of digital contracts and export documents).',
  },
  {
    q: 'Can I download matching or missing PDFs directly as a ZIP archive?',
    a: 'Yes! After searching or auditing, you can click one button to generate a ZIP archive containing all matching documents (or all documents missing a critical clause) directly in your browser.',
  },
  {
    q: 'Do I need to create an account or subscribe?',
    a: 'No account, no passwords, no recurring subscriptions. DocSweep is designed for zero friction: drag & drop, search, export, and you are done.',
  },
];

export const FAQSection: React.FC = () => {
  const { t, lang } = useDocuments();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const currentFaqs = lang === 'it' ? [
    {
      q: 'I miei file PDF vengono caricati su un server?',
      a: 'No, mai. DocSweep viene eseguito al 100% nel tuo browser. I tuoi contratti riservati e dati personali non lasciano mai il tuo computer.',
    },
    {
      q: 'Quanti PDF posso cercare contemporaneamente?',
      a: 'Puoi cercare da 1 a oltre 500 PDF alla volta. Il piano gratuito ti permette di cercare fino a 10 PDF senza costi. Per volumi maggiori puoi sbloccare un pass una tantum.',
    },
    {
      q: 'Cos\'è la funzione "Document Audit"?',
      a: 'L\'audit ti permette di definire più requisiti contemporaneamente (es. "GDPR", "Diritto di recesso", "Rinnovo automatico") e vedere una tabella con spunte ✓/✗ per capire subito quali documenti sono conformi e quali richiedono controllo.',
    },
    {
      q: 'Posso cercare in file PDF scansionati?',
      a: 'DocSweep rileva i PDF scansionati (senza testo selezionabile) e te li segnala. La ricerca funziona istantaneamente su tutti i PDF digitali tradizionali.',
    },
    {
      q: 'Posso scaricare i PDF trovati in un archivio ZIP?',
      a: 'Sì! Puoi scaricare in un unico file ZIP generato nel tuo browser tutti i PDF in cui è stata trovata la parola oppure tutti quelli a cui manca una clausola.',
    },
    {
      q: 'Devo creare un account o un abbonamento?',
      a: 'Nessun account, nessuna password, nessun abbonamento ricorrente. Paghi solo se hai bisogno di sbloccare elaborazioni batch elevate.',
    },
  ] : FAQS;

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>{t('faqHeaderTag')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t('faqHeaderTitle')}
        </h2>
      </div>

      <div className="space-y-3">
        {currentFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-100"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brand-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
