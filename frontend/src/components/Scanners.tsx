'use client'

import React, { useState } from 'react'
import { scanApi, projectApi } from '@/lib/api'
import toast from 'react-hot-toast'

import { useScanStream } from '@/hooks/useScanStream';

export function CodeScanner() {
  const [code, setCode] = useState('')
  const { isConnected, isScanning, progress, findings, logs, startScan } = useScanStream()

  const handleScan = () => {
    if (!code.trim()) {
      toast.error('Please enter some code to scan')
      return
    }
    startScan(code)
  }

  // Calculate summary stats locally for display
  const summary = {
    critical: findings.filter((f: any) => f.severity === 'critical').length,
    high: findings.filter((f: any) => f.severity === 'high').length,
    medium: findings.filter((f: any) => f.severity === 'medium').length,
    low: findings.filter((f: any) => f.severity === 'low').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Real-time Code Scanner</h3>
        <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border ${isConnected ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>

      <div>
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm font-mono focus:border-blue-500 transition-colors"
            placeholder="Paste your python code here... (try import os; os.system('rm -rf /'))"
          />
          {isScanning && ( // Matrix rain effect or overlay could go here
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" />
          )}
        </div>

        {/* Real-time Logs */}
        <div className="mt-2 h-6 flex items-center gap-2 text-xs font-mono text-slate-500 overflow-hidden">
          {isScanning && <span className="animate-spin">⟳</span>}
          {logs.length > 0 ? logs[logs.length - 1] : 'Ready to scan.'}
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={handleScan}
        disabled={isScanning || !isConnected}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
      >
        {isScanning ? `Scanning... ${Math.round(progress)}%` : 'Run Live Security Scan'}
      </button>

      {/* Real-time Results Grid */}
      {(findings.length > 0 || !isScanning && progress === 100) && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Scan Results
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{findings.length} findings</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-400 text-sm font-medium uppercase tracking-wider">Critical</p>
              <p className="text-3xl font-bold text-white mt-1">{summary.critical}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-orange-400 text-sm font-medium uppercase tracking-wider">High</p>
              <p className="text-3xl font-bold text-white mt-1">{summary.high}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-yellow-400 text-sm font-medium uppercase tracking-wider">Medium</p>
              <p className="text-3xl font-bold text-white mt-1">{summary.medium}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">Low</p>
              <p className="text-3xl font-bold text-white mt-1">{summary.low}</p>
            </div>
          </div>

          {/* Detailed Findings List */}
          <div className="space-y-3 mt-4">
            {findings.map((f: any, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${f.severity === 'critical' ? 'bg-red-500' :
                        f.severity === 'high' ? 'bg-orange-500' :
                          f.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                      <h4 className="font-semibold text-white">{f.title}</h4>
                    </div>
                    <p className="text-slate-400 text-sm">{f.description}</p>
                    <p className="text-slate-500 text-xs mt-2 font-mono bg-slate-950/50 p-2 rounded border border-slate-800">
                      {f.evidence}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Ln {f.location.split(':').pop()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function PromptScanner() {
  const [prompt, setPrompt] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleScan = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to scan')
      return
    }

    setIsScanning(true)
    try {
      const response = await scanApi.scanPrompt('project-id-here', prompt)
      setResults(response.data)
      toast.success('Prompt scan completed!')
    } catch (error) {
      toast.error('Scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Prompt to Scan</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm"
          placeholder="Paste your LLM prompt here..."
        />
      </div>

      <button
        onClick={handleScan}
        disabled={isScanning}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        {isScanning ? 'Scanning...' : 'Analyze Prompt'}
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Vulnerability Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-card border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Jailbreak Risk</p>
              <p className="text-2xl font-bold text-white">{results.findings_summary?.jailbreak_susceptibility?.toFixed(0)}%</p>
            </div>
            <div className="bg-dark-card border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Injection Risk</p>
              <p className="text-2xl font-bold text-white">{results.findings_summary?.injection_risk?.toFixed(0)}%</p>
            </div>
          </div>

          {results.findings_summary?.suggested_safer_prompt && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Safer Prompt (AI-Generated)</h4>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm">
                {results.findings_summary.suggested_safer_prompt}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
