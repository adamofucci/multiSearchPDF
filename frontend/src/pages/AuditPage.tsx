import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckSquare } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { DropZone } from '../components/DropZone';
import { ProcessingProgress } from '../components/ProcessingProgress';
import { AuditBuilder } from '../components/AuditBuilder';
import { AuditMatrix } from '../components/AuditMatrix';

export const AuditPage: React.FC = () => {
  const { documents } = useDocuments();

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <Helmet>
        <title>Document Audit Matrix — Check Clauses Across Multiple PDFs</title>
        <meta 
          name="description" 
          content="Audit multiple contracts and PDF documents against custom criteria. See compliance at a glance with interactive pass/fail checkmarks." 
        />
      </Helmet>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>DOCUMENT AUDIT ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Multi-Document Compliance Audit
          </h1>
          <p className="text-slate-400 text-sm">
            Check multiple requirements across your PDF files. Identify compliant files and flag documents needing manual legal review.
          </p>
        </div>

        {/* Dropzone or Audit Tool */}
        {documents.length === 0 ? (
          <div className="space-y-6">
            <DropZone />
            <ProcessingProgress />
          </div>
        ) : (
          <div className="space-y-6">
            <ProcessingProgress />
            <AuditBuilder />
            <AuditMatrix />
          </div>
        )}
      </main>
    </div>
  );
};
