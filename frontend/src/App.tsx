import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DocumentProvider } from './context/DocumentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PaywallModal } from './components/PaywallModal';
import { PDFPreviewModal } from './components/PDFPreviewModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AuditPage } from './pages/AuditPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SeoLandingPage } from './pages/SeoLandingPage';

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <DocumentProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-slate-950 font-sans">
            <Navbar />
            
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                
                {/* High Intent SEO landing routes */}
                <Route path="/search-multiple-pdfs" element={<SeoLandingPage />} />
                <Route path="/find-text-in-multiple-pdfs" element={<SeoLandingPage />} />
                <Route path="/pdf-document-audit" element={<SeoLandingPage />} />
                <Route path="/find-word-in-multiple-pdfs" element={<SeoLandingPage />} />
                <Route path="/search-pdf-folder" element={<SeoLandingPage />} />
                <Route path="/cerca-in-piu-pdf" element={<SeoLandingPage />} />

                {/* Fallback route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>

            <Footer />

            {/* Global Modals */}
            <PaywallModal />
            <PDFPreviewModal />
          </div>
        </BrowserRouter>
      </DocumentProvider>
    </HelmetProvider>
  );
};
