import { ParsedDocument, DocumentSearchResult, SearchOptions, MatchSnippet } from '../types';

/**
 * Escapes regex special characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates snippets around matches in text
 */
function extractSnippets(text: string, regex: RegExp, pageNumber: number, maxSnippetsPerPage: number = 3): MatchSnippet[] {
  const snippets: MatchSnippet[] = [];
  let match: RegExpExecArray | null;
  
  // Clone regex with global flag to iterate
  const globalRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  
  let count = 0;
  while ((match = globalRegex.exec(text)) !== null && count < maxSnippetsPerPage) {
    const matchIndex = match.index;
    const matchLength = match[0].length;
    
    // Window of 60 chars before and 60 chars after
    const start = Math.max(0, matchIndex - 60);
    const end = Math.min(text.length, matchIndex + matchLength + 60);
    
    let snippet = text.substring(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    snippets.push({
      pageNumber,
      snippet,
      matchIndex,
    });
    count++;
  }
  
  return snippets;
}

/**
 * Builds a regex pattern based on query and search options
 */
export function buildSearchRegex(query: string, options: SearchOptions): RegExp | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const flags = options.caseSensitive ? 'g' : 'gi';

  if (options.isRegex) {
    try {
      return new RegExp(trimmed, flags);
    } catch {
      return null;
    }
  }

  // Handle boolean OR / AND if enabled
  if (options.useBoolean && (trimmed.includes(' OR ') || trimmed.includes(' AND '))) {
    if (trimmed.includes(' OR ')) {
      const parts = trimmed.split(' OR ').map(p => escapeRegExp(p.trim())).filter(Boolean);
      const pattern = options.wholeWord ? `\\b(${parts.join('|')})\\b` : `(${parts.join('|')})`;
      return new RegExp(pattern, flags);
    }
  }

  const escaped = escapeRegExp(trimmed);
  const pattern = options.wholeWord ? `\\b${escaped}\\b` : escaped;
  return new RegExp(pattern, flags);
}

/**
 * Searches across all parsed documents
 */
export function searchDocuments(
  documents: ParsedDocument[],
  query: string,
  options: SearchOptions
): DocumentSearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Special handling for Boolean AND: all words must be present in doc
  const isBooleanAnd = options.useBoolean && trimmed.includes(' AND ');
  const andTerms = isBooleanAnd ? trimmed.split(' AND ').map(t => t.trim()).filter(Boolean) : [];

  const regex = buildSearchRegex(query, options);
  if (!regex && !isBooleanAnd) return [];

  return documents.map((doc) => {
    if (doc.error || doc.totalPages === 0) {
      return {
        documentId: doc.id,
        documentName: doc.name,
        totalMatches: 0,
        pagesFound: [],
        snippets: [],
        hasMatch: false,
        isScanned: doc.isScanned,
        error: doc.error,
        rawFile: doc.rawFile,
      };
    }

    // Boolean AND check across whole document
    if (isBooleanAnd) {
      const allFound = andTerms.every(term => {
        const termRegex = new RegExp(escapeRegExp(term), options.caseSensitive ? '' : 'i');
        return termRegex.test(doc.fullText);
      });

      if (!allFound) {
        return {
          documentId: doc.id,
          documentName: doc.name,
          totalMatches: 0,
          pagesFound: [],
          snippets: [],
          hasMatch: false,
          isScanned: doc.isScanned,
          rawFile: doc.rawFile,
        };
      }
    }

    let totalMatches = 0;
    const pagesFound: number[] = [];
    const snippets: MatchSnippet[] = [];

    // Search page by page for precise page numbers & snippet contexts
    for (const page of doc.pages) {
      if (!page.text) continue;
      
      const searchTargetRegex = regex || new RegExp(escapeRegExp(andTerms[0] || trimmed), options.caseSensitive ? 'g' : 'gi');
      const pageMatches = page.text.match(searchTargetRegex);
      
      if (pageMatches && pageMatches.length > 0) {
        totalMatches += pageMatches.length;
        pagesFound.push(page.pageNumber);
        
        const pageSnippets = extractSnippets(page.text, searchTargetRegex, page.pageNumber);
        snippets.push(...pageSnippets);
      }
    }

    return {
      documentId: doc.id,
      documentName: doc.name,
      totalMatches,
      pagesFound,
      snippets,
      hasMatch: totalMatches > 0,
      isScanned: doc.isScanned,
      rawFile: doc.rawFile,
    };
  });
}
