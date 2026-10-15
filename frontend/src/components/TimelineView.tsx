import React, { useState } from 'react';
import { 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  Timer, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filteredEvents = flaggedOnly ? events.filter((e) => e.isFlagged) : events;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
              Chronological Propagation
            </span>
            <span className="text-xs text-slate-400">Rapid Dispersion & Velocity Tracking</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Transaction Velocity & Time Delta Sequence
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Tracks rapid multi-hop transfers to illustrate how quickly funds leave the victim's
            account and disperse across mule accounts into cashout merchant points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlaggedOnly(!flaggedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              flaggedOnly
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{flaggedOnly ? 'Showing Flagged Only' : 'Show All Txns'}</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-rose-500 before:to-purple-500">
        {filteredEvents.map((evt, idx) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot Indicator */}
            <div
              className={`absolute -left-[27px] top-4 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center transition-all ${
                evt.isFlagged
                  ? 'bg-rose-500 ring-4 ring-rose-500/20'
                  : 'bg-cyan-500 ring-4 ring-cyan-500/20'
              }`}
            />

            {/* Event Card */}
            <div
              className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                evt.isFlagged
                  ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/40'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <Clock className="w-3 h-3 text-cyan-500" />
                    <span>{evt.timestamp} IST</span>
                  </div>
                  {evt.timeDeltaSeconds !== undefined && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
                      <Timer className="w-3 h-3" />
                      <span>+{evt.timeDeltaSeconds}s after prior hop</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">UTR: {evt.utr}</span>
                  <span className="text-base font-bold font-mono text-white">
                    ₹{evt.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Sender & Receiver Nodes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Originator</span>
                    <p className="text-xs font-semibold text-slate-200">{evt.senderName}</p>
                    <p className="text-[11px] font-mono text-slate-400">{evt.sender}</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Beneficiary</span>
                    <p className="text-xs font-semibold text-slate-200">{evt.receiverName}</p>
                    <p className="text-[11px] font-mono text-slate-400">{evt.receiver}</p>
                  </div>
                </div>

                {/* Anomaly Badge */}
                {evt.anomalyReason && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-800/60 self-start sm:self-auto">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{evt.anomalyReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
