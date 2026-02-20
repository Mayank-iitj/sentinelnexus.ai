'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'
import { DashboardContent } from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[160px] animate-pulse delay-700" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[140px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardContent />
        </div>
      </div>
    </>
  )
}
