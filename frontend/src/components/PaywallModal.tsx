import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDocuments } from '../context/DocumentContext';
import { getPaymentLinkForPlan } from '../utils/freemium';

export const PaywallModal: React.FC = () => {
  const { isPaywallOpen, closePaywall, unlockWithToken, rawFiles } = useDocuments();
  const [selectedPlan, setSelectedPlan] = useState<'batch_100' | 'batch_500' | 'batch_pro'>('batch_100');
  const [isDemoUnlocking, setIsDemoUnlocking] = useState(false);

  if (!isPaywallOpen) return null;

  const triggerUnlockCelebration = (planName: string, maxDocs: number) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    unlockWithToken(`demo_token_${Date.now()}`, maxDocs, selectedPlan);
  };

  const handleDemoUnlock = () => {
    setIsDemoUnlocking(true);
    setTimeout(() => {
      triggerUnlockCelebration('Batch Pro', selectedPlan === 'batch_100' ? 100 : (selectedPlan === 'batch_500' ? 500 : 2000));
      setIsDemoUnlocking(false);
    }, 600);
  };

  const handleCheckoutRedirect = () => {
    const link = getPaymentLinkForPlan(selectedPlan);
    if (link.startsWith('http')) {
      window.location.href = link;
    } else {
      handleDemoUnlock();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={closePaywall}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ONE-TIME PASS · NO SUBSCRIPTION</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Unlock Batch Processing
          </h3>
          <p className="text-slate-400 text-sm mt-2">
            You loaded {rawFiles.length > 0 ? `${rawFiles.length} PDFs` : 'multiple PDFs'}. Free plan includes 10 documents. Finish your search with a simple one-time unlock.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Tier 1: €2.99 */}
          <div
            onClick={() => setSelectedPlan('batch_100')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
              selectedPlan === 'batch_100'
                ? 'bg-brand-500/10 border-brand-400 ring-2 ring-brand-500/20'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Standard</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">€2.99</span>
                <span className="text-xs text-slate-400">once</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-2">Up to 100 PDFs</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-brand-400" />
                <span>Batch search</span>
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-brand-400" />
                <span>CSV export</span>
              </li>
            </ul>
          </div>

          {/* Tier 2: €4.99 (Popular) */}
          <div
            onClick={() => setSelectedPlan('batch_500')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
              selectedPlan === 'batch_500'
                ? 'bg-brand-500/15 border-brand-400 ring-2 ring-brand-500/30 shadow-lg shadow-brand-500/10'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-brand-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Audit Pro</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">€4.99</span>
                <span className="text-xs text-slate-400">once</span>
              </div>
              <p className="text-xs text-brand-300 font-semibold mt-2">Up to 500 PDFs</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-brand-400" />
                <span>Full Audit Matrix</span>
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-brand-400" />
                <span>ZIP export</span>
              </li>
            </ul>
          </div>

          {/* Tier 3: €9.99 */}
          <div
            onClick={() => setSelectedPlan('batch_pro')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
              selectedPlan === 'batch_pro'
                ? 'bg-brand-500/10 border-brand-400 ring-2 ring-brand-500/20'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Power Batch</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">€9.99</span>
                <span className="text-xs text-slate-400">once</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-2">2,000+ PDFs</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-brand-400" />
                <span>Unlimited batch</span>
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-brand-400" />
                <span>Future OCR pass</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleCheckoutRedirect}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              Unlock {selectedPlan === 'batch_100' ? '100 PDFs for €2.99' : (selectedPlan === 'batch_500' ? '500 PDFs for €4.99' : 'Power Batch for €9.99')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Unlock Button (for tests / zero-friction evaluation) */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleDemoUnlock}
              disabled={isDemoUnlocking}
              className="text-xs text-slate-500 hover:text-slate-400 underline transition-colors"
            >
              {isDemoUnlocking ? 'Unlocking test pass...' : 'Or click here for Instant Free Demo Pass'}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs text-slate-400 text-center">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Secure via Stripe
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-4 h-4 text-emerald-400" />
            No account or sign up needed
          </span>
        </div>
      </div>
    </div>
  );
};
