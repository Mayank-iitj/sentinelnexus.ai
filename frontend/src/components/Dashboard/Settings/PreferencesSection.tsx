'use client'

import React, { useState } from 'react'
import { Moon, Sun, Bell, Globe, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface PreferenceToggleProps {
    label: string
    description: string
    icon: React.ReactNode
    enabled: boolean
    onToggle: () => void
}

function PreferenceToggle({ label, description, icon, enabled, onToggle }: PreferenceToggleProps) {
    return (
        <div className="flex items-center justify-between group p-2 rounded-2xl transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${enabled ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                    {icon}
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm mb-1">{label}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-[280px]">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 outline-none ${enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        </div>
    )
}

export default function PreferencesSection() {
    const [theme, setTheme] = useState('dark')
    const [prefs, setPrefs] = useState({
        notifications: true,
        emailAlerts: true,
        publicProfile: false,
        analytics: true
    })

    const handleToggle = (key: keyof typeof prefs) => {
        setPrefs(p => ({ ...p, [key]: !p[key] }))
        toast.success('Preference updated')
    }

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Platform Preferences</h2>
                    <p className="text-slate-400">Customize how you interact with the SentinelNexus platform.</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        Appearance
                        <div className="h-px flex-1 bg-white/5" />
                    </h3>

                    <div className="flex gap-4 p-1 rounded-2xl bg-white/5 border border-white/5 w-fit">
                        <button
                            onClick={() => { setTheme('light'); toast.success('Light mode enabled') }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${theme === 'light' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Sun className="w-4 h-4" />
                            Light
                        </button>
                        <button
                            onClick={() => { setTheme('dark'); toast.success('Dark mode enabled') }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Moon className="w-4 h-4" />
                            Dark
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 text-indigo-400 font-bold mb-3 text-sm">
                            <Eye className="w-4 h-4" />
                            System Contrast
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            We've automatically optimized the contrast for your high-DPI display to reduce eye strain during long-form security audits.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        Notifications & Privacy
                        <div className="h-px flex-1 bg-white/5" />
                    </h3>

                    <div className="space-y-2">
                        <PreferenceToggle
                            label="Real-time Alerts"
                            description="Push notifications for critical vulnerabilities."
                            icon={<Bell className="w-5 h-5" />}
                            enabled={prefs.notifications}
                            onToggle={() => handleToggle('notifications')}
                        />
                        <PreferenceToggle
                            label="Email Intelligence"
                            description="Weekly reports and immediate threat warnings."
                            icon={<Mail className="w-5 h-5" />}
                            enabled={prefs.emailAlerts}
                            onToggle={() => handleToggle('emailAlerts')}
                        />
                        <PreferenceToggle
                            label="Public Analytics"
                            description="Share anonymous scan stats for global benchmarking."
                            icon={<Globe className="w-5 h-5" />}
                            enabled={prefs.publicProfile}
                            onToggle={() => handleToggle('publicProfile')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
