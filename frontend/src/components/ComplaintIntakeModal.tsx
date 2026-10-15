import React, { useState } from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { GraphNodeData, GraphEdgeData } from '../types';

interface ComplaintIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComplaint: (newComplaintNode: GraphNodeData, newEdge: GraphEdgeData) => void;
  existingAccounts: GraphNodeData[];
}

export const ComplaintIntakeModal: React.FC<ComplaintIntakeModalProps> = ({
  isOpen,
  onClose,
  onAddComplaint,
  existingAccounts,
}) => {
  const [complaintRef, setComplaintRef] = useState(`NCRP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [victimUpi, setVictimUpi] = useState('anand.verma@okaxis');
  const [disputeAmount, setDisputeAmount] = useState('480000');
  const [category, setCategory] = useState('Extortion / Malicious APK Scam');
  const [description, setDescription] = useState('Victim reported unauthorized UPI debit initiated after fake utility bill APK installation.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintRef.trim() || !victimUpi.trim()) return;

    const amountNum = parseFloat(disputeAmount) || 50000;
    const complaintNodeId = `COMPLAINT_${complaintRef.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const newComplaintNode: GraphNodeData = {
      id: complaintNodeId,
      label: complaintRef,
      type: 'complaint',
      riskScore: 100,
      status: 'active',
      subText: `${category} • ₹${amountNum.toLocaleString('en-IN')}`,
      complaintRef: complaintRef,
      disputeAmount: amountNum,
      tags: [category, 'NCRP Report', 'High Priority'],
    };

    // Find victim node or use first available
    const targetAccount = existingAccounts.find(
      (a) => a.upiId?.toLowerCase() === victimUpi.toLowerCase() || a.id === victimUpi
    ) || existingAccounts[0];

    const newEdge: GraphEdgeData = {
      id: `E_CMP_${Date.now()}`,
      source: complaintNodeId,
      target: targetAccount.id,
      amount: amountNum,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utr: `DISPUTE_${Date.now().toString().slice(-6)}`,
      channel: 'COMPLAINT_LINK',
      isSuspicious: true,
      ruleTriggered: 'RULE_FORMAL_DISPUTE_FILED',
    };

    onAddComplaint(newComplaintNode, newEdge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Link Synthetic Cyber Complaint</h3>
              <p className="text-[11px] text-slate-400">Formal Dispute Intake & Graph Association</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Complaint / NCRP Reference ID
            </label>
            <input
              type="text"
              value={complaintRef}
              onChange={(e) => setComplaintRef(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Disputed Amount (₹)
              </label>
              <input
                type="number"
                value={disputeAmount}
                onChange={(e) => setDisputeAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fraud Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Extortion / Malicious APK Scam">Extortion / Fake APK</option>
                <option value="Investment / Telegram Task Scam">Investment / Telegram Scam</option>
                <option value="Impersonation / Courier Customs Fraud">Courier Customs Scam</option>
                <option value="SIM Swap & Unauthorized UPI Debit">SIM Swap / QR Phishing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Associate to Victim UPI Identifier
            </label>
            <select
              value={victimUpi}
              onChange={(e) => setVictimUpi(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {existingAccounts.map((acc) => (
                <option key={acc.id} value={acc.label}>
                  {acc.label} ({acc.bankName || 'UPI VPA'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Case Narrative Summary
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20"
            >
              Link to Graph
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
