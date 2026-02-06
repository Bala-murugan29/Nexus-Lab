'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useNexusStore } from '@/lib/store';
import Link from 'next/link';

export default function KnowledgeGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const knowledgeNodes = useNexusStore((state) => state.knowledgeNodes);
  const updateNodeMastery = useNexusStore((state) => state.updateNodeMastery);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!svgRef.current || knowledgeNodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const filteredNodes = filter === 'all' 
      ? knowledgeNodes 
      : knowledgeNodes.filter(n => n.category === filter);

    const links = filteredNodes.flatMap(node =>
      node.connections
        .filter(targetId => filteredNodes.some(n => n.id === targetId))
        .map(targetId => ({
          source: node.id,
          target: targetId,
        }))
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3
      .forceSimulation(filteredNodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#374151')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    const node = svg
      .append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node
      .append('circle')
      .attr('r', (d) => 20 + d.mastery * 20)
      .attr('fill', (d) => {
        if (d.mastery > 0.8) return '#10b981';
        if (d.mastery > 0.6) return '#06b6d4';
        if (d.mastery > 0.4) return '#f59e0b';
        return '#ef4444';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('opacity', 0.9);

    node
      .append('text')
      .text((d) => d.concept)
      .attr('text-anchor', 'middle')
      .attr('dy', 50)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#e5e7eb')
      .style('pointer-events', 'none');

    node
      .append('text')
      .text((d) => `${Math.round(d.mastery * 100)}%`)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [knowledgeNodes, filter]);

  const categories = ['all', ...new Set(knowledgeNodes.map(n => n.category))];

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background-secondary px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary hover:text-primary-light">
            ← Back to Workspace
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold text-text-primary">Knowledge Graph</h1>
        </div>
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-background-tertiary text-text-muted hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Area */}
        <div className="flex-1 relative">
          <svg ref={svgRef} className="w-full h-full" />
          
          {/* Legend */}
          <div className="absolute top-4 left-4 glass-panel p-4">
            <div className="text-sm font-semibold text-text-primary mb-2">Mastery Levels</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent-green" />
                <span className="text-text-muted">Master (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent-cyan" />
                <span className="text-text-muted">Proficient (60-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent-yellow" />
                <span className="text-text-muted">Learning (40-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent-red" />
                <span className="text-text-muted">Needs Work (&lt;40%)</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="absolute top-4 right-4 glass-panel p-4">
            <div className="text-sm font-semibold text-text-primary mb-2">Statistics</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Total Nodes:</span>
                <span className="text-text-primary font-semibold">{knowledgeNodes.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Avg Mastery:</span>
                <span className="text-accent-green font-semibold">
                  {Math.round((knowledgeNodes.reduce((sum, n) => sum + n.mastery, 0) / knowledgeNodes.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Categories:</span>
                <span className="text-text-primary font-semibold">{categories.length - 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        {selectedNode && (
          <div className="w-96 border-l border-border bg-background-secondary p-6 overflow-y-auto">
            <button
              onClick={() => setSelectedNode(null)}
              className="text-text-muted hover:text-text-primary mb-4"
            >
              ✕ Close
            </button>
            
            <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedNode.concept}</h2>
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded text-sm mb-4">
              {selectedNode.category}
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-text-muted mb-1">Mastery Level</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${selectedNode.mastery * 100}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(selectedNode.mastery * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-2">Connections</div>
                <div className="space-y-1">
                  {selectedNode.connections.map((connId: string) => {
                    const connNode = knowledgeNodes.find(n => n.id === connId);
                    return connNode ? (
                      <div
                        key={connId}
                        className="px-3 py-2 bg-background-tertiary rounded text-sm text-text-primary hover:bg-border cursor-pointer"
                        onClick={() => setSelectedNode(connNode)}
                      >
                        {connNode.concept}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    const newMastery = Math.min(selectedNode.mastery + 0.1, 1);
                    updateNodeMastery(selectedNode.id, newMastery);
                    setSelectedNode({ ...selectedNode, mastery: newMastery });
                  }}
                  className="w-full btn-primary"
                >
                  + Increase Mastery
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
