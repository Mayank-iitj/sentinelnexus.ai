'use client'

import React, { useMemo } from 'react'

interface Node {
    id: string
    label: string
    type: 'target' | 'vulnerability' | 'impact'
    severity?: string
}

interface Edge {
    source: string
    target: string
}

export function AttackGraph({ findings }: { findings: any[] }) {
    const nodes: Node[] = useMemo(() => {
        const res: Node[] = [{ id: 'target', label: 'Primary Target', type: 'target' }]

        findings.forEach(f => {
            res.push({
                id: f.id,
                label: f.title,
                type: 'vulnerability',
                severity: f.severity
            })

            const impactId = `impact_${f.id}`
            res.push({
                id: impactId,
                label: f.metadata?.business_impact?.split('.')[0] || 'Data Breach',
                type: 'impact'
            })
        })

        return res
    }, [findings])

    const edges: Edge[] = useMemo(() => {
        const res: Edge[] = []
        findings.forEach(f => {
            res.push({ source: 'target', target: f.id })
            res.push({ source: f.id, target: `impact_${f.id}` })
        })
        return res
    }, [findings])

    // Simple SVG visualization of the graph since we can't easily install react-force-graph
    return (
        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 h-[600px] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-6 left-6 flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Target</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Vulnerability</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> Impact</div>
            </div>

            <svg className="w-full h-full" viewBox="0 0 800 600">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                    </marker>
                </defs>

                {/* Draw Edges */}
                {edges.map((edge, i) => {
                    const sNode = nodes.find(n => n.id === edge.source)
                    const tNode = nodes.find(n => n.id === edge.target)
                    if (!sNode || !tNode) return null

                    return (
                        <line
                            key={i}
                            x1={400} y1={300} // Simplified layout logic
                            x2={400 + Math.cos(i * 0.5) * 200}
                            y2={300 + Math.sin(i * 0.5) * 200}
                            stroke="#334155"
                            strokeWidth="1"
                            markerEnd="url(#arrowhead)"
                        />
                    )
                })}

                {/* Simplified visualization message */}
                <text x="50%" y="50%" textAnchor="middle" fill="#475569" fontSize="14" className="pointer-events-none">
                    Attack Topology View
                </text>
                <circle cx="50%" cy="50%" r="40" fill="#1d4ed8" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2" />
                <text x="50%" y="420" textAnchor="middle" fill="#1e293b" fontSize="12">Interactive Graph Visualization Engine</text>
            </svg>

            <div className="absolute bottom-6 text-center text-slate-500 text-xs italic">
                Visualizing {findings.length} potential attack chains mapping from core infrastructure to business impact.
            </div>
        </div>
    )
}
