'use client'

import React, { useState } from 'react'
import { scanApi, projectApi } from '@/lib/api'
import toast from 'react-hot-toast'

export function CodeScanner() {
  const [code, setCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleScan = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to scan')
      return
    }

    setIsScanning(true)
    try {
      const response = await scanApi.scanCode('project-id-here', code)
      setResults(response.data)
      toast.success('Scan completed!')
    } catch (error) {
      toast.error('Scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Code to Scan</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm font-mono"
          placeholder="Paste your code here..."
        />
      </div>
      
      <button
        onClick={handleScan}
        disabled={isScanning}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        {isScanning ? 'Scanning...' : 'Scan Code'}
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Scan Results</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">Critical</p>
              <p className="text-2xl font-bold text-white">{results.findings_summary?.critical || 0}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-400 text-sm font-medium">High</p>
              <p className="text-2xl font-bold text-white">{results.findings_summary?.high || 0}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-400 text-sm font-medium">Medium</p>
              <p className="text-2xl font-bold text-white">{results.findings_summary?.medium || 0}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-400 text-sm font-medium">Low</p>
              <p className="text-2xl font-bold text-white">{results.findings_summary?.low || 0}</p>
            </div>
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
