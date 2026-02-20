'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'

export default function SecurityCenter() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Security Status: Operational
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Security Center</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Security isn't just a feature—it's the foundation of everything we build. Explore our comprehensive security measures, compliance certifications, and responsible disclosure program.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Data Encryption</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            We encrypt all sensitive data in transit using TLS 1.3 and at rest using AES-256-GCM. Keys are managed via a FIPS 140-2 Level 3 HSM.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-green-500/30 transition-colors">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Compliance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            SentinelNexus complies with GDPR, CCPA, and follows NIST AI Risk Management Framework guidelines. We undergo annual SOC 2 Type II audits.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/30 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Ephemeral Sandboxing</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Customer code and prompts are processed in isolated, ephemeral environments that are destroyed immediately after analysis. No customer code trains our models by default.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/30 transition-colors">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 text-cyan-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Continuous Monitoring</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Our security operations center monitors infrastructure 24/7/365. Automated vulnerability scans run daily on all internal systems.
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-16">
                    <h2 className="text-2xl font-semibold text-white mb-8">Responsible Disclosure</h2>
                    <p className="text-slate-400 mb-6">
                        We value the security research community. If you believe you have found a security vulnerability in SentinelNexus Guard, please let us know right away. We will investigate all reports and do our best to fix valid issues quickly.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h4 className="font-semibold text-white mb-2">How to Report</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Please email your findings to <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded">admin.sentinelnexus@mayankiitj.in</span>. Include a proof of concept and detailed steps to reproduce.
                        </p>
                        <p className="text-slate-500 text-xs">
                            * We do not offer bug bounties at this time, but we will gladly acknowledge your contribution in our Hall of Fame.
                        </p>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    &copy; 2026 SentinelNexus Guard. All rights reserved.
                </div>
            </div>
        </div>
    )
}
