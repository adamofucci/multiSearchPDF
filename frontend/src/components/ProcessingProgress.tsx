import React from 'react';
import { Loader2, AlertTriangle, Lock, XCircle } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export const ProcessingProgress: React.FC = () => {
  const { isProcessing, progress, cancelProcessing, scannedCount, encryptedCount, openPaywall, t } = useDocuments();

  if (!isProcessing && scannedCount === 0 && encryptedCount === 0) {
    return null;
  }

  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="w-full space-y-4 my-6">
      {/* Live Indexing Progress Bar */}
      {isProcessing && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              <span>{t('indexingProgress')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-400 font-mono font-bold text-xs bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                {progress.current} / {progress.total} ({percentage}%)
              </span>
              <button
                type="button"
                onClick={cancelProcessing}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                title="Stop processing remaining files"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>

          {/* Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-200 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Current file name */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono truncate">
            <span className="truncate max-w-[80%]">{t('processingFile')} {progress.filename}</span>
            <span>{t('parsingText')}</span>
          </div>
        </div>
      )}

      {/* Scanned PDFs Notice */}
      {!isProcessing && scannedCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-amber-300">
                {scannedCount} {t('scannedNoticeTitle')}
              </span>
              <p className="text-amber-200/80 mt-0.5">
                {t('scannedNoticeSub')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openPaywall}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex-shrink-0"
          >
            {t('exploreOcr')}
          </button>
        </div>
      )}

      {/* Encrypted Notice */}
      {!isProcessing && encryptedCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-center gap-3">
          <Lock className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-rose-300">
              {encryptedCount} {t('encryptedNoticeTitle')}
            </span>
            <p className="text-rose-200/80 mt-0.5">
              {t('encryptedNoticeSub')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
