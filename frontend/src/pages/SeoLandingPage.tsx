import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Sparkles, BookOpen } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { DropZone } from '../components/DropZone';
import { ProcessingProgress } from '../components/ProcessingProgress';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { FAQSection } from '../components/FAQSection';

interface SeoConfig {
  title: string;
  h1: string;
  subtitle: string;
  description: string;
  guideTitle: string;
  guideSteps: string[];
}

const SEO_MAP: Record<string, SeoConfig> = {
  '/search-multiple-pdfs': {
    title: 'Search Multiple PDFs at Once — Fast & Free Online Tool',
    h1: 'Search Multiple PDFs at Once',
    subtitle: 'Find keywords, exact phrases, and numbers across dozens or hundreds of PDF files in seconds without opening them one by one.',
    description: 'Free online tool to search multiple PDF files simultaneously. 100% private, browser-based, no registration required.',
    guideTitle: 'How to Search Across Multiple PDF Files at Once',
    guideSteps: [
      'Drag and drop your PDF documents or a zipped folder into the box above.',
      'Our local browser engine indexes all pages in seconds without uploading files to any server.',
      'Type your search term to see instant matches, exact page numbers, and highlighted text snippets.',
      'Export the complete list of matching documents to CSV or download matching files as a ZIP.'
    ]
  },
  '/find-text-in-multiple-pdfs': {
    title: 'Find Text in Multiple PDFs — Batch Document Search',
    h1: 'Find Text Across Multiple PDF Documents',
    subtitle: 'Search folders of PDF files for specific text, clauses, or invoice references instantly.',
    description: 'Easily find text and phrases across folders of PDF files without uploading sensitive documents to external servers.',
    guideTitle: 'How to Find Specific Text Across Document Folders',
    guideSteps: [
      'Select your folder of PDF files using the "Upload Entire Folder" button.',
      'DocSweep reads and extracts text from each file directly in your browser memory.',
      'Enter the word or phrase you need to locate across the archive.',
      'Filter by documents with matches and review context snippets page by page.'
    ]
  },
  '/pdf-document-audit': {
    title: 'PDF Document Audit Tool — Check Clauses & Compliance Across Files',
    h1: 'Audit Multiple PDF Contracts & Documents',
    subtitle: 'Check compliance criteria and detect missing clauses across multiple contracts simultaneously.',
    description: 'Audit dozens of PDF contracts against custom criteria. Instant compliance matrix showing which files contain or miss mandatory clauses.',
    guideTitle: 'How to Audit Contract Clauses Across Many PDFs',
    guideSteps: [
      'Drop your batch of contract or agreement PDFs into the tool.',
      'Define requirement criteria (e.g. GDPR, Right of Withdrawal, Governing Law).',
      'The audit matrix verifies all documents and displays clear ✓ / ✗ indicators.',
      'Download a ZIP containing only the files that failed audit criteria for manual legal review.'
    ]
  },
  '/find-word-in-multiple-pdfs': {
    title: 'Find a Word in Multiple PDF Files Online',
    h1: 'Find a Word in Multiple PDF Files',
    subtitle: 'Quickly check which PDF files contain a specific keyword or term.',
    description: 'Find words and terms across multiple PDF files. See exact page occurrences and download results.',
    guideTitle: 'Quick Guide: Finding a Word in Multiple PDF Files',
    guideSteps: [
      'Choose or drag your PDF documents into the drop zone.',
      'Type the exact word you are looking for into the search bar.',
      'Review the immediate breakdown: documents with the word vs documents without.',
      'Export your audit report to CSV with one click.'
    ]
  },
  '/cerca-in-piu-pdf': {
    title: 'Cerca in Più PDF Contemporaneamente — Strumento Online Gratuito',
    h1: 'Cerca Testo in Più File PDF Contemporaneamente',
    subtitle: 'Trova parole, frasi e clausole in decine o centinaia di documenti PDF senza doverli aprire uno a uno.',
    description: 'Strumento per cercare parole e frasi in più file PDF contemporaneamente. 100% nel browser, sicuro e privato.',
    guideTitle: 'Come Cercare in Più PDF Insieme',
    guideSteps: [
      'Trascina i tuoi file PDF o una cartella ZIP nel riquadro in alto.',
      'Il sistema elabora il testo localmente nel tuo browser in pochi secondi.',
      'Scrivi la parola o la clausola che desideri trovare.',
      'Esporta l’elenco dei file con i riscontri in CSV o scarica i PDF corrispondenti in formato ZIP.'
    ]
  }
};

export const SeoLandingPage: React.FC = () => {
  const location = useLocation();
  const { documents } = useDocuments();

  const config = SEO_MAP[location.pathname] || SEO_MAP['/search-multiple-pdfs'];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
      </Helmet>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FREE CLIENT-SIDE UTILITY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {config.h1}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Live Tool Embedded Immediately */}
        <section className="space-y-6">
          {documents.length === 0 ? (
            <DropZone />
          ) : (
            <div className="space-y-6">
              <SearchBar />
              <SearchResults />
            </div>
          )}
          <ProcessingProgress />
        </section>

        {/* How it Works / Step by Step Guide (Good for SEO & user confidence) */}
        <section className="pt-8 border-t border-slate-900">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-sm uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Step-by-Step Guide</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{config.guideTitle}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {config.guideSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <FAQSection />
      </main>
    </div>
  );
};
