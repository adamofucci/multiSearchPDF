import JSZip from 'jszip';
import { DocumentSearchResult, DocumentAuditResult, AuditRequirement } from '../types';

/**
 * Downloads a text/csv file in the browser
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports single search results to CSV
 */
export function exportSearchToCSV(results: DocumentSearchResult[], query: string) {
  const headers = ['Filename', 'Status', 'Matches', 'Pages', 'Search Term'];
  const rows = results.map(r => [
    `"${r.documentName.replace(/"/g, '""')}"`,
    r.hasMatch ? 'FOUND' : 'NOT FOUND',
    r.totalMatches,
    `"${r.pagesFound.join(', ')}"`,
    `"${query.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `docsweep-search-results-${Date.now()}.csv`);
}

/**
 * Exports single search results to JSON
 */
export function exportSearchToJSON(results: DocumentSearchResult[], query: string) {
  const data = {
    query,
    exportedAt: new Date().toISOString(),
    totalDocuments: results.length,
    documentsWithMatch: results.filter(r => r.hasMatch).length,
    results: results.map(r => ({
      name: r.documentName,
      hasMatch: r.hasMatch,
      matches: r.totalMatches,
      pages: r.pagesFound,
      snippets: r.snippets.map(s => ({ page: s.pageNumber, text: s.snippet }))
    }))
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `docsweep-search-${Date.now()}.json`);
}

/**
 * Exports Audit Matrix to CSV
 */
export function exportAuditToCSV(auditResults: DocumentAuditResult[], requirements: AuditRequirement[]) {
  const headers = ['Filename', 'Status', ...requirements.map(req => `"${req.label.replace(/"/g, '""')}"`)];
  
  const rows = auditResults.map(r => {
    const status = r.passedAll ? 'PASSED' : 'NEEDS REVIEW';
    const requirementColumns = requirements.map(req => {
      const statusObj = r.requirementsStatus[req.id];
      if (!statusObj) return '✗';
      return statusObj.found ? `✓ (${statusObj.count})` : '✗';
    });

    return [
      `"${r.documentName.replace(/"/g, '""')}"`,
      status,
      ...requirementColumns
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `docsweep-audit-matrix-${Date.now()}.csv`);
}

/**
 * Packages selected PDF Files into a ZIP archive and triggers download
 */
export async function downloadFilesAsZip(
  files: File[], 
  zipName: string,
  onProgress?: (progressPercent: number) => void
) {
  const zip = new JSZip();
  
  // Add files to zip
  files.forEach((file) => {
    zip.file(file.name, file);
  });

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(metadata.percent);
    }
  });

  downloadBlob(content, `${zipName}.zip`);
}
