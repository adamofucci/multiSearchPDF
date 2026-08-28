export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface ParsedDocument {
  id: string;
  name: string;
  size: number;
  totalPages: number;
  pages: DocumentPage[];
  fullText: string;
  isScanned: boolean; // Detected if text length is 0 or suspiciously low
  isEncrypted: boolean;
  error?: string;
  rawFile: File;
}

export interface MatchSnippet {
  pageNumber: number;
  snippet: string;
  matchIndex: number;
}

export interface DocumentSearchResult {
  documentId: string;
  documentName: string;
  totalMatches: number;
  pagesFound: number[];
  snippets: MatchSnippet[];
  hasMatch: boolean;
  isScanned: boolean;
  error?: string;
  rawFile: File;
}

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  isRegex: boolean;
  useBoolean: boolean; // AND, OR
}

export interface AuditRequirement {
  id: string;
  label: string;
  query: string;
}

export interface DocumentAuditResult {
  documentId: string;
  documentName: string;
  isScanned: boolean;
  passedAll: boolean;
  requirementsStatus: Record<string, { found: boolean; count: number; pages: number[] }>;
  rawFile: File;
}

export interface FreemiumState {
  isUnlocked: boolean;
  maxDocs: number;
  token: string | null;
  plan: 'free' | 'batch_100' | 'batch_500' | 'batch_pro';
}
