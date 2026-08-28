import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  ParsedDocument, 
  DocumentSearchResult, 
  SearchOptions, 
  AuditRequirement, 
  DocumentAuditResult, 
  FreemiumState 
} from '../types';
import { parseMultiplePDFs } from '../utils/pdfWorker';
import { searchDocuments, buildSearchRegex } from '../utils/search';
import { trackEvent } from '../utils/analytics';
import { translations, Language } from '../utils/translations';

interface DocumentContextType {
  rawFiles: File[];
  documents: ParsedDocument[];
  isProcessing: boolean;
  progress: { current: number; total: number; filename: string };
  scannedCount: number;
  encryptedCount: number;
  query: string;
  searchOptions: SearchOptions;
  searchResults: DocumentSearchResult[];
  auditRequirements: AuditRequirement[];
  auditResults: DocumentAuditResult[];
  freemium: FreemiumState;
  isPaywallOpen: boolean;
  selectedPreview: { doc: ParsedDocument; pageNumber?: number; highlightQuery?: string } | null;
  lang: 'en' | 'it';
  setLang: (l: 'en' | 'it') => void;
  t: (key: keyof typeof translations['en']) => string;

  // Actions
  loadFiles: (files: File[]) => void;
  cancelProcessing: () => void;
  setQuery: (q: string) => void;
  setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
  runSearch: (customQuery?: string) => void;
  addAuditRequirement: (label?: string, query?: string) => void;
  removeAuditRequirement: (id: string) => void;
  updateAuditRequirement: (id: string, label: string, query: string) => void;
  runAudit: () => void;
  openPaywall: () => void;
  closePaywall: () => void;
  unlockWithToken: (token: string, maxDocs?: number, plan?: FreemiumState['plan']) => void;
  openPreview: (doc: ParsedDocument, pageNumber?: number, highlightQuery?: string) => void;
  closePreview: () => void;
  resetAll: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const DEFAULT_AUDIT_REQUIREMENTS: AuditRequirement[] = [
  { id: '1', label: 'GDPR / Privacy', query: 'GDPR' },
  { id: '2', label: 'Right of Withdrawal', query: 'withdrawal' },
  { id: '3', label: 'Automatic Renewal', query: 'automatic renewal' },
];

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<ParsedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, filename: '' });
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [query, setQuery] = useState<string>('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    isRegex: false,
    useBoolean: true,
  });

  const [searchResults, setSearchResults] = useState<DocumentSearchResult[]>([]);
  const [auditRequirements, setAuditRequirements] = useState<AuditRequirement[]>(DEFAULT_AUDIT_REQUIREMENTS);
  const [auditResults, setAuditResults] = useState<DocumentAuditResult[]>([]);
  
  const [freemium, setFreemium] = useState<FreemiumState>(getStoredFreemiumState());
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [selectedPreview, setSelectedPreview] = useState<{ doc: ParsedDocument; pageNumber?: number; highlightQuery?: string } | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const t = useCallback((key: keyof typeof translations['en']) => {
    return translations[lang][key] || translations['en'][key] || key;
  }, [lang]);

  // Compute counts
  const scannedCount = documents.filter(d => d.isScanned).length;
  const encryptedCount = documents.filter(d => d.isEncrypted).length;

  const openPaywall = useCallback(() => {
    setIsPaywallOpen(true);
    trackEvent('pricing_viewed');
  }, []);

  const closePaywall = useCallback(() => {
    setIsPaywallOpen(false);
  }, []);

  const unlockWithToken = useCallback((token: string, maxDocs: number = 500, plan: FreemiumState['plan'] = 'batch_100') => {
    const newState: FreemiumState = {
      isUnlocked: true,
      maxDocs,
      token,
      plan,
    };
    setFreemium(newState);
    saveFreemiumState(newState);
    setIsPaywallOpen(false);
    trackEvent('purchase_completed');
  }, []);

  const openPreview = useCallback((doc: ParsedDocument, pageNumber?: number, highlightQuery?: string) => {
    setSelectedPreview({ doc, pageNumber, highlightQuery: highlightQuery || query });
  }, [query]);

  const closePreview = useCallback(() => {
    setSelectedPreview(null);
  }, []);

  const cancelProcessing = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
    setIsProcessing(false);
  }, [abortController]);

  // Load and start parsing
  const loadFiles = useCallback(async (incomingFiles: File[]) => {
    // Filter only PDF files
    const pdfFiles = incomingFiles.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    
    if (pdfFiles.length === 0) return;

    setRawFiles(pdfFiles);
    trackEvent('files_selected', { count: pdfFiles.length });

    // Check freemium limit
    if (!freemium.isUnlocked && pdfFiles.length > FREE_PDF_LIMIT) {
      // User has more than 10 files and is on free plan
      // We will still process them or show paywall
      openPaywall();
    }

    const controller = new AbortController();
    setAbortController(controller);
    setIsProcessing(true);
    setProgress({ current: 0, total: pdfFiles.length, filename: pdfFiles[0]?.name || '' });
    trackEvent('processing_started');

    try {
      const parsedDocs = await parseMultiplePDFs(
        pdfFiles,
        (current, total, filename) => {
          setProgress({ current, total, filename });
        },
        controller.signal
      );

      setDocuments(parsedDocs);
      setIsProcessing(false);
      trackEvent('processing_completed', { count: parsedDocs.length });

      if (parsedDocs.some(d => d.isScanned)) {
        trackEvent('scanned_pdf_detected');
      }
    } catch (err) {
      console.error('Error during bulk processing:', err);
      setIsProcessing(false);
    }
  }, [freemium.isUnlocked, openPaywall]);

  // Search function
  const runSearch = useCallback((customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : query;
    if (!q.trim() || documents.length === 0) {
      setSearchResults([]);
      return;
    }

    const results = searchDocuments(documents, q, searchOptions);
    setSearchResults(results);
    trackEvent('search_performed', { total_matches: results.reduce((acc, r) => acc + r.totalMatches, 0) });
  }, [documents, query, searchOptions]);

  // Document Audit function
  const runAudit = useCallback(() => {
    if (documents.length === 0 || auditRequirements.length === 0) {
      setAuditResults([]);
      return;
    }

    trackEvent('audit_started', { requirements_count: auditRequirements.length });

    const results: DocumentAuditResult[] = documents.map(doc => {
      const requirementsStatus: Record<string, { found: boolean; count: number; pages: number[] }> = {};
      let passedAll = true;

      for (const req of auditRequirements) {
        if (!req.query.trim()) continue;
        
        const regex = buildSearchRegex(req.query, {
          caseSensitive: false,
          wholeWord: false,
          isRegex: false,
          useBoolean: false,
        });

        if (!regex) {
          requirementsStatus[req.id] = { found: false, count: 0, pages: [] };
          passedAll = false;
          continue;
        }

        let count = 0;
        const pages: number[] = [];

        for (const page of doc.pages) {
          const m = page.text.match(regex);
          if (m && m.length > 0) {
            count += m.length;
            pages.push(page.pageNumber);
          }
        }

        const found = count > 0;
        requirementsStatus[req.id] = { found, count, pages };
        if (!found) {
          passedAll = false;
        }
      }

      return {
        documentId: doc.id,
        documentName: doc.name,
        isScanned: doc.isScanned,
        passedAll,
        requirementsStatus,
        rawFile: doc.rawFile,
      };
    });

    setAuditResults(results);
  }, [documents, auditRequirements]);

  const addAuditRequirement = useCallback((label?: string, reqQuery?: string) => {
    const newId = String(Date.now());
    setAuditRequirements(prev => [
      ...prev,
      { id: newId, label: label || `Requirement ${prev.length + 1}`, query: reqQuery || '' }
    ]);
  }, []);

  const removeAuditRequirement = useCallback((id: string) => {
    setAuditRequirements(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateAuditRequirement = useCallback((id: string, label: string, reqQuery: string) => {
    setAuditRequirements(prev => prev.map(r => r.id === id ? { ...r, label, query: reqQuery } : r));
  }, []);

  const resetAll = useCallback(() => {
    setRawFiles([]);
    setDocuments([]);
    setSearchResults([]);
    setAuditResults([]);
    setQuery('');
    setProgress({ current: 0, total: 0, filename: '' });
  }, []);

  // Auto run search when query or options change if documents are loaded
  useEffect(() => {
    if (query.trim() && documents.length > 0) {
      runSearch(query);
    }
  }, [query, searchOptions, documents, runSearch]);

  // Auto run audit if audit requirements or documents change
  useEffect(() => {
    if (documents.length > 0 && auditRequirements.length > 0) {
      runAudit();
    }
  }, [documents, auditRequirements, runAudit]);

  return (
    <DocumentContext.Provider
      value={{
        rawFiles,
        documents,
        isProcessing,
        progress,
        scannedCount,
        encryptedCount,
        query,
        searchOptions,
        searchResults,
        auditRequirements,
        auditResults,
        freemium,
        isPaywallOpen,
        selectedPreview,
        lang,
        setLang,
        t,
        loadFiles,
        cancelProcessing,
        setQuery,
        setSearchOptions,
        runSearch,
        addAuditRequirement,
        removeAuditRequirement,
        updateAuditRequirement,
        runAudit,
        openPaywall,
        closePaywall,
        unlockWithToken,
        openPreview,
        closePreview,
        resetAll,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
