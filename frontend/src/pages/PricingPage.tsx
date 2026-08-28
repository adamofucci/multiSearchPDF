import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { getPaymentLinkForPlan } from '../utils/freemium';

export const PricingPage: React.FC = () => {
  const { openPaywall } = useDocuments();

  return (
    <div className="min-h-screen py-12 sm:py-16">
      <Helmet>
        <title>Pricing — Simple One-Time Pass | DocSweep</title>
        <meta 
          name="description" 
          content="Zero subscriptions. Pay only when you need to process large batches of PDF documents. Simple, transparent pricing." 
        />
      </Helmet>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT & FAIR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pay To Finish The Job. <br />
            <span className="text-slate-400 font-bold text-2xl sm:text-3xl">No monthly subscriptions.</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Start completely free for up to 10 documents. Upgrade with a single one-time unlock whenever you have large document batches.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Tier</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">€0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Perfect for quick one-off checks.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Up to 10 PDFs per batch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Full-text phrase search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>CSV export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>100% private local indexing</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
              Active by default
            </div>
          </div>

          {/* Standard Tier (€2.99) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Batch Standard</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">€2.99</span>
                <span className="text-xs text-slate-400">one-time</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">For medium archive searches.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Up to 100 PDFs per session</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Exact phrase & regex search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>CSV & JSON results export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Download matching PDFs ZIP</span>
                </li>
              </ul>
            </div>
            <button
              onClick={openPaywall}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              Select €2.99 Pass
            </button>
          </div>

          {/* Pro Audit Tier (€4.99) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-500/80 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-brand-500/10">
            <div className="absolute -top-3 right-4 bg-brand-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Audit Pro</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">€4.99</span>
                <span className="text-xs text-slate-400">one-time</span>
              </div>
              <p className="text-xs text-brand-300 font-semibold mt-2">For lawyers, auditors, and compliance.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Up to 500 PDFs batch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Full Multi-Clause Audit Matrix</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Download "Needs Review" ZIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Priority parsing threads</span>
                </li>
              </ul>
            </div>
            <button
              onClick={openPaywall}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-black shadow-lg shadow-brand-500/20 transition-all"
            >
              Get Audit Pro Pass
            </button>
          </div>

          {/* Power Batch Tier (€9.99) */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Power Batch</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">€9.99</span>
                <span className="text-xs text-slate-400">one-time</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">For large enterprise archives.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>2,000+ PDFs per session</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>All Audit Matrix features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Future OCR priority queue</span>
                </li>
              </ul>
            </div>
            <button
              onClick={openPaywall}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              Select Power Pass
            </button>
          </div>
        </div>

        {/* Guarantees */}
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-brand-400 font-semibold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Privacy & Zero Risk Guarantee</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All payments are processed securely via Stripe. We do not store card information or require an account password. If you encounter any technical difficulty, contact us for an instant refund.
          </p>
        </div>
      </main>
    </div>
  );
};
