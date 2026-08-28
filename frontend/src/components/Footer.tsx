import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cpu, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">DocSweep</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">v1.0</span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Fast, privacy-first batch PDF search and document audit tool. Your documents are processed 100% locally in your browser memory and never uploaded to our servers.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-brand-400" />
                Zero Cloud Uploads
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                Client-Side Engine
              </span>
            </div>
          </div>

          {/* Col 2: SEO Landing Pages */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Use Cases & Tools</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/search-multiple-pdfs" className="hover:text-brand-400 transition-colors">
                  Search Multiple PDFs
                </Link>
              </li>
              <li>
                <Link to="/find-text-in-multiple-pdfs" className="hover:text-brand-400 transition-colors">
                  Find Text in Folders
                </Link>
              </li>
              <li>
                <Link to="/pdf-document-audit" className="hover:text-brand-400 transition-colors">
                  Contract Clause Audit
                </Link>
              </li>
              <li>
                <Link to="/find-word-in-multiple-pdfs" className="hover:text-brand-400 transition-colors">
                  Find Word Across PDFs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Legal & Pricing</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/pricing" className="hover:text-brand-400 transition-colors">
                  Pricing & Limits
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} DocSweep. All rights reserved. No account required.</p>
          <p className="flex items-center gap-1">
            Built for privacy, speed, and simplicity.
          </p>
        </div>
      </div>
    </footer>
  );
};
