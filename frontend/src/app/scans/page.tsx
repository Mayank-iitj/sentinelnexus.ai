'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/Layout'
import { CodeScanner, PromptScanner } from '@/components/Scanners'

export default function ScansPage() {
  const [activeTab, setActiveTab] = useState<'code' | 'prompt' | 'pii'>('code')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Security Scanners</h1>
            <p className="text-slate-400 mt-2">Scan code, prompts, and data for vulnerabilities</p>
          </div>

          <div className="flex gap-4 mb-6 border-b border-slate-700">
            {(['code', 'prompt', 'pii'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'code' && 'Code Scanner'}
                {tab === 'prompt' && 'Prompt Analyzer'}
                {tab === 'pii' && 'PII Detector'}
              </button>
            ))}
          </div>

          <div className="bg-dark-card border border-slate-700 rounded-lg p-6">
            {activeTab === 'code' && <CodeScanner />}
            {activeTab === 'prompt' && <PromptScanner />}
            {activeTab === 'pii' && <CodeScanner />}
          </div>
        </div>
      </div>
    </>
  )
}
