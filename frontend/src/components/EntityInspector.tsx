import React from 'react';
import { 
  X, 
  ShieldAlert, 
  Smartphone, 
  Store, 
  FileText, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  Unlock, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { GraphNodeData, GraphEdgeData } from '../types';

interface EntityInspectorProps {
  entity: GraphNodeData | null;
  onClose: () => void;
  edges: GraphEdgeData[];
  nodes: GraphNodeData[];
  isFrozen: boolean;
  onToggleFreeze: (nodeId: string) => void;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({
  entity,
  onClose,
  edges,
  nodes,
  isFrozen,
  onToggleFreeze,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!entity) return null;

  // Find incoming and outgoing edges
  const relatedEdges = edges.filter(
    (e) => e.source === entity.id || e.target === entity.id
  );

  const inboundEdges = relatedEdges.filter((e) => e.target === entity.id && e.amount > 0);
  const outboundEdges = relatedEdges.filter((e) => e.source === entity.id && e.amount > 0);
  const deviceEdges = relatedEdges.filter((e) => e.channel === 'DEVICE_BIND');

  const totalInflow = inboundEdges.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflow = outboundEdges.reduce((acc, curr) => acc + curr.amount, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 flex flex-col h-full shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {entity.type === 'account' && <UserCheck className="w-5 h-5 text-cyan-400" />}
          {entity.type === 'device' && <Smartphone className="w-5 h-5 text-amber-400" />}
          {entity.type === 'merchant' && <Store className="w-5 h-5 text-purple-400" />}
          {entity.type === 'complaint' && <FileText className="w-5 h-5 text-rose-400" />}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Entity Inspector</h3>
            <p className="text-[11px] text-slate-400 capitalize">{entity.type} node</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main Entity Card */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 relative overflow-hidden">
          {/* Risk Gauge Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Identifier</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-mono font-bold text-white break-all">
                  {entity.label}
                </span>
                <button
                  onClick={() => copyToClipboard(entity.label)}
                  title="Copy identifier"
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {entity.subText && <p className="text-xs text-slate-400">{entity.subText}</p>}
            </div>

            {/* Risk Score Pill */}
            <div
              className={`flex flex-col items-end px-2.5 py-1.5 rounded-lg border ${
                entity.riskScore > 80
                  ? 'bg-rose-950/60 border-rose-800/80 text-rose-400'
                  : entity.riskScore > 50
                  ? 'bg-amber-950/60 border-amber-800/80 text-amber-400'
                  : 'bg-cyan-950/60 border-cyan-800/80 text-cyan-400'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold">Risk Score</span>
              <span className="text-lg font-black font-mono leading-none">{entity.riskScore}</span>
            </div>
          </div>

          {/* Tags */}
          {entity.tags && entity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
              {entity.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Counterfactual Simulation Quick Action */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 rounded-xl p-3.5 border border-indigo-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300">Counterfactual "What-If" Test</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-200">
              {isFrozen ? 'Lien Frozen' : 'Live Node'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Simulate administrative freeze to observe ring disruption and severed flow in graph.
          </p>
          <button
            onClick={() => onToggleFreeze(entity.id)}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              isFrozen
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
            }`}
          >
            {isFrozen ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Reactivate Node in Graph</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Simulate Immediate Freeze</span>
              </>
            )}
          </button>
        </div>

        {/* Financial Flow Summary */}
        {entity.type === 'account' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Total Inflow</span>
              </div>
              <span className="text-base font-bold font-mono text-white">
                ₹{totalInflow.toLocaleString('en-IN')}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">{inboundEdges.length} transactions</p>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Total Outflow</span>
              </div>
              <span className="text-base font-bold font-mono text-white">
                ₹{totalOutflow.toLocaleString('en-IN')}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">{outboundEdges.length} transactions</p>
            </div>
          </div>
        )}

        {/* Bound Hardware Devices (Critical for PS-16 shared device detection) */}
        {deviceEdges.length > 0 && (
          <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Hardware Device Associations</span>
            </span>
            {deviceEdges.map((de) => {
              const devNode = nodes.find((n) => n.id === de.source);
              return (
                <div key={de.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-amber-300 font-mono">
                    <span>{devNode?.label || de.source}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-400 rounded">
                      Root / Multi-VPA
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {devNode?.deviceModel || 'Associated IMEI Fingerprint'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Transaction History stream */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300">Transaction Trail</span>
          <div className="space-y-1.5">
            {relatedEdges.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">No transactions recorded</p>
            ) : (
              relatedEdges.map((edge) => {
                const isOut = edge.source === entity.id;
                const otherNodeId = isOut ? edge.target : edge.source;
                const otherNode = nodes.find((n) => n.id === otherNodeId);

                return (
                  <div
                    key={edge.id}
                    className={`p-2.5 rounded-lg border text-xs transition-colors ${
                      edge.isSuspicious
                        ? 'bg-rose-950/20 border-rose-900/50 hover:bg-rose-950/30'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isOut ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span className="font-medium text-slate-200">
                          {isOut ? 'Sent to' : 'Received from'}{' '}
                          <span className="text-cyan-400 font-mono text-[11px]">
                            {otherNode?.label || otherNodeId}
                          </span>
                        </span>
                      </div>
                      <span className="font-mono font-bold text-white">
                        {edge.amount > 0 ? `₹${edge.amount.toLocaleString('en-IN')}` : edge.channel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{edge.timestamp}</span>
                      <span>UTR: {edge.utr}</span>
                    </div>

                    {edge.ruleTriggered && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-rose-400 font-sans">
                        Trigger: <span className="font-semibold">{edge.ruleTriggered}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
