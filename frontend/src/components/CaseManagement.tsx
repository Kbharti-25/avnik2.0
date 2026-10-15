import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  User, 
  Clock, 
  Plus, 
  Send, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { CaseFile } from '../types';

interface CaseManagementProps {
  cases: CaseFile[];
  onAddNote: (caseId: string, noteText: string) => void;
  onUpdateStatus: (caseId: string, newStatus: CaseFile['status']) => void;
}

export const CaseManagement: React.FC<CaseManagementProps> = ({
  cases,
  onAddNote,
  onUpdateStatus,
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(cases[0]?.id || '');
  const [newNote, setNewNote] = useState('');

  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !currentCase) return;
    onAddNote(currentCase.id, newNote);
    setNewNote('');
  };

  const handleExportSummary = () => {
    if (!currentCase) return;
    const report = {
      caseId: currentCase.id,
      title: currentCase.title,
      analyst: currentCase.analyst,
      status: currentCase.status,
      flaggedVolume: currentCase.flaggedVolume,
      notes: currentCase.notes,
      exportedAt: new Date().toISOString(),
      disclaimer: 'Generated via Anvik Synthetic Decision Support System. Not conclusive legal proof.',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase.id}_Dossier_Export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
              Investigation Records
            </span>
            <span className="text-xs text-slate-400">Auditable Case Files & LEA Escalations</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Case Management & Investigation Dossiers
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Maintain tamper-evident audit trails, analyst findings, entity bookmarks, and
            law-enforcement escalation dossiers.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Case Dossier (JSON)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cases Sidebar List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Case Files ({cases.length})
          </span>
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeCaseId === c.id
                  ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">{c.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    c.status === 'IN_REVIEW'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-1">{c.title}</h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                <span>Exposure: ₹{(c.flaggedVolume / 1000).toFixed(0)}k</span>
                <span>{c.notes.length} notes</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Case Detail Dossier */}
        {currentCase && (
          <div className="md:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* Case Dossier Title & Metadata */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {currentCase.id}
                </span>
                {/* Status Switcher */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={currentCase.status}
                    onChange={(e) =>
                      onUpdateStatus(currentCase.id, e.target.value as CaseFile['status'])
                    }
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-medium focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="ESCALATED_LEAS">Escalated to LEAs</option>
                    <option value="RESOLVED">Resolved / Closed</option>
                  </select>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">{currentCase.title}</h3>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lead: <strong className="text-slate-300">{currentCase.analyst}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Initiated: <span className="font-mono">{currentCase.createdAt}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Flagged Volume:</span>
                  <span className="font-mono font-bold text-rose-400">
                    ₹{currentCase.flaggedVolume.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Audit Log */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Investigator Chronology & Notes ({currentCase.notes.length})
              </span>

              <div className="space-y-3">
                {currentCase.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-200">{n.author}</span>
                      <span className="font-mono text-[11px] text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handlePostNote} className="space-y-2 pt-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record an analytical observation or LEA communication note..."
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Record Case Note</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
