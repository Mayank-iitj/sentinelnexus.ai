'use client'

import React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function ProfileDropdown() {
    const { data: session } = useSession()
    const user = session?.user

    if (!user) return null

    const userInitials = user.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
        : user.email?.substring(0, 2).toUpperCase() || 'U'

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group outline-none">
                    <div className="relative">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || 'User'}
                                className="w-9 h-9 rounded-lg object-cover ring-2 ring-slate-800 group-hover:ring-blue-500/50 transition-all"
                            />
                        ) : (
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold ring-2 ring-slate-800 group-hover:ring-blue-500/50 transition-all">
                                {userInitials}
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-950 rounded-full" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-white leading-none mb-1 group-hover:text-blue-400 transition-colors">
                            {user.name || 'Decrypted User'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase">
                            Secure Session Active
                        </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="z-[100] min-w-[240px] bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
                    sideOffset={8}
                    align="end"
                >
                    <div className="px-3 py-4 border-b border-slate-800 mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Account Intelligence</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                {user.image ? (
                                    <img src={user.image} alt="" className="w-full h-full rounded-xl object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-blue-400" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg outline-none cursor-pointer transition-colors group"
                        >
                            <Settings className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                            Settings & Compliance
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/dashboard/security"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg outline-none cursor-pointer transition-colors group"
                        >
                            <Shield className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                            Access Logs
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-slate-800 my-2" />

                    <DropdownMenu.Item
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg outline-none cursor-pointer transition-colors group"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
