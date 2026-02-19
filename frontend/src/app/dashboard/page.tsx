'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'
import {
  RiskScoreCard,
  ComplianceStatus,
  RiskDistributionChart,
  RiskTrendChart,
  PIIExposureChart,
  VulnerabilityList,
  AlertsList,
} from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-2">AI Risk & Compliance Intelligence</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <RiskScoreCard />
            <div className="lg:col-span-2">
              <ComplianceStatus />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RiskDistributionChart />
            <RiskTrendChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PIIExposureChart />
            <AlertsList />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <VulnerabilityList />
          </div>
        </div>
      </div>
    </>
  )
}
