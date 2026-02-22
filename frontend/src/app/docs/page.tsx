'use client'

import React from 'react'
import NextLink from 'next/link'

export default function DocsPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    SentinelNexus <span className="text-blue-500">Documentation</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                    The ultimate guide to enterprise AI security. Learn how to integrate,
                    configure, and master the SentinelNexus platform to protect your AI
                    applications from the next generation of threats.
                </p>
            </section>

            {/* Quick Links / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <NextLink
                    href="/docs/api"
                    className="group p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                >
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">API Reference</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Detailed documentation for all SentinelNexus REST API endpoints, including schemas and code examples.
                    </p>
                </NextLink>

                <NextLink
                    href="/docs/quickstart"
                    className="group p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                >
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Quick Start</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Get up and running with SentinelNexus in less than 5 minutes. Connect your first project and run a scan.
                    </p>
                </NextLink>
            </div>

            {/* Core Concepts */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold text-white">Core Capabilities</h2>

                <div className="space-y-6">
                    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 space-y-4">
                        <h4 className="text-xl font-semibold text-blue-400">AI Code Scanning</h4>
                        <p className="text-slate-300">
                            Our advanced static analysis engine scans your source code for security vulnerabilities specific to AI development,
                            including hardcoded API keys, insecure prompt handling patterns, and PII leakage points.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400 text-sm list-disc pl-5">
                            <li>Vulnerability identification</li>
                            <li>Automated remediation suggestions</li>
                            <li>CI/CD pipeline integration</li>
                            <li>Risk scoring & compliance mapping</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 space-y-4">
                        <h4 className="text-xl font-semibold text-purple-400">Prompt Injection Defense</h4>
                        <p className="text-slate-300">
                            SentinelNexus provides real-time protection against malicious prompt engineering, jailbreaks, and indirect injection
                            attacks. Our semantic analysis engine detects intent, not just keywords.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400 text-sm list-disc pl-5">
                            <li>DAN/Jailbreak detection</li>
                            <li>Indirect injection prevention</li>
                            <li>Output filtering & sanitization</li>
                            <li>System prompt exposure defense</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Community / Support */}
            <section className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">Need help?</h3>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Our team of security experts is here to help you secure your AI infrastructure.
                    Join our community or reach out for priority enterprise support.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <NextLink
                        href="/contact"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300"
                    >
                        Contact Support
                    </NextLink>
                    <a
                        href="https://github.com/Mayank-iitj/sentinelnexus.ai"
                        target="_blank"
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300"
                    >
                        Community Discord
                    </a>
                </div>
            </section>
        </div>
    )
}
