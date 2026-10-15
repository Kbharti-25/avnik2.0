import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GraphExplorer } from './components/GraphExplorer';
import { EntityInspector } from './components/EntityInspector';
import { AlertsPanel } from './components/AlertsPanel';
import { TimelineView } from './components/TimelineView';
import { CaseManagement } from './components/CaseManagement';
import { CounterfactualSimulator } from './components/CounterfactualSimulator';
import { ComplaintIntakeModal } from './components/ComplaintIntakeModal';
import { 
  SYNTHETIC_NODES, 
  SYNTHETIC_EDGES, 
  SYNTHETIC_ALERTS, 
  SYNTHETIC_TIMELINE, 
  SYNTHETIC_CASES 
} from './mock/syntheticData';
import { GraphNodeData, GraphEdgeData, CaseFile } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'graph' | 'alerts' | 'timeline' | 'cases' | 'counterfactual'>('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useState<GraphNodeData[]>(SYNTHETIC_NODES);
  const [edges, setEdges] = useState<GraphEdgeData[]>(SYNTHETIC_EDGES);
  const [alerts] = useState(SYNTHETIC_ALERTS);
  const [timeline] = useState(SYNTHETIC_TIMELINE);
  const [cases, setCases] = useState<CaseFile[]>(SYNTHETIC_CASES);
  
  const [selectedEntity, setSelectedEntity] = useState<GraphNodeData | null>(null);
  const [frozenNodeIds, setFrozenNodeIds] = useState<Set<string>>(new Set());
  const [highlightedRingActive, setHighlightedRingActive] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);

  // Toggle administrative freeze on node (Counterfactual "What-If" Analysis)
  const handleToggleFreeze = (nodeId: string) => {
    setFrozenNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleClearAllFreezes = () => {
    setFrozenNodeIds(new Set());
  };

  // Cross-link from Alerts tab directly into Graph view
  const handleInvestigateInGraph = (clusterId: string) => {
    setActiveTab('graph');
    setHighlightedRingActive(true);
  };

  // Add a new synthetic complaint node and edge
  const handleAddComplaint = (newComplaintNode: GraphNodeData, newEdge: GraphEdgeData) => {
    setNodes((prev) => [newComplaintNode, ...prev]);
    setEdges((prev) => [newEdge, ...prev]);
    setSelectedEntity(newComplaintNode);
    setActiveTab('graph');
  };

  // Case management handlers
  const handleAddCaseNote = (caseId: string, noteText: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            notes: [
              ...c.notes,
              {
                id: `N-${Date.now()}`,
                author: 'Analyst (You)',
                timestamp: 'Just now',
                text: noteText,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const handleUpdateCaseStatus = (caseId: string, newStatus: CaseFile['status']) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openComplaintModal={() => setComplaintModalOpen(true)}
        alertCount={alerts.length}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto flex gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab === 'graph' && (
            <GraphExplorer
              nodes={nodes}
              edges={edges}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
              frozenNodeIds={frozenNodeIds}
              highlightedRingActive={highlightedRingActive}
              setHighlightedRingActive={setHighlightedRingActive}
              searchFilter={searchQuery}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPanel
              alerts={alerts}
              onInvestigateInGraph={handleInvestigateInGraph}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView events={timeline} />
          )}

          {activeTab === 'cases' && (
            <CaseManagement
              cases={cases}
              onAddNote={handleAddCaseNote}
              onUpdateStatus={handleUpdateCaseStatus}
            />
          )}

          {activeTab === 'counterfactual' && (
            <CounterfactualSimulator
              nodes={nodes}
              edges={edges}
              frozenNodeIds={frozenNodeIds}
              onToggleFreeze={handleToggleFreeze}
              onClearAllFreezes={handleClearAllFreezes}
              onOpenGraph={() => setActiveTab('graph')}
            />
          )}
        </div>

        {/* Entity Inspector Drawer (Active on Graph tab when node selected) */}
        {activeTab === 'graph' && selectedEntity && (
          <EntityInspector
            entity={selectedEntity}
            onClose={() => setSelectedEntity(null)}
            edges={edges}
            nodes={nodes}
            isFrozen={frozenNodeIds.has(selectedEntity.id)}
            onToggleFreeze={handleToggleFreeze}
          />
        )}
      </main>

      {/* Complaint Intake Modal */}
      <ComplaintIntakeModal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        onAddComplaint={handleAddComplaint}
        existingAccounts={nodes.filter((n) => n.type === 'account')}
      />
    </div>
  );
}

export default App;
