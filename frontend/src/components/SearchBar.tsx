import React, { useState, FormEvent } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, Clock } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export const SearchBar: React.FC = () => {
  const { 
    query, 
    setQuery, 
    searchOptions, 
    setSearchOptions, 
    runSearch, 
    documents, 
    resetAll,
    t 
  } = useDocuments();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['GDPR', 'termination', 'confidentiality', 'payment']);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 5)]);
    }

    runSearch(query);
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    runSearch(term);
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Top Header bar with Loaded count and Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400"></span>
          <span className="text-sm font-semibold text-white">
            {documents.length} {t('readyFiles')}
          </span>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('loadDifferent')}
        </button>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-brand-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-950 border border-slate-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-white placeholder-slate-500 text-sm font-medium transition-all"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                runSearch('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-6 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{t('searchBtn')}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-3.5 rounded-xl border transition-colors ${
              showAdvanced || searchOptions.caseSensitive || searchOptions.wholeWord
                ? 'bg-brand-500/10 border-brand-500/40 text-brand-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Search Options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Options Row */}
      {showAdvanced && (
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={searchOptions.caseSensitive}
              onChange={(e) => setSearchOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
              className="rounded bg-slate-950 border-slate-700 text-brand-500 focus:ring-brand-500/30 focus:ring-offset-slate-900"
            />
            <span>Case sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={searchOptions.wholeWord}
              onChange={(e) => setSearchOptions(prev => ({ ...prev, wholeWord: e.target.checked }))}
              className="rounded bg-slate-950 border-slate-700 text-brand-500 focus:ring-brand-500/30 focus:ring-offset-slate-900"
            />
            <span>Whole word only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={searchOptions.useBoolean}
              onChange={(e) => setSearchOptions(prev => ({ ...prev, useBoolean: e.target.checked }))}
              className="rounded bg-slate-950 border-slate-700 text-brand-500 focus:ring-brand-500/30 focus:ring-offset-slate-900"
            />
            <span>Boolean syntax (<code className="text-brand-300 font-mono">AND</code> / <code className="text-brand-300 font-mono">OR</code>)</span>
          </label>
        </div>
      )}

      {/* Recent quick search chips */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            Quick suggestions:
          </span>
          {recentSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectRecent(term)}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-brand-300 border border-slate-700/60 hover:border-brand-500/40 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
