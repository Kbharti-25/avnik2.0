import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCw, 
  Filter, 
  Eye, 
  Layers, 
  AlertTriangle,
  Smartphone,
  Store,
  FileText,
  UserCheck
} from 'lucide-react';
import { GraphNodeData, GraphEdgeData } from '../types';

interface GraphExplorerProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  selectedEntity: GraphNodeData | null;
  onSelectEntity: (entity: GraphNodeData | null) => void;
  frozenNodeIds: Set<string>;
  highlightedRingActive: boolean;
  setHighlightedRingActive: (active: boolean) => void;
  searchFilter?: string;
}

export const GraphExplorer: React.FC<GraphExplorerProps> = ({
  nodes,
  edges,
  selectedEntity,
  onSelectEntity,
  frozenNodeIds,
  highlightedRingActive,
  setHighlightedRingActive,
  searchFilter = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [currentLayout, setCurrentLayout] = useState<'cose' | 'concentric' | 'breadthfirst' | 'circle'>('cose');
  const [filterTypes, setFilterTypes] = useState<{ [key: string]: boolean }>({
    account: true,
    device: true,
    merchant: true,
    complaint: true,
  });

  // Filter elements based on type and frozen state
  const visibleNodes = nodes.filter((n) => {
    if (!filterTypes[n.type]) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchLabel = n.label.toLowerCase().includes(q);
      const matchUpi = n.upiId?.toLowerCase().includes(q);
      const matchDev = n.deviceId?.toLowerCase().includes(q);
      const matchBank = n.bankName?.toLowerCase().includes(q);
      return matchLabel || matchUpi || matchDev || matchBank;
    }
    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

  const visibleEdges = edges.filter((e) => {
    return visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target);
  });

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const cyElements = [
      ...visibleNodes.map((n) => {
        const isFrozen = frozenNodeIds.has(n.id);
        return {
          data: {
            id: n.id,
            label: n.label,
            type: n.type,
            riskScore: n.riskScore,
            isFrozen: isFrozen,
            subText: n.subText,
            color: getNodeColor(n.type, n.riskScore, isFrozen),
            borderColor: isFrozen ? '#475569' : n.riskScore > 75 ? '#F43F5E' : '#38BDF8',
          },
        };
      }),
      ...visibleEdges.map((e) => {
        const isMuleEdge = e.isSuspicious;
        const isSevered = frozenNodeIds.has(e.source) || frozenNodeIds.has(e.target);
        return {
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            amount: e.amount,
            channel: e.channel,
            label: e.amount > 0 ? `₹${(e.amount / 1000).toFixed(0)}k` : e.channel === 'DEVICE_BIND' ? 'Bound' : 'Dispute',
            isSuspicious: e.isSuspicious,
            isSevered: isSevered,
            lineStyle: e.channel === 'DEVICE_BIND' ? 'dashed' : 'solid',
            lineColor: isSevered ? '#334155' : isMuleEdge ? '#F43F5E' : '#64748B',
            width: e.amount > 200000 ? 4 : e.amount > 50000 ? 2.5 : 1.5,
          },
        };
      }),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#F8FAFC',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'background-color': 'data(color)',
            'border-width': 2,
            'border-color': 'data(borderColor)',
            'width': 36,
            'height': 36,
            'text-outline-width': 2,
            'text-outline-color': '#0B0F19',
            'transition-property': 'background-color, line-color, target-arrow-color, opacity, border-color',
            'transition-duration': 0.3,
          },
        },
        {
          selector: 'node[type = "device"]',
          style: {
            'shape': 'diamond',
            'width': 38,
            'height': 38,
          },
        },
        {
          selector: 'node[type = "merchant"]',
          style: {
            'shape': 'hexagon',
            'width': 40,
            'height': 40,
          },
        },
        {
          selector: 'node[type = "complaint"]',
          style: {
            'shape': 'octagon',
            'width': 38,
            'height': 38,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#38BDF8',
            'underlay-color': '#38BDF8',
            'underlay-padding': 6,
            'underlay-opacity': 0.35,
          } as any,
        },
        {
          selector: 'node[?isFrozen]',
          style: {
            'opacity': 0.35,
            'background-color': '#334155',
            'border-color': '#64748B',
            'border-style': 'dashed',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(width)',
            'line-color': 'data(lineColor)',
            'line-style': 'data(lineStyle)' as any,
            'target-arrow-color': 'data(lineColor)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.1,
            'label': 'data(label)',
            'font-size': '10px',
            'color': '#94A3B8',
            'text-outline-width': 1.5,
            'text-outline-color': '#0B0F19',
            'text-rotation': 'autorotate',
          },
        },
        {
          selector: 'edge[?isSevered]',
          style: {
            'opacity': 0.2,
            'line-color': '#1E293B',
            'target-arrow-color': '#1E293B',
          },
        },
        {
          selector: '.highlighted-ring',
          style: {
            'line-color': '#F59E0B',
            'target-arrow-color': '#F59E0B',
            'width': 4.5,
            'underlay-color': '#F59E0B',
            'underlay-padding': 4,
            'underlay-opacity': 0.4,
          } as any,
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.2,
          },
        },
      ],
      layout: getLayoutConfig(currentLayout),
    });

    cy.on('tap', 'node', (evt: EventObject) => {
      const nodeData = nodes.find((n) => n.id === evt.target.id());
      if (nodeData) {
        onSelectEntity(nodeData);
      }
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        onSelectEntity(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [visibleNodes.length, visibleEdges.length, currentLayout, frozenNodeIds]);

  // Handle ring highlight
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    if (highlightedRingActive) {
      // Focus on the Chakravyuh mule ring nodes and edges
      const ringNodeIds = [
        'ACC_VICTIM_1',
        'ACC_PRIMARY_MULE',
        'ACC_MULE_2',
        'ACC_MULE_3',
        'ACC_MULE_4',
        'DEV_FARM_1',
        'MERCH_CASHOUT',
      ];
      cy.elements().addClass('dimmed');
      ringNodeIds.forEach((id) => {
        cy.getElementById(id).removeClass('dimmed');
      });
      cy.edges().forEach((edge) => {
        const src = edge.data('source');
        const tgt = edge.data('target');
        if (ringNodeIds.includes(src) && ringNodeIds.includes(tgt)) {
          edge.removeClass('dimmed');
          edge.addClass('highlighted-ring');
        }
      });
    } else {
      cy.elements().removeClass('dimmed');
      cy.edges().removeClass('highlighted-ring');
    }
  }, [highlightedRingActive]);

  // Helper colors
  function getNodeColor(type: string, riskScore: number, isFrozen: boolean): string {
    if (isFrozen) return '#1E293B';
    if (type === 'device') return '#D97706'; // Amber 600
    if (type === 'merchant') return '#7C3AED'; // Violet 600
    if (type === 'complaint') return '#DC2626'; // Red 600
    // Account:
    if (riskScore > 85) return '#E11D48'; // Rose / Crimson
    if (riskScore > 50) return '#EA580C'; // Orange
    return '#0284C7'; // Blue / Cyan
  }

  function getLayoutConfig(layoutName: string) {
    if (layoutName === 'cose') {
      return {
        name: 'cose',
        idealEdgeLength: 120,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 50,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      };
    }
    return { name: layoutName, fit: true, padding: 50 };
  }

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 50);
  const handleCenter = () => cyRef.current?.center();

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-[#0B0F19] rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
      {/* Canvas Toolset Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        {/* Layout Switcher */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Layout:</span>
          {(['cose', 'concentric', 'breadthfirst', 'circle'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setCurrentLayout(l)}
              className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-all ${
                currentLayout === l
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {l === 'cose' ? 'Force' : l}
            </button>
          ))}
        </div>

        {/* Highlight Mule Ring Toggle */}
        <button
          onClick={() => setHighlightedRingActive(!highlightedRingActive)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            highlightedRingActive
              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
              : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/30'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{highlightedRingActive ? 'Reset Spotlight' : 'Spotlight Ring'}</span>
        </button>

        {/* Canvas Zoom controls */}
        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Fit to Screen"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCenter}
            title="Center Canvas"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type Filter Pills (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
        <span className="text-[11px] text-slate-400 font-medium mr-1">Filter:</span>

        <button
          onClick={() => setFilterTypes((prev) => ({ ...prev, account: !prev.account }))}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            filterTypes.account ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' : 'bg-slate-800 text-slate-500'
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>Accounts</span>
        </button>

        <button
          onClick={() => setFilterTypes((prev) => ({ ...prev, device: !prev.device }))}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            filterTypes.device ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-slate-800 text-slate-500'
          }`}
        >
          <Smartphone className="w-3 h-3" />
          <span>Devices</span>
        </button>

        <button
          onClick={() => setFilterTypes((prev) => ({ ...prev, merchant: !prev.merchant }))}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            filterTypes.merchant ? 'bg-purple-950 text-purple-300 border border-purple-800/60' : 'bg-slate-800 text-slate-500'
          }`}
        >
          <Store className="w-3 h-3" />
          <span>Merchants</span>
        </button>

        <button
          onClick={() => setFilterTypes((prev) => ({ ...prev, complaint: !prev.complaint }))}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            filterTypes.complaint ? 'bg-rose-950 text-rose-300 border border-rose-800/60' : 'bg-slate-800 text-slate-500'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>Complaints</span>
        </button>
      </div>

      {/* Main Cytoscape Container */}
      <div ref={containerRef} className="cytoscape-container flex-1" />

      {/* Graph Legend & Status footer */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80 text-xs text-slate-300 shadow-xl">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span>High-Risk Mule (Score &gt; 85)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span>Legitimate / Low-Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rotate-45 bg-amber-500" />
          <span>Device / Hardware IMEI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-purple-500" />
          <span>Cashout Merchant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-slate-400 bg-slate-700" />
          <span>Counterfactual Frozen</span>
        </div>
      </div>
    </div>
  );
};
