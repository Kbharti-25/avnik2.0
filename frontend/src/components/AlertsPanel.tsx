import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ChevronRight, 
  ExternalLink, 
  FileCheck, 
  Clock, 
  Zap, 
  Layers, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { SuspiciousAlert } from '../types';

interface AlertsPanelProps {
  alerts: SuspiciousAlert[];
  onInvestigateInGraph: (clusterId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onInvestigateInGraph,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-400 border border-rose-800">
              Explainable Decision Support
            </span>
            <span className="text-xs text-slate-400">
              Deterministic Rules Engine + NetworkX Scoring
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Evidence-Linked Fraud Ring Alerts
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Suspicious transaction patterns scored transparently with linked evidence metrics,
            hardware collusion fingerprints, and chronological velocity indicators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Rings</span>
            <p className="text-xl font-bold font-mono text-rose-400">3</p>
          </div>
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Flagged Volume</span>
            <p className="text-xl font-bold font-mono text-white">₹8.45L</p>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all p-5 shadow-lg space-y-4"
          >
            {/* Alert Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}
                    >
                      {alert.severity} • RISK {alert.riskScore}/100
                    </span>
                    <span className="text-xs font-mono text-slate-500">{alert.id}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{alert.detectedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{alert.title}</h3>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onInvestigateInGraph(alert.clusterId)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all self-start sm:self-center"
              >
                <span>Spotlight in Graph Canvas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Summary sentence */}
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              <span className="text-slate-400 font-semibold">Incident Synopsis: </span>
              {alert.summary}
            </p>

            {/* Evidence Breakdown (Transparent Explainability) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supporting Evidence Metrics & Deterministic Rules</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {alert.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-cyan-400 font-mono">
                        {ev.ruleId}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Verified</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200">{ev.ruleName}</p>
                    <p className="text-[11px] text-slate-400 leading-normal">{ev.description}</p>

                    {/* Metric Pills */}
                    <div className="pt-2 border-t border-slate-800/70 flex flex-wrap gap-1.5">
                      {Object.entries(ev.metrics).map(([k, v]) => (
                        <div
                          key={k}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                        >
                          <span className="text-slate-500">{k}:</span>
                          <span className="font-semibold text-white font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  <strong className="text-slate-200">Recommended Next Step: </strong>
                  {alert.suggestedAction}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Total At-Risk Exposure: ₹{alert.totalVolume.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
