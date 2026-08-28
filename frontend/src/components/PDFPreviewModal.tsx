import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Search, ZoomIn, ZoomOut } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useDocuments } from '../context/DocumentContext';

export const PDFPreviewModal: React.FC = () => {
  const { selectedPreview, closePreview } = useDocuments();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedPreview?.pageNumber) {
      setCurrentPage(selectedPreview.pageNumber);
    } else {
      setCurrentPage(1);
    }
  }, [selectedPreview]);

  // Render PDF page to canvas
  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!selectedPreview?.doc?.rawFile || !canvasRef.current) return;
      setLoading(true);

      try {
        const buffer = await selectedPreview.doc.rawFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(currentPage);

        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        console.error('Error rendering PDF page preview:', err);
        setLoading(false);
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [selectedPreview, currentPage, scale]);

  if (!selectedPreview) return null;

  const totalPages = selectedPreview.doc.totalPages || 1;
  const pageText = selectedPreview.doc.pages.find(p => p.pageNumber === currentPage)?.text || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                {selectedPreview.doc.name}
              </h3>
              <p className="text-xs text-slate-400">
                Page {currentPage} of {totalPages} {selectedPreview.highlightQuery ? `· Searching for "${selectedPreview.highlightQuery}"` : ''}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] px-2 text-slate-300 font-mono">{Math.round(scale * 100)}%</span>
              <button
                type="button"
                onClick={() => setScale(s => Math.min(2.2, s + 0.2))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs px-2 text-slate-200 font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closePreview}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 flex flex-col lg:flex-row gap-6 items-start justify-center bg-slate-950/40">
          {/* PDF Canvas View */}
          <div className="flex-1 flex justify-center w-full min-h-[400px]">
            <div className="relative shadow-2xl rounded border border-slate-700 bg-white overflow-hidden max-w-full">
              {loading && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <canvas ref={canvasRef} className="block max-w-full h-auto" />
            </div>
          </div>

          {/* Extracted Text Inspector Pane */}
          {pageText && (
            <div className="w-full lg:w-80 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-full max-h-[500px] overflow-hidden flex-shrink-0">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-brand-400" />
                Page {currentPage} Text Content
              </h4>
              <div className="flex-1 overflow-y-auto text-xs text-slate-400 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 select-text whitespace-pre-wrap">
                {pageText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
