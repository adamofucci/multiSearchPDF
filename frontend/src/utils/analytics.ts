/**
 * Privacy-First Analytics Helper
 * 
 * STRICT PRIVACY RULE:
 * NEVER send document content, search terms, filenames, or extracted text.
 * Only functional metric counters.
 */

export type AnalyticsEvent = 
  | 'page_view'
  | 'upload_started'
  | 'files_selected'
  | 'processing_started'
  | 'processing_completed'
  | 'search_performed'
  | 'audit_started'
  | 'export_csv'
  | 'export_json'
  | 'download_zip'
  | 'scanned_pdf_detected'
  | 'pricing_viewed'
  | 'checkout_started'
  | 'purchase_completed';

export function trackEvent(event: AnalyticsEvent, metadata?: Record<string, number | boolean | string>) {
  if (typeof window === 'undefined') return;

  // Sanitize metadata to ensure no strings with user text are accidentally forwarded
  const safeData: Record<string, any> = {};
  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'number' || typeof value === 'boolean') {
        safeData[key] = value;
      }
    }
  }

  // Google Analytics 4 integration if present
  if ((window as any).gtag) {
    (window as any).gtag('event', event, safeData);
  }

  // Plausible integration if present
  if ((window as any).plausible) {
    (window as any).plausible(event, { props: safeData });
  }

  if (import.meta.env.DEV) {
    console.log(`[Privacy-Safe Analytics] Event: ${event}`, safeData);
  }
}
