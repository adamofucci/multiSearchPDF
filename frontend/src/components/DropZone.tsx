import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, FolderPlus, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { useDocuments } from '../context/DocumentContext';

export const DropZone: React.FC = () => {
  const { loadFiles, isProcessing } = useDocuments();
  const [isDragActive, setIsDragActive] = useState(false);
  const [zipExtracting, setZipExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Unpack ZIP files in-browser memory
  const handleZipFile = async (zipFile: File): Promise<File[]> => {
    setZipExtracting(true);
    setErrorMessage(null);
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(zipFile);
      const extractedFiles: File[] = [];

      for (const relativePath of Object.keys(loadedZip.files)) {
        const zipEntry = loadedZip.files[relativePath];
        if (!zipEntry.dir && relativePath.toLowerCase().endsWith('.pdf')) {
          const blob = await zipEntry.async('blob');
          const cleanName = relativePath.split('/').pop() || 'document.pdf';
          const file = new File([blob], cleanName, { type: 'application/pdf' });
          extractedFiles.push(file);
        }
      }

      setZipExtracting(false);
      if (extractedFiles.length === 0) {
        setErrorMessage('No PDF documents found inside the ZIP archive.');
        return [];
      }
      return extractedFiles;
    } catch (err) {
      console.error('Error unpacking ZIP:', err);
      setZipExtracting(false);
      setErrorMessage('Could not read ZIP file. Make sure it is not corrupted.');
      return [];
    }
  };

  const processIncomingFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const filesArray = Array.from(fileList);
    const pdfs: File[] = [];

    for (const file of filesArray) {
      if (file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip') {
        const extracted = await handleZipFile(file);
        pdfs.push(...extracted);
      } else if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        pdfs.push(file);
      }
    }

    if (pdfs.length === 0) {
      setErrorMessage('Please select valid .pdf files or a .zip archive containing PDFs.');
      return;
    }

    loadFiles(pdfs);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processIncomingFiles(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center cursor-pointer ${
          isDragActive
            ? 'border-brand-400 bg-brand-500/10 scale-[1.01] shadow-2xl shadow-brand-500/20'
            : 'border-slate-800 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.zip,application/pdf,application/zip"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isProcessing || zipExtracting}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isProcessing || zipExtracting}
        />

        {/* Center Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 group-hover:from-brand-500/20 group-hover:to-brand-500/30 flex items-center justify-center mb-5 text-slate-300 group-hover:text-brand-400 transition-colors shadow-inner">
          {zipExtracting ? (
            <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <UploadCloud className="w-8 h-8 transition-transform group-hover:scale-110" />
          )}
        </div>

        {/* Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {zipExtracting ? 'Unpacking ZIP archive...' : 'Drop your PDFs or ZIP folder here'}
        </h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Drag & drop dozens of PDF documents, a zipped folder, or choose from your computer.
        </p>

        {/* Buttons Action Group */}
        <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Choose PDF Files
          </button>

          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 text-brand-400" />
            Upload Entire Folder
          </button>
        </div>

        {/* Privacy Pill */}
        <div className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>🔒 100% Browser-Based. Documents never leave your computer.</span>
        </div>
      </div>

      {/* Error notification if invalid file */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
