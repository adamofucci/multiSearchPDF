import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <Helmet>
        <title>Terms of Service — DocSweep</title>
        <meta name="description" content="Terms of Service for DocSweep utility tool." />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-white">1. Service Description</h2>
          <p>
            DocSweep provides an in-browser document search and auditing utility. The tool runs client-side to parse and inspect PDF files without storing copies on external database servers.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Permitted Use</h2>
          <p>
            You agree to use DocSweep in compliance with all applicable local, national, and international laws. Because the processing occurs locally, you are responsible for ensuring that you have the right to inspect the uploaded files.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Purchases & One-Time Passes</h2>
          <p>
            One-time passes unlock processing capabilities for your current browser session. Passes are non-recurring and will not automatically bill you again.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Limitation of Liability</h2>
          <p>
            DocSweep is provided "as is" without warranty of any kind. While our parsing logic strives for maximum precision across standard PDF standards, you should independently verify mission-critical legal decisions.
          </p>
        </div>
      </main>
    </div>
  );
};
