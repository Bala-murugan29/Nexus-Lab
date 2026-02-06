'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useNexusStore } from '@/lib/store';

export function KnowledgeTopology() {
  const svgRef = useRef<SVGSVGElement>(null);
  const knowledgeNodes = useNexusStore((state) => state.knowledgeNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || knowledgeNodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 200;

    const links = knowledgeNodes.flatMap(node =>
      node.connections.map(targetId => ({
        source: node.id,
        target: targetId,
      }))
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3
      .forceSimulation(knowledgeNodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#374151')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6);

    const node = svg
      .append('g')
      .selectAll('g')
      .data(knowledgeNodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d.id);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node
      .append('circle')
      .attr('r', (d) => 15 + d.mastery * 10)
      .attr('fill', (d) => {
        if (d.mastery > 0.8) return '#10b981';
        if (d.mastery > 0.6) return '#06b6d4';
        if (d.mastery > 0.4) return '#f59e0b';
        return '#ef4444';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    node
      .append('text')
      .text((d) => d.concept)
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('font-size', '10px')
      .attr('fill', '#9ca3af')
      .style('pointer-events', 'none');

    // Add mastery percentage
    node
      .append('text')
      .text((d) => `${Math.round(d.mastery * 100)}%`)
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', '9px')
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
  }, [knowledgeNodes]);

  const selectedNodeData = selectedNode ? knowledgeNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="glass-panel h-64 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-primary font-semibold">KNOWLEDGE TOPOLOGY</span>
          <span className="text-text-muted text-xs">({knowledgeNodes.length} nodes)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="text-text-muted">Master (80%+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-yellow" />
            <span className="text-text-muted">Learning</span>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-full" />
        
        {/* Selected Node Info */}
        {selectedNodeData && (
          <div className="absolute bottom-2 left-2 bg-background-tertiary border border-border rounded-lg p-3 text-xs max-w-xs">
            <div className="font-semibold text-text-primary mb-1">{selectedNodeData.concept}</div>
            <div className="text-text-muted">{selectedNodeData.category}</div>
            <div className="mt-2">
              <div className="text-text-muted mb-1">Mastery: {Math.round(selectedNodeData.mastery * 100)}%</div>
              <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${selectedNodeData.mastery * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
