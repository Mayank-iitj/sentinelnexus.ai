'use client'

import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const riskData = [
  { name: 'Critical', value: 4, fill: '#ef4444' },
  { name: 'High', value: 12, fill: '#f59e0b' },
  { name: 'Medium', value: 23, fill: '#3b82f6' },
  { name: 'Low', value: 61, fill: '#10b981' },
]

const trendData = [
  { date: 'Jan', risk: 65, scans: 12 },
  { date: 'Feb', risk: 58, scans: 18 },
  { date: 'Mar', risk: 42, scans: 24 },
  { date: 'Apr', risk: 55, scans: 20 },
  { date: 'May', risk: 48, scans: 28 },
  { date: 'Jun', risk: 35, scans: 35 },
]

const piiData = [
  { name: 'Email', value: 45 },
  { name: 'Phone', value: 28 },
  { name: 'Credit Card', value: 12 },
  { name: 'SSN', value: 5 },
  { name: 'Other', value: 10 },
]

export function RiskScoreCard() {
  const riskScore = 32
  const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : riskScore < 80 ? 'High' : 'Critical'
  const riskColor = riskScore < 30 ? 'text-green-400' : riskScore < 60 ? 'text-yellow-400' : riskScore < 80 ? 'text-orange-400' : 'text-red-400'
  const ringColor = riskScore < 30 ? 'stroke-green-500' : riskScore < 60 ? 'stroke-yellow-500' : riskScore < 80 ? 'stroke-orange-500' : 'stroke-red-500'

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-400">AI Risk Score</h3>
          <p className="text-xs text-slate-500">Based on 100 scans</p>
        </div>
        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          12% improved
        </span>
      </div>
      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-slate-800"
              strokeWidth="8"
              fill="none"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={`${riskScore * 2.51} 251`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${riskColor}`}>{riskScore}</span>
          </div>
        </div>
        <div>
          <p className={`text-lg font-semibold ${riskColor}`}>{riskLevel} Risk</p>
          <p className="text-sm text-slate-400 mt-1">4 critical issues</p>
          <p className="text-sm text-slate-400">12 warnings</p>
        </div>
      </div>
    </div>
  )
}

export function ComplianceStatus() {
  const frameworks = [
    { name: 'GDPR', status: 'compliant', icon: '🇪🇺' },
    { name: 'AI Act', status: 'review', icon: '⚖️' },
    { name: 'SOC 2', status: 'compliant', icon: '🔒' },
    { name: 'HIPAA', status: 'na', icon: '🏥' },
  ]

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Compliance Status</h3>
      <div className="grid grid-cols-2 gap-3">
        {frameworks.map((fw) => (
          <div key={fw.name} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
            <span className="text-xl">{fw.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{fw.name}</p>
              <p className={`text-xs ${
                fw.status === 'compliant' ? 'text-green-400' :
                fw.status === 'review' ? 'text-yellow-400' : 'text-slate-500'
              }`}>
                {fw.status === 'compliant' ? 'Compliant' :
                 fw.status === 'review' ? 'Review Needed' : 'Not Applicable'}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              fw.status === 'compliant' ? 'bg-green-500' :
              fw.status === 'review' ? 'bg-yellow-500' : 'bg-slate-600'
            }`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function RiskDistributionChart() {
  const total = riskData.reduce((acc, item) => acc + item.value, 0)
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white mb-6">Risk Distribution</h3>
      <div className="flex items-center gap-8">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          {riskData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm text-slate-400 flex-1">{item.name}</span>
              <span className="text-sm font-medium text-white">{item.value}</span>
              <span className="text-xs text-slate-500 w-12 text-right">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RiskTrendChart() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white">Risk Trend</h3>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500" /> Risk Score
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-cyan-500" /> Scans
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }} 
          />
          <Area
            type="monotone"
            dataKey="risk"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorRisk)"
          />
          <Line
            type="monotone"
            dataKey="scans"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PIIExposureChart() {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white mb-6">PII Exposure</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={piiData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" stroke="#64748b" fontSize={12} />
          <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={80} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155',
              borderRadius: '8px'
            }} 
          />
          <Bar 
            dataKey="value" 
            fill="#3b82f6" 
            radius={[0, 4, 4, 0]}
            background={{ fill: '#1e293b' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function VulnerabilityList() {
  const vulnerabilities = [
    { id: 1, type: 'Hardcoded API Key', severity: 'critical', found: 3, file: 'config.py', time: '2m ago' },
    { id: 2, type: 'Email Exposed', severity: 'high', found: 2, file: 'logs.txt', time: '1h ago' },
    { id: 3, type: 'SQL Injection Risk', severity: 'high', found: 1, file: 'query.py', time: '3h ago' },
    { id: 4, type: 'Unencrypted Storage', severity: 'medium', found: 2, file: 'database.py', time: '1d ago' },
  ]

  const severityConfig = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-500' },
    low: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500' },
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Vulnerabilities</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All</button>
        </div>
      </div>
      <div className="divide-y divide-slate-800/50">
        {vulnerabilities.map((vuln) => {
          const config = severityConfig[vuln.severity as keyof typeof severityConfig]
          return (
            <div key={vuln.id} className="p-4 hover:bg-slate-800/30 cursor-pointer transition-all duration-200 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${config.dot}`} />
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                      {vuln.type}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {vuln.file} • {vuln.found} instance{vuln.found > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
                    {vuln.severity}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{vuln.time}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AlertsList() {
  const alerts = [
    { id: 1, type: 'Critical Risk Detected', message: 'API key exposed in production', time: '5 mins ago', read: false, severity: 'critical' },
    { id: 2, type: 'PII Leak Alert', message: '3 email addresses found in logs', time: '2 hours ago', read: false, severity: 'high' },
    { id: 3, type: 'Compliance Warning', message: 'GDPR consent not implemented', time: '1 day ago', read: true, severity: 'medium' },
  ]

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Alerts</h3>
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {alerts.filter(a => !a.read).length}
            </span>
          </div>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Mark all read</button>
        </div>
      </div>
      <div className="divide-y divide-slate-800/50 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 hover:bg-slate-800/30 cursor-pointer transition-all duration-200 ${
            !alert.read ? 'bg-slate-800/20' : ''
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${!alert.read ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{alert.type}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{alert.message}</p>
                <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuickActions() {
  const actions = [
    { icon: '🔍', label: 'New Scan', href: '/scans/new', color: 'from-blue-500 to-cyan-500' },
    { icon: '📊', label: 'View Reports', href: '/reports', color: 'from-purple-500 to-pink-500' },
    { icon: '⚙️', label: 'Settings', href: '/settings', color: 'from-orange-500 to-red-500' },
    { icon: '📁', label: 'Projects', href: '/projects', color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 group"
        >
          <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
            {action.icon}
          </div>
          <p className="text-sm font-medium text-white">{action.label}</p>
        </a>
      ))}
    </div>
  )
}
