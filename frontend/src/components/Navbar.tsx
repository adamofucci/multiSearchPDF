import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles, FileText, CheckCircle2, Globe } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { freemium, openPaywall, documents, lang, setLang, t } = useDocuments();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              DocSweep
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                100% Local
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              location.pathname === '/' ? 'text-brand-400' : 'text-slate-400'
            }`}
          >
            <Search className="w-4 h-4" />
            {t('searchPDFs')}
          </Link>
          <Link
            to="/audit"
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              location.pathname === '/audit' ? 'text-brand-400' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            {t('docAudit')}
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">
              PRO
            </span>
          </Link>
          <Link
            to="/pricing"
            className={`transition-colors hover:text-white ${
              location.pathname === '/pricing' ? 'text-brand-400' : 'text-slate-400'
            }`}
          >
            {t('pricing')}
          </Link>
          <Link
            to="/privacy"
            className={`transition-colors hover:text-white ${
              location.pathname === '/privacy' ? 'text-brand-400' : 'text-slate-400'
            }`}
          >
            {t('privacy')}
          </Link>
        </nav>

        {/* Right CTA / Language Switcher / Session Indicator */}
        <div className="flex items-center gap-3">
          {/* Minimal Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'it' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            title={lang === 'en' ? 'Passa all\'Italiano' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-brand-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {freemium.isUnlocked ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('passActive')}</span>
            </div>
          ) : (
            <button
              onClick={openPaywall}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('unlockPass')}</span>
            </button>
          )}

          {documents.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 border-l border-slate-800 pl-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{documents.length} loaded</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
