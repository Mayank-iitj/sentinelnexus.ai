'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                        Last Updated: February 20, 2026
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        At SentinelNexus Guard, we maximize the protection of your data while providing advanced AI security intelligence. This policy outlines how we collect, use, and safeguard your information.
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <div className="space-y-4">
                            <p>We collect information to provide better services to all our users. This includes:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                                <li><strong>Account Information:</strong> Name, email address, and organization details provided during registration.</li>
                                <li><strong>Usage Data:</strong> Information about how you use our platform, including scan frequency, API usage, and feature interaction.</li>
                                <li><strong>Scan Artifacts:</strong> Code snippets, prompts, and configurations submitted for security analysis. These are processed ephemerally and are not stored permanently unless explicitly configured for audit logs.</li>
                                <li><strong>Device Information:</strong> IP address, browser type, and operating system for security and analytics purposes.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                            <li>Provide, maintain, and improve our AI security services.</li>
                            <li>Detect and prevent security threats, abuse, and technical issues.</li>
                            <li>Communicate with you about product updates, security alerts, and support.</li>
                            <li>Comply with legal obligations and enforce our Terms of Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security & Retention</h2>
                        <p className="mb-4">
                            Security is our core business. We employ enterprise-grade security measures including:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                            <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
                            <li><strong>Access Control:</strong> Strict role-based access control (RBAC) and multi-factor authentication (MFA) for all internal systems.</li>
                            <li><strong>Ephemeral Processing:</strong> Code and prompt scans are processed in isolated, ephemeral sandboxes and discarded immediately after analysis, ensuring your intellectual property remains yours.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Compliance & AI Safety</h2>
                        <p>
                            We adhere to major global compliance frameworks including GDPR, CCPA, and the EU AI Act. Our AI models are rigorously tested for safety and alignment to ensure they do not generate harmful or biased outputs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:
                        </p>
                        <a href="mailto:admin.sentinelnexus@mayankiitj.in" className="text-blue-400 hover:text-blue-300 transition-colors mt-2 inline-block">
                            admin.sentinelnexus@mayankiitj.in
                        </a>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    &copy; 2026 SentinelNexus Guard. All rights reserved.
                </div>
            </div>
        </div>
    )
}
