import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Eye, 
  Download, 
  ArrowUpDown, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { DocumentSearchResult } from '../types';
import { exportSearchToCSV, exportSearchToJSON, downloadFilesAsZip } from '../utils/export';

export const SearchResults: React.FC = () => {
  const { searchResults, query, documents, openPreview, openPaywall, freemium } = useDocuments();
  const [activeTab, setActiveTab] = useState<'all' | 'found' | 'not_found' | 'issues'>('all');
  const [sortBy, setSortBy] = useState<'matches' | 'name'>('matches');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isZipping, setIsZipping] = useState(false);

  const foundResults = useMemo(() => searchResults.filter(r => r.hasMatch), [searchResults]);
  const notFoundResults = useMemo(() => searchResults.filter(r => !r.hasMatch && !r.isScanned && !r.error), [searchResults]);
  const issuesResults = useMemo(() => searchResults.filter(r => r.isScanned || !!r.error), [searchResults]);

  const filteredResults = useMemo(() => {
    let list: DocumentSearchResult[] = [];
    if (activeTab === 'all') list = [...searchResults];
    else if (activeTab === 'found') list = [...foundResults];
    else if (activeTab === 'not_found') list = [...notFoundResults];
    else if (activeTab === 'issues') list = [...issuesResults];

    return list.sort((a, b) => {
      if (sortBy === 'matches') {
        return sortOrder === 'desc' ? b.totalMatches - a.totalMatches : a.totalMatches - b.totalMatches;
      }
      return sortOrder === 'desc' ? b.documentName.localeCompare(a.documentName) : a.documentName.localeCompare(b.documentName);
    });
  }, [searchResults, activeTab, foundResults, notFoundResults, issuesResults, sortBy, sortOrder]);

  const handleDownloadMatchingZip = async () => {
    const filesToZip = foundResults.map(r => r.rawFile);
    if (filesToZip.length === 0) return;
    setIsZipping(true);
    await downloadFilesAsZip(filesToZip, `docsweep-matching-docs-${Date.now()}`);
    setIsZipping(false);
  };

  const handleDownloadMissingZip = async () => {
    const filesToZip = notFoundResults.map(r => r.rawFile);
    if (filesToZip.length === 0) return;
    setIsZipping(true);
    await downloadFilesAsZip(filesToZip, `docsweep-missing-clause-docs-${Date.now()}`);
    setIsZipping(false);
  };

  if (!query.trim() || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Found Stat */}
        <div 
          onClick={() => setActiveTab('found')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTab === 'found'
              ? 'bg-brand-500/10 border-brand-500/40 ring-1 ring-brand-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Found in Documents</span>
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-400">{foundResults.length}</span>
            <span className="text-xs text-slate-400">/ {searchResults.length} PDFs</span>
          </div>
        </div>

        {/* Not Found Stat */}
        <div 
          onClick={() => setActiveTab('not_found')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTab === 'not_found'
              ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Missing Term</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-200">{notFoundResults.length}</span>
            <span className="text-xs text-slate-400">documents</span>
          </div>
        </div>

        {/* Total Occurrences */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Match Occurrences</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {searchResults.reduce((acc, r) => acc + r.totalMatches, 0)}
            </span>
            <span className="text-xs text-slate-400">across all pages</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs + Sort + Export Group */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({searchResults.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'found' ? 'bg-brand-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-brand-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Found ({foundResults.length})
          </button>
          <button
            onClick={() => setActiveTab('not_found')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'not_found' ? 'bg-rose-900/80 text-rose-200 shadow' : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Not Found ({notFoundResults.length})
          </button>
          {issuesResults.length > 0 && (
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 rounded-md transition-all text-amber-400 ${
                activeTab === 'issues' ? 'bg-amber-950 border border-amber-500/30' : ''
              }`}
            >
              Issues ({issuesResults.length})
            </button>
          )}
        </div>

        {/* Action Buttons: Sort + Exports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Dropdown */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
            <span>Sort: {sortBy === 'matches' ? 'Matches' : 'Name'} ({sortOrder.toUpperCase()})</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={() => exportSearchToCSV(searchResults, query)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span>Export CSV</span>
          </button>

          {/* Download Matching ZIP */}
          {foundResults.length > 0 && (
            <button
              onClick={handleDownloadMatchingZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-xs font-semibold border border-brand-500/40 transition-colors"
              title="Download all PDFs containing the search term as a ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping...' : `Download ${foundResults.length} Matching PDFs (ZIP)`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No documents match this filter.</p>
          </div>
        ) : (
          filteredResults.map((result) => {
            const correspondingDoc = documents.find(d => d.id === result.documentId);

            return (
              <div
                key={result.documentId}
                className={`p-5 rounded-2xl border transition-all ${
                  result.hasMatch
                    ? 'bg-slate-900/90 border-slate-800 hover:border-brand-500/30 shadow-lg'
                    : 'bg-slate-950/60 border-slate-900 opacity-80'
                }`}
              >
                {/* Document Header Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      result.hasMatch ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        {result.documentName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {correspondingDoc?.totalPages ? `${correspondingDoc.totalPages} pages` : 'Document'} · {(result.rawFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>

                  {/* Status Badges & Preview action */}
                  <div className="flex items-center gap-2">
                    {result.hasMatch ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {result.totalMatches} match{result.totalMatches > 1 ? 'es' : ''} (pages {result.pagesFound.join(', ')})
                        </span>
                        {correspondingDoc && (
                          <button
                            type="button"
                            onClick={() => openPreview(correspondingDoc, result.pagesFound[0], query)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-brand-400" />
                            View PDF
                          </button>
                        )}
                      </div>
                    ) : result.isScanned ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Scanned PDF (No text layer)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Not Found
                      </span>
                    )}
                  </div>
                </div>

                {/* Snippets Section */}
                {result.snippets.length > 0 && (
                  <div className="mt-4 space-y-2 pt-3 border-t border-slate-800/80">
                    {result.snippets.map((snip, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-slate-300 font-mono flex items-start justify-between gap-3"
                      >
                        <div className="leading-relaxed">
                          <span className="text-brand-400 font-semibold mr-2">[Page {snip.pageNumber}]</span>
                          <span>{snip.snippet}</span>
                        </div>
                        {correspondingDoc && (
                          <button
                            type="button"
                            onClick={() => openPreview(correspondingDoc, snip.pageNumber, query)}
                            className="text-slate-400 hover:text-brand-400 flex items-center gap-1 flex-shrink-0 transition-colors"
                            title={`Jump to page ${snip.pageNumber}`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>p.{snip.pageNumber}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
