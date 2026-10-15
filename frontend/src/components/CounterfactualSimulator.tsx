import React from 'react';
import { 
  FlaskConical, 
  Lock, 
  Unlock, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Share2, 
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { GraphNodeData, GraphEdgeData } from '../types';

interface CounterfactualSimulatorProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  frozenNodeIds: Set<string>;
  onToggleFreeze: (nodeId: string) => void;
  onClearAllFreezes: () => void;
  onOpenGraph: () => void;
}

export const CounterfactualSimulator: React.FC<CounterfactualSimulatorProps> = ({
  nodes,
  edges,
  frozenNodeIds,
  onToggleFreeze,
  onClearAllFreezes,
  onOpenGraph,
}) => {
  // Calculate simulated impact
  const highRiskNodes = nodes.filter((n) => n.riskScore > 75);

  let blockedVolume = 0;
  let severedEdgesCount = 0;

  edges.forEach((e) => {
    if (frozenNodeIds.has(e.source) || frozenNodeIds.has(e.target)) {
      severedEdgesCount++;
      if (e.amount > 0) {
        blockedVolume += e.amount;
      }
    }
  });

  // Calculate cluster fragility metric (percentage of total high-risk flow mitigated)
  const totalHighRiskVolume = 480000;
  const fragilityPercentage = Math.min(
    100,
    Math.round((blockedVolume / totalHighRiskVolume) * 100)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Signature Feature Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 p-6 rounded-2xl border border-indigo-800/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-900 text-indigo-300 border border-indigo-700/60 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Anvik Signature Capability</span>
            </span>
            <span className="text-xs text-slate-400">Counterfactual Graph Fragility Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Intervention Simulation & Fragility Analysis
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Hypothetically sever bridges, mule hubs, or shared devices to evaluate ring vulnerability.
            Identify high-leverage intervention targets before issuing administrative lien freezes.
          </p>
        </div>

        {frozenNodeIds.size > 0 && (
          <button
            onClick={onClearAllFreezes}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all self-start md:self-center"
          >
            <span>Reset Simulated Interventions ({frozenNodeIds.size})</span>
          </button>
        )}
      </div>

      {/* Realtime Impact Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Intervened Nodes</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              {frozenNodeIds.size}
            </span>
            <span className="text-xs text-slate-500">of {nodes.length} entities</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active hypothetical lien locks</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Mitigated Outflow</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              ₹{(blockedVolume / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-500">blocked</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Downstream cashout disrupted</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Severed Flow Edges</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {severedEdgesCount}
            </span>
            <span className="text-xs text-slate-500">broken paths</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Graph connectivity disrupted</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Ring Fragility Coefficient</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-purple-400">
              {fragilityPercentage}%
            </span>
            <span className="text-xs text-slate-500">vulnerability</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Disruption of primary syndicate</p>
        </div>
      </div>

      {/* Candidate Nodes for Intervention */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Target Entities for Intervention</h3>
            <p className="text-xs text-slate-400">
              Toggle administrative lien freeze to see simulated real-time impact on the graph.
            </p>
          </div>
          <button
            onClick={onOpenGraph}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <span>Inspect in Cytoscape Canvas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highRiskNodes.map((n) => {
            const isFrozen = frozenNodeIds.has(n.id);
            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isFrozen
                    ? 'bg-rose-950/20 border-rose-800/80 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white truncate">
                      {n.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        n.riskScore > 85 ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      {n.riskScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 capitalize">{n.subText || n.type}</p>
                  <p className="text-[10px] text-slate-500 font-mono">ID: {n.id}</p>
                </div>

                <button
                  onClick={() => onToggleFreeze(n.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isFrozen
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {isFrozen ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Reactivate</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Simulate Freeze</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
