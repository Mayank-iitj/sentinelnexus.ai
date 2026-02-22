'use client'

import React, { useState, useEffect } from 'react'
import { authApi } from '@/lib/api'
import { Activity, Shield, Clock, MapPin, Monitor, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuditLog {
    id: string
    action: string
    description: string
    ip_address: string
    user_agent: string
    created_at: string
}

export default function ActivitySection() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchLogs = async () => {
        try {
            const response = await authApi.getUserActivity()
            setLogs(response.data)
        } catch (error) {
            toast.error('Failed to load audit logs')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Security Audit</h2>
                    <p className="text-slate-400">Track all significant security actions performed on your account.</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500/20" />
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-sm">Retrieving audit trail...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-20 bg-white/5 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-500">
                        <Shield className="w-12 h-12 text-slate-800" />
                        <p className="text-sm">No significant activity detected in the last 30 days.</p>
                    </div>
                ) : (
                    <div className="bg-[#020617]/50 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-12 px-6 py-4 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="col-span-6">Action & Details</div>
                            <div className="col-span-3 text-center">Environment</div>
                            <div className="col-span-3 text-right">Timestamp</div>
                        </div>
                        {logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-12 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
                                <div className="col-span-6 flex items-center gap-4 text-white">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-sm font-bold">{log.action}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{log.description}</p>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-full">
                                            <MapPin className="w-2.5 h-2.5" />
                                            {log.ip_address}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium overflow-hidden max-w-[120px] truncate">
                                            <Monitor className="w-2.5 h-2.5" />
                                            {log.user_agent}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right">
                                    <div className="text-xs text-slate-400 font-medium">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-bold mt-1">
                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between group cursor-help">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-bold">Automatic Threat Response</h4>
                        <p className="text-xs text-slate-500">Intelligent system is monitoring for suspicious access patterns.</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    )
}
