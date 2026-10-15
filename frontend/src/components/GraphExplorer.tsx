import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  SlidersHorizontal, 
  Search, 
  Type, 
  PenTool, 
  Crosshair, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
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
  setSearchFilter?: (q: string) => void;
  minRiskScore?: number;
  minAmount?: number;
  filterTypes?: { [key: string]: boolean };
  layoutName?: 'cose' | 'concentric' | 'breadthfirst' | 'circle';
  onOpenFilters?: () => void;
  timeRange?: string;
  setTimeRange?: (tr: string) => void;
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
  setSearchFilter,
  minRiskScore = 0,
  minAmount = 0,
  filterTypes = { account: true, device: true, merchant: true, complaint: true },
  layoutName = 'cose',
  onOpenFilters,
  timeRange = 'Last 24 hours',
  setTimeRange,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [showLabels, setShowLabels] = useState(true);

  // Filter nodes based on sliders, search, and type
  const visibleNodes = nodes.filter((n) => {
    if (!filterTypes[n.type]) return false;
    if (selectedTypeFilter !== 'ALL' && n.type !== selectedTypeFilter) return false;
    if (n.riskScore < minRiskScore) return false;

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
    if (e.amount > 0 && e.amount < minAmount) return false;
    return visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target);
  });

  // Cytoscape initialization
  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = theme === 'dark';

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
            color: getNodeColor(n.type, n.riskScore, isFrozen, isDark),
            borderColor: isFrozen 
              ? (isDark ? '#475569' : '#94A3B8') 
              : n.riskScore > 75 
              ? '#E11D48' 
              : (isDark ? '#10B981' : '#059669'),
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
            lineColor: isSevered 
              ? (isDark ? '#1F332C' : '#CBD5E1') 
              : isMuleEdge 
              ? '#E11D48' 
              : (isDark ? '#3E584F' : '#94A3B8'),
            width: e.amount > 200000 ? 3.5 : e.amount > 50000 ? 2.5 : 1.5,
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
            'label': showLabels ? 'data(label)' : '',
            'color': isDark ? '#F8FAFC' : '#0F172A',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'background-color': 'data(color)',
            'border-width': 2,
            'border-color': 'data(borderColor)',
            'width': 36,
            'height': 36,
            'text-outline-width': 2,
            'text-outline-color': isDark ? '#0A1210' : '#FFFFFF',
            'transition-property': 'background-color, line-color, target-arrow-color, opacity, border-color',
            'transition-duration': 0.25,
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
            'border-width': 3.5,
            'border-color': isDark ? '#34D399' : '#047857',
            'underlay-color': isDark ? '#10B981' : '#059669',
            'underlay-padding': 6,
            'underlay-opacity': 0.25,
          } as any,
        },
        {
          selector: 'node[?isFrozen]',
          style: {
            'opacity': 0.35,
            'background-color': isDark ? '#1E293B' : '#E2E8F0',
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
            'label': showLabels ? 'data(label)' : '',
            'font-size': '10px',
            'color': isDark ? '#94A3B8' : '#64748B',
            'font-weight': 500,
            'text-outline-width': 1.5,
            'text-outline-color': isDark ? '#0A1210' : '#FFFFFF',
            'text-rotation': 'autorotate',
          },
        },
        {
          selector: 'edge[?isSevered]',
          style: {
            'opacity': 0.2,
            'line-color': '#94A3B8',
            'target-arrow-color': '#94A3B8',
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
            'underlay-opacity': 0.35,
          } as any,
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.15,
          },
        },
      ],
      layout: getLayoutConfig(layoutName),
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
  }, [
    visibleNodes.length, 
    visibleEdges.length, 
    layoutName, 
    frozenNodeIds, 
    theme, 
    showLabels
  ]);

  // Spotlight ring effect
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    if (highlightedRingActive) {
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
      ringNodeIds.forEach((id) => cy.getElementById(id).removeClass('dimmed'));
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

  function getNodeColor(type: string, riskScore: number, isFrozen: boolean, isDark: boolean): string {
    if (isFrozen) return isDark ? '#1E293B' : '#E2E8F0';
    if (type === 'device') return '#D97706'; // Amber 600
    if (type === 'merchant') return '#7C3AED'; // Violet 600
    if (type === 'complaint') return '#DC2626'; // Red 600
    // Account:
    if (riskScore > 85) return '#E11D48'; // Rose / Crimson
    if (riskScore > 50) return '#EA580C'; // Orange
    return isDark ? '#059669' : '#10B981'; // Eye-soothing emerald
  }

  function getLayoutConfig(lName: string) {
    if (lName === 'cose') {
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
    return { name: lName, fit: true, padding: 50 };
  }

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 50);
  const handleReset = () => {
    cyRef.current?.reset();
    cyRef.current?.fit(undefined, 50);
  };

  return (
    <div
      className={`rounded-2xl border transition-all h-[560px] flex flex-col relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#111E1A] border-[#1A332B]'
          : 'bg-white border-slate-200/90 shadow-sm'
      }`}
    >
      {/* Top Card Header */}
      <div className="p-4 border-b border-inherit flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Network graph
            </h3>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                theme === 'dark'
                  ? 'bg-[#1A312A] text-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {visibleNodes.length} entities
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Connected activity across complaints, accounts, and devices
          </p>
        </div>

        {/* Reload button */}
        <button
          onClick={handleReset}
          title="Reset graph layout"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors self-start sm:self-center btn-press"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        className={`px-4 py-2.5 border-b border-inherit flex flex-wrap items-center justify-between gap-3 ${
          theme === 'dark' ? 'bg-[#0E1815]' : 'bg-[#FAFCFB]'
        }`}
      >
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Find an entity..."
            value={searchFilter}
            onChange={(e) => setSearchFilter && setSearchFilter(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              theme === 'dark'
                ? 'bg-[#142320] border-[#1E3B33] text-slate-200 placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Dropdowns & Filters Button */}
        <div className="flex items-center gap-2">
          {/* Entity Type Select */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className={`px-2.5 py-1.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#142320] border-[#1E3B33] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="ALL">All entity types</option>
            <option value="account">Accounts only</option>
            <option value="device">Devices only</option>
            <option value="merchant">Merchants only</option>
            <option value="complaint">Complaints only</option>
          </select>

          {/* Time Window Select */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange && setTimeRange(e.target.value)}
            className={`px-2.5 py-1.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#142320] border-[#1E3B33] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="Last 24 hours">Last 24 hours</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="All time">All time</option>
          </select>

          {/* Open Filters Slidebar */}
          <button
            onClick={onOpenFilters}
            title="Open threshold slidebars"
            className={`p-2 rounded-xl border transition-all btn-press ${
              theme === 'dark'
                ? 'bg-[#142320] border-[#1E3B33] text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 dot-grid overflow-hidden">
        {/* Status indicator top left */}
        <div className="absolute top-3 left-4 z-10 flex items-center gap-2 text-[11px] font-medium text-slate-400 bg-white/70 dark:bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs border border-slate-200/60 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Investigation network • 15 Oct 2026</span>
        </div>

        {/* Cytoscape Container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Floating Bottom Toolbar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all bg-white/90 dark:bg-[#121F1B]/90 border-slate-200 dark:border-[#1E3B33]">
          <button
            onClick={handleFit}
            title="Fit to screen"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors btn-press"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            title={showLabels ? 'Hide labels' : 'Show labels'}
            className={`p-1.5 rounded-full transition-colors btn-press ${
              showLabels
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

          {/* Spotlight Mule Ring */}
          <button
            onClick={() => setHighlightedRingActive(!highlightedRingActive)}
            title="Spotlight suspicious ring"
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all btn-press ${
              highlightedRingActive
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-500 dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Spotlight</span>
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors btn-press"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors btn-press"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
