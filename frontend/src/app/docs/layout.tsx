'use client'

import React from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Layout'

const sidebarItems = [
    {
        title: 'Getting Started',
        items: [
            { name: 'Introduction', href: '/docs' },
            { name: 'Quick Start', href: '/docs/quickstart' },
            { name: 'Authentication', href: '/docs/auth' },
        ],
    },
    {
        title: 'API Reference',
        items: [
            { name: 'Overview', href: '/docs/api' },
            { name: 'Scans', href: '/docs/api#scans' },
            { name: 'Projects', href: '/docs/api#projects' },
            { name: 'Organizations', href: '/docs/api#organizations' },
            { name: 'Alerts', href: '/docs/api#alerts' },
            { name: 'Stream', href: '/docs/api#stream' },
            { name: 'Subscriptions', href: '/docs/api#subscriptions' },
            { name: 'Verification', href: '/docs/api#verification' },
        ],
    },
    {
        title: 'Guides',
        items: [
            { name: 'CI/CD Integration', href: '/docs/guides/cicd' },
            { name: 'Compliance Auditing', href: '/docs/guides/compliance' },
            { name: 'Custom Rules', href: '/docs/guides/rules' },
        ],
    },
]

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
            <Navbar />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 py-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <nav className="sticky top-24 space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-4 custom-scrollbar">
                            {sidebarItems.map((section) => (
                                <div key={section.title}>
                                    <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 px-2">
                                        {section.title}
                                    </h5>
                                    <ul className="space-y-1">
                                        {section.items.map((item) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <li key={item.href}>
                                                    <NextLink
                                                        href={item.href}
                                                        className={`block px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                                            }`}
                                                    >
                                                        {item.name}
                                                    </NextLink>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 max-w-4xl mx-auto lg:mx-0">
                        <div className="relative">
                            {/* Background gradient effects for content area */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

                            <div className="prose prose-invert prose-slate max-w-none">
                                {children}
                            </div>
                        </div>

                        {/* Pagination / Navigation at bottom of each article */}
                        <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-sm font-medium">
                            <div className="text-slate-500">
                                Last updated: February 22, 2026
                            </div>
                            <div className="flex gap-4">
                                <NextLink href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Edit this page on GitHub
                                </NextLink>
                            </div>
                        </div>
                    </main>

                    {/* On this page - Table of Contents (Right Sidebar) */}
                    <aside className="hidden xl:block w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-4 px-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
                            <h5 className="text-sm font-semibold text-white uppercase tracking-wider">
                                On this page
                            </h5>
                            <nav className="space-y-2">
                                {/* Dynamically populated in future, placeholder for now */}
                                <a href="#" className="block text-sm text-blue-400 font-medium">Overview</a>
                                <a href="#" className="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Prerequisites</a>
                                <a href="#" className="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Installation</a>
                                <a href="#" className="block text-sm text-slate-400 hover:text-slate-200 transition-colors">Configuration</a>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
        </div>
    )
}
