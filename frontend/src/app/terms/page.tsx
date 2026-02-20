'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                        Effective Date: February 20, 2026
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        These Terms govern your use of the SentinelNexus Guard platform and services. By accessing or using our services, you agree to these terms.
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <div className="space-y-4">
                            <p>
                                By using SentinelNexus Guard ("the Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree, you must not access or use our services.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="mb-4">
                            SentinelNexus Guard provides an AI-powered security intelligence platform for analyzing code, prompts, and data for vulnerabilities. The Service includes scanning tools, dashboards, APIs, and reporting features. We reserve the right to modify or discontinue any part of the service at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                        <p className="mb-4">
                            You agree to use our Service only for lawful purposes. You represent that you own or have the necessary rights to any content (code, prompts) you submit for analysis.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                            <li><strong>Prohibited Use:</strong> You may not use the Service to:</li>
                            <ul className="list-circle pl-5 m-2 space-y-1 text-slate-400">
                                <li>Reverse engineer or decompile any part of the Service.</li>
                                <li>Conduct denial-of-service attacks or attempt to disrupt the Service.</li>
                                <li>Analyze malicious code intended for illegal distribution or harm.</li>
                                <li>Violate any applicable laws or regulations.</li>
                            </ul>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
                        <p>
                            <strong>Your Content:</strong> You retain all rights to the code and prompts you submit. We claim no ownership over your intellectual property.
                        </p>
                        <p className="mt-4">
                            <strong>Our Content:</strong> The SentinelNexus Guard platform, including its algorithms, interfaces, and trademarks, remains our exclusive property. The "SentinelNexus Guard" name and logo are trademarks of SentinelNexus AI.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, SentinelNexus Guard shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or related to your use of the Service. Our total liability for any claim arising out of these Terms shall not exceed the amount you paid us for the Service in the twelve (12) months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless SentinelNexus Guard, its affiliates, and employees from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Service or violation of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Terms</h2>
                        <p>
                            We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on this page and updating the "Effective Date." Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Information</h2>
                        <p>
                            For any questions regarding these Terms, please contact us at:
                        </p>
                        <a href="mailto:legal@sentinelnexus.ai" className="text-blue-400 hover:text-blue-300 transition-colors mt-2 inline-block">
                            legal@sentinelnexus.ai
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
