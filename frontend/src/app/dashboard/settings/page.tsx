'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
    User,
    Shield,
    Key,
    Activity,
    Settings as SettingsIcon,
    Bell,
    Moon,
    ChevronRight,
    LogOut,
    Fingerprint
} from 'lucide-react'
import ProfileSection from '@/components/Dashboard/Settings/ProfileSection'
import ApiKeySection from '@/components/Dashboard/Settings/ApiKeySection'
import ActivitySection from '@/components/Dashboard/Settings/ActivitySection'
import PreferencesSection from '@/components/Dashboard/Settings/PreferencesSection'
import { Navbar } from '@/components/Layout'

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security & API', icon: Key },
    { id: 'activity', label: 'Security Audit', icon: Activity },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
]

export default function SettingsPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState('profile')

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSection user={session?.user} />
            case 'security':
                return <ApiKeySection />
            case 'activity':
                return <ActivitySection />
            case 'preferences':
                return <PreferencesSection />
            default:
                return <ProfileSection user={session?.user} />
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 relative overflow-hidden">
                {/* Ambient background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
                    <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[160px] animate-pulse delay-700" />
                    <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[140px] animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">
                    <header className="mb-10">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-slate-400">Settings</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            Settings
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </h1>
                        <p className="text-slate-400 mt-2">Manage your account identity, security credentials, and platform preferences.</p>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'}`} />
                                        {tab.label}
                                        {tab.id === activeTab && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-10 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Fingerprint className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-white font-bold text-sm mb-1">Advanced Mode</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">Secure hardware identity is enabled for this session.</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1">
                            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl min-h-[600px] shadow-2xl transition-all duration-300">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}
