import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Zap, Layers } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useDocuments } from '../context/DocumentContext';
import { DropZone } from '../components/DropZone';
import { ProcessingProgress } from '../components/ProcessingProgress';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { FAQSection } from '../components/FAQSection';
import { verifyStripeSession } from '../utils/freemium';

export const HomePage: React.FC = () => {
  const { documents, unlockWithToken } = useDocuments();
  const [searchParams] = useSearchParams();

  // Check if returning from Stripe checkout session
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyStripeSession(sessionId).then((res) => {
        if (res) {
          unlockWithToken(res.token || '', res.maxDocs, res.plan);
        }
      });
    }
  }, [searchParams, unlockWithToken]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Helmet>
        <title>DocSweep — Search Across Multiple PDFs at Once (100% Private)</title>
        <meta 
          name="description" 
          content="Search words, phrases and missing clauses across dozens or hundreds of PDF files without opening them one by one. 100% browser-based, no account required." 
        />
      </Helmet>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        {documents.length === 0 && (
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span>100% Client-Side Engine · Zero Server Uploads</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Search Multiple PDFs <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
                All at Once.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Find words, phrases, and missing clauses across your documents in seconds. Stop opening files one by one.
            </p>
          </div>
        )}

        {/* Core Tool Area */}
        <section className="space-y-6">
          {documents.length === 0 ? (
            <DropZone />
          ) : (
            <div className="space-y-6 animate-fade-in">
              <SearchBar />
              <SearchResults />
            </div>
          )}

          <ProcessingProgress />
        </section>

        {/* Value Proposition Grid (Visible when no files loaded) */}
        {documents.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant Batch Indexing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan 50 or 500 PDF files in parallel using Web Workers directly inside your browser memory.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Guaranteed Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your private contracts and confidential documents never leave your computer. No cloud storage risk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Find What's Missing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Easily filter for documents that do NOT contain a mandatory clause and download them as a ZIP.
              </p>
            </div>
          </div>
        )}

        {/* Use Cases Section */}
        {documents.length === 0 && (
          <section className="pt-8 border-t border-slate-900">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Designed For Document Heavy Teams</h2>
              <p className="text-xs text-slate-400 mt-1">Built for legal, procurement, finance, and research professionals.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="font-bold text-brand-400 block mb-1">⚖️ Legal & Contracts</span>
                <p className="text-slate-400">Audit dozens of NDAs, vendor agreements, and contracts for specific terms or clauses.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="font-bold text-brand-400 block mb-1">🛡️ GDPR & Compliance</span>
                <p className="text-slate-400">Verify required privacy notices, data protection clauses, and retention statements.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="font-bold text-brand-400 block mb-1">📊 Finance & Administration</span>
                <p className="text-slate-400">Find invoice numbers, customer IDs, and VAT details across large document archives.</p>
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {documents.length === 0 && <FAQSection />}
      </main>
    </div>
  );
};
