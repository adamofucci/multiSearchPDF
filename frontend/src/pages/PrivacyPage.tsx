import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <Helmet>
        <title>Privacy Policy — DocSweep (Zero Cloud Uploads)</title>
        <meta 
          name="description" 
          content="Learn how DocSweep protects your document privacy with 100% in-browser processing." 
        />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PRIVACY ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Your Files Stay on Your Device.
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
          <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-200 flex items-start gap-4">
            <Lock className="w-6 h-6 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-brand-300 font-bold block mb-1 text-base">The Core Privacy Promise:</strong>
              When you drop or select PDF files on DocSweep, the text parsing, indexing, and search algorithms execute <strong>locally in your browser's memory</strong> using WebAssembly and PDF.js. Your document bytes and extracted text are NEVER sent across the internet to our backend servers.
            </div>
          </div>

          <h2 className="text-lg font-bold text-white pt-4">1. What Information We Process</h2>
          <p>
            - <strong>Document Content:</strong> Exclusively stored in temporary JavaScript memory variables on your device. Once you close the tab or reload the browser, all memory allocations are destroyed.
          </p>
          <p>
            - <strong>Search Queries:</strong> Queries are executed client-side against your local index. We do not transmit or log your search queries.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Payments</h2>
          <p>
            All payment transactions are handled directly by Stripe. We never see or store your credit card numbers, billing addresses, or payment credentials.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Privacy-Safe Functional Telemetry</h2>
          <p>
            We collect minimal, anonymized functional counters (such as page views, count of files selected, or checkout completion rates) to understand app stability. We strictly prohibit capturing document names, phrases, or customer text in analytics logs.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Contact</h2>
          <p>
            If you have questions about our privacy architecture, feel free to contact us via GitHub or our support channel.
          </p>
        </div>
      </main>
    </div>
  );
};
