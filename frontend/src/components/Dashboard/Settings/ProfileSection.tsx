'use client'

import React from 'react'
import { ShieldCheck, Mail, Calendar, User as UserIcon } from 'lucide-react'

export default function ProfileSection({ user }: { user: any }) {
    if (!user) return null

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">My Profile</h2>
                    <p className="text-slate-400">Personal information synchronized from your identity provider.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Account
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-4 group">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[2px] shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full rounded-2xl bg-[#020617] flex items-center justify-center overflow-hidden">
                                {user.image ? (
                                    <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-10 h-10 text-slate-600" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{user.name}</h3>
                            <p className="text-blue-400 font-medium text-sm">Enterprise User</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <div className="text-white text-sm font-medium">{user.email}</div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <UserIcon className="w-4 h-4" />
                                Role
                            </div>
                            <div className="text-white text-sm font-medium capitalize">Admin</div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                Platform Member
                            </div>
                            <div className="text-white text-sm font-medium">Joined Feb 2024</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-bold mb-3">Identity Provider</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Your account details are managed through your centralized identity system for maximum security and ease of use.
                        </p>
                    </div>
                    <button className="w-full py-3 px-4 rounded-xl bg-slate-800 text-white text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
                        Manage IDP Connection
                    </button>
                </div>
            </div>
        </div>
    )
}
