import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'SentinelNexus Guard - AI Security & Compliance Intelligence Platform',
  description: 'Enterprise-grade AI security platform. Detect vulnerabilities, ensure compliance with SOC 2, GDPR, EU AI Act. Real-time threat detection, prompt injection defense, and PII protection.',
  keywords: 'AI security, AI compliance, prompt injection, LLM security, AI risk management, GDPR compliance, EU AI Act, SOC 2',
  authors: [{ name: 'SentinelNexus Guard' }],
  robots: 'index, follow',
  openGraph: {
    title: 'SentinelNexus Guard - AI Security & Compliance Intelligence',
    description: 'Enterprise-grade AI security platform with real-time vulnerability scanning.',
    url: 'https://sentinelnexusguard.com',
    siteName: 'SentinelNexus Guard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SentinelNexus Guard - AI Security & Compliance Intelligence',
    description: 'Enterprise-grade AI security platform.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-white antialiased">
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
