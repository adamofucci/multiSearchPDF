import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  Eye, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { exportAuditToCSV, downloadFilesAsZip } from '../utils/export';
import { DocumentAuditResult } from '../types';

export const AuditMatrix: React.FC = () => {
  const { auditResults, auditRequirements, documents, openPreview } = useDocuments();
  const [filter, setFilter] = useState<'all' | 'passed' | 'review'>('all');
  const [isZipping, setIsZipping] = useState(false);

  const passedCount = useMemo(() => auditResults.filter(r => r.passedAll).length, [auditResults]);
  const reviewCount = useMemo(() => auditResults.filter(r => !r.passedAll).length, [auditResults]);

  const filteredResults = useMemo(() => {
    if (filter === 'passed') return auditResults.filter(r => r.passedAll);
    if (filter === 'review') return auditResults.filter(r => !r.passedAll);
    return auditResults;
  }, [auditResults, filter]);

  const handleExportCSV = () => {
    exportAuditToCSV(auditResults, auditRequirements);
  };

  const handleDownloadReviewZip = async () => {
    const reviewFiles = auditResults.filter(r => !r.passedAll).map(r => r.rawFile);
    if (reviewFiles.length === 0) return;
    setIsZipping(true);
    await downloadFilesAsZip(reviewFiles, `docsweep-audit-needs-review-${Date.now()}`);
    setIsZipping(false);
  };

  if (auditResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Audit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Documents Checked */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents Audited</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{auditResults.length}</span>
            <span className="text-xs text-slate-400">PDF files</span>
          </div>
        </div>

        {/* Passed All */}
        <div 
          onClick={() => setFilter('passed')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            filter === 'passed'
              ? 'bg-brand-500/10 border-brand-500/40 ring-1 ring-brand-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">100% Compliant</span>
            <ShieldCheck className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-400">{passedCount}</span>
            <span className="text-xs text-brand-400/80">passed all requirements</span>
          </div>
        </div>

        {/* Needs Review */}
        <div 
          onClick={() => setFilter('review')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            filter === 'review'
              ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Missing Criteria</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{reviewCount}</span>
            <span className="text-xs text-amber-300/80">need manual review</span>
          </div>
        </div>
      </div>

      {/* Audit Matrix Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filter === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Documents ({auditResults.length})
          </button>
          <button
            onClick={() => setFilter('passed')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              filter === 'passed' ? 'bg-brand-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-brand-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Passed All ({passedCount})
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              filter === 'review' ? 'bg-amber-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Needs Review ({reviewCount})
          </button>
        </div>

        {/* Exports */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span>Export Matrix CSV</span>
          </button>

          {reviewCount > 0 && (
            <button
              onClick={handleDownloadReviewZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping...' : `Download ${reviewCount} Review PDFs (ZIP)`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold text-white min-w-[220px]">Document File</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                {auditRequirements.map((req) => (
                  <th key={req.id} className="py-3.5 px-4 text-center min-w-[120px]">
                    <div className="font-semibold text-slate-200">{req.label}</div>
                    <div className="text-[10px] text-slate-500 lowercase font-normal">"{req.query}"</div>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredResults.map((result) => {
                const correspondingDoc = documents.find(d => d.id === result.documentId);

                return (
                  <tr 
                    key={result.documentId}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Document Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-medium text-white truncate max-w-[200px] sm:max-w-xs" title={result.documentName}>
                          {result.documentName}
                        </span>
                      </div>
                    </td>

                    {/* Overall Status */}
                    <td className="py-3.5 px-4 text-center">
                      {result.passedAll ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          Review
                        </span>
                      )}
                    </td>

                    {/* Requirement Columns */}
                    {auditRequirements.map((req) => {
                      const status = result.requirementsStatus[req.id];
                      const isFound = status?.found;

                      return (
                        <td key={req.id} className="py-3.5 px-4 text-center">
                          {isFound ? (
                            <span 
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 font-bold hover:scale-110 transition-transform cursor-pointer"
                              title={`Found ${status.count} times on page(s) ${status.pages.join(', ')}`}
                              onClick={() => correspondingDoc && openPreview(correspondingDoc, status.pages[0], req.query)}
                            >
                              ✓
                            </span>
                          ) : (
                            <span 
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 font-bold"
                              title="Missing clause"
                            >
                              ✗
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {correspondingDoc && (
                        <button
                          type="button"
                          onClick={() => openPreview(correspondingDoc, 1)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-400" />
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
