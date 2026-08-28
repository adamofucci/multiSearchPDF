import React from 'react';
import { Plus, Trash2, Sparkles, CheckSquare } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export const AuditBuilder: React.FC = () => {
  const { 
    auditRequirements, 
    addAuditRequirement, 
    removeAuditRequirement, 
    updateAuditRequirement, 
    runAudit,
    documents 
  } = useDocuments();

  const presets = [
    {
      name: 'Contract Due Diligence',
      items: [
        { label: 'Termination / Recesso', query: 'termination' },
        { label: 'Auto Renewal / Rinnovo', query: 'automatic renewal' },
        { label: 'Governing Law / Giurisdizione', query: 'governing law' },
        { label: 'Confidentiality / NDA', query: 'confidentiality' }
      ]
    },
    {
      name: 'GDPR & Compliance',
      items: [
        { label: 'GDPR Compliance', query: 'GDPR' },
        { label: 'Data Retention', query: 'retention' },
        { label: 'Data Breach Notice', query: 'data breach' },
        { label: 'DPO / Privacy Officer', query: 'data protection officer' }
      ]
    },
    {
      name: 'Procurement & SLA',
      items: [
        { label: 'Payment Terms / 30 Days', query: '30 days' },
        { label: 'Warranty / Garanzia', query: 'warranty' },
        { label: 'Liability Limitation', query: 'limitation of liability' },
        { label: 'Penalties / Penali', query: 'penalty' }
      ]
    }
  ];

  const applyPreset = (items: { label: string; query: string }[]) => {
    // Clear and set items
    items.forEach((item, idx) => {
      if (idx === 0) {
        updateAuditRequirement(auditRequirements[0]?.id || '1', item.label, item.query);
      } else if (auditRequirements[idx]) {
        updateAuditRequirement(auditRequirements[idx].id, item.label, item.query);
      } else {
        addAuditRequirement(item.label, item.query);
      }
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-400" />
            Audit Criteria & Clauses
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Define requirements to audit across all {documents.length} loaded documents simultaneously.
          </p>
        </div>

        {/* Add Requirement Button */}
        <button
          type="button"
          onClick={() => addAuditRequirement()}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-brand-400" />
          Add Requirement
        </button>
      </div>

      {/* Requirement Input Rows */}
      <div className="space-y-3">
        {auditRequirements.map((req, index) => (
          <div key={req.id} className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-1/3">
              <span className="text-xs font-mono font-bold text-slate-500 w-6">#{index + 1}</span>
              <input
                type="text"
                value={req.label}
                onChange={(e) => updateAuditRequirement(req.id, e.target.value, req.query)}
                placeholder="Requirement Label (e.g. GDPR)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-brand-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:flex-1">
              <input
                type="text"
                value={req.query}
                onChange={(e) => updateAuditRequirement(req.id, req.label, e.target.value)}
                placeholder="Search phrase / keywords to match..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-brand-400 focus:outline-none"
              />

              {auditRequirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAuditRequirement(req.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-400" />
          Industry Presets:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => applyPreset(preset.items)}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};
