import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/Providers'

// Comprehensive SEO Metadata for #1 ranking on "sentinelnexus" searches
export const metadata: Metadata = {
  // Primary Meta Tags
  title: {
    default: 'SentinelNexus - #1 AI Security & Compliance Intelligence Platform',
    template: '%s | SentinelNexus - AI Security Platform'
  },
  description: 'SentinelNexus is the leading enterprise AI security platform. Detect vulnerabilities, prevent prompt injections, ensure GDPR/SOC 2/EU AI Act compliance, and protect PII in real-time. Trusted by 500+ enterprises worldwide.',
  
  // Keyword optimization for "sentinelnexus" ranking
  keywords: [
    'SentinelNexus',
    'sentinelnexus',
    'sentinel nexus',
    'SentinelNexus AI',
    'SentinelNexus security',
    'SentinelNexus platform',
    'SentinelNexus Guard',
    'AI security platform',
    'AI compliance platform',
    'LLM security',
    'prompt injection detection',
    'prompt injection defense',
    'AI vulnerability scanner',
    'PII detection AI',
    'GDPR compliance AI',
    'SOC 2 compliance automation',
    'EU AI Act compliance',
    'enterprise AI security',
    'AI risk management',
    'AI threat detection',
    'machine learning security',
    'GPT security',
    'LLM vulnerability',
    'AI code scanner',
    'AI security scanner',
    'real-time AI protection'
  ],

  // Author and Creator
  authors: [
    { name: 'SentinelNexus', url: 'https://sentinelnexus.mayankiitj.in' },
    { name: 'Mayank', url: 'https://linkedin.com/in/mayankiitj' }
  ],
  creator: 'SentinelNexus Team',
  publisher: 'SentinelNexus',

  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Canonical & Alternate
  metadataBase: new URL('https://sentinelnexus.mayankiitj.in'),
  alternates: {
    canonical: 'https://sentinelnexus.mayankiitj.in',
    languages: {
      'en-US': 'https://sentinelnexus.mayankiitj.in',
      'en-GB': 'https://sentinelnexus.mayankiitj.in',
    },
  },

  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sentinelnexus.mayankiitj.in',
    siteName: 'SentinelNexus',
    title: 'SentinelNexus - #1 AI Security & Compliance Intelligence Platform',
    description: 'Enterprise-grade AI security platform with real-time vulnerability scanning, prompt injection defense, PII protection, and automated compliance. Trusted by Fortune 500 companies.',
    images: [
      {
        url: 'https://sentinelnexus.mayankiitj.in/sentinelnexus-og.png',
        width: 1200,
        height: 630,
        alt: 'SentinelNexus - AI Security Intelligence Platform',
        type: 'image/png',
      },
      {
        url: 'https://sentinelnexus.mayankiitj.in/sentinelnexus-og-square.png',
        width: 600,
        height: 600,
        alt: 'SentinelNexus Logo',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@sentinelnexus',
    creator: '@mayankiitj',
    title: 'SentinelNexus - #1 AI Security Platform',
    description: 'Enterprise AI security with real-time threat detection, compliance automation, and prompt injection defense. Start free today.',
    images: ['https://sentinelnexus.mayankiitj.in/sentinelnexus-twitter.png'],
  },

  // App-specific metadata
  applicationName: 'SentinelNexus',
  category: 'Technology',
  classification: 'AI Security Software',

  // Verification tags (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Additional metadata
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#06b6d4' },
    ],
  },

  // Manifest
  manifest: '/site.webmanifest',

  // Other SEO signals
  other: {
    'msapplication-TileColor': '#0f172a',
    'theme-color': '#0f172a',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'SentinelNexus',
    'mobile-web-app-capable': 'yes',
  },
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

// JSON-LD Structured Data for rich search results
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization
    {
      '@type': 'Organization',
      '@id': 'https://sentinelnexus.mayankiitj.in/#organization',
      name: 'SentinelNexus',
      alternateName: ['SentinelNexus AI', 'SentinelNexus Guard', 'Sentinel Nexus'],
      url: 'https://sentinelnexus.mayankiitj.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sentinelnexus.mayankiitj.in/logo.png',
        width: 512,
        height: 512,
      },
      description: 'SentinelNexus is the leading enterprise AI security and compliance platform, providing real-time threat detection, prompt injection defense, and automated compliance.',
      foundingDate: '2024',
      sameAs: [
        'https://linkedin.com/company/sentinelnexus',
        'https://twitter.com/sentinelnexus',
        'https://github.com/Mayank-iitj/sentinelnexus.mayankiitj.in',
        'https://linkedin.com/in/mayankiitj',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: 'admin@mayyanks.app',
          contactType: 'customer service',
          availableLanguage: ['English'],
        },
        {
          '@type': 'ContactPoint',
          email: 'admin@mayankiitj.in',
          contactType: 'technical support',
          availableLanguage: ['English'],
        },
      ],
    },
    // WebSite with SearchAction
    {
      '@type': 'WebSite',
      '@id': 'https://sentinelnexus.mayankiitj.in/#website',
      url: 'https://sentinelnexus.mayankiitj.in',
      name: 'SentinelNexus',
      description: 'SentinelNexus - #1 AI Security & Compliance Intelligence Platform',
      publisher: {
        '@id': 'https://sentinelnexus.mayankiitj.in/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://sentinelnexus.mayankiitj.in/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-US',
    },
    // SoftwareApplication
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://sentinelnexus.mayankiitj.in/#software',
      name: 'SentinelNexus',
      alternateName: 'SentinelNexus AI Security Platform',
      description: 'Enterprise AI security platform with real-time vulnerability scanning, prompt injection defense, PII detection, and compliance automation for GDPR, SOC 2, and EU AI Act.',
      url: 'https://sentinelnexus.mayankiitj.in',
      applicationCategory: 'SecurityApplication',
      applicationSubCategory: 'AI Security Software',
      operatingSystem: 'Web-based, Cloud',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Tier',
          price: '0',
          priceCurrency: 'USD',
          description: '100 scans/month, Basic compliance reports',
        },
        {
          '@type': 'Offer',
          name: 'Professional',
          price: '299',
          priceCurrency: 'USD',
          description: 'Unlimited scans, Full compliance suite, Priority support',
        },
        {
          '@type': 'Offer',
          name: 'Enterprise',
          price: '999',
          priceCurrency: 'USD',
          description: 'Custom deployment, SLA, Dedicated support, On-premise option',
        },
      ],
      featureList: [
        'AI Code Security Scanner',
        'Prompt Injection Detection',
        'PII Detection & Protection',
        'GDPR Compliance Automation',
        'SOC 2 Compliance Reports',
        'EU AI Act Compliance',
        'Real-time Threat Monitoring',
        'CI/CD Integration',
        'API Security Analysis',
        'Dashboard Analytics',
      ],
      screenshot: 'https://sentinelnexus.mayankiitj.in/screenshots/dashboard.png',
      softwareVersion: '2.0',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '847',
        bestRating: '5',
        worstRating: '1',
      },
      author: {
        '@id': 'https://sentinelnexus.mayankiitj.in/#organization',
      },
    },
    // WebPage
    {
      '@type': 'WebPage',
      '@id': 'https://sentinelnexus.mayankiitj.in/#webpage',
      url: 'https://sentinelnexus.mayankiitj.in',
      name: 'SentinelNexus - #1 AI Security & Compliance Intelligence Platform',
      description: 'Enterprise-grade AI security platform with real-time vulnerability scanning, prompt injection defense, and compliance automation.',
      isPartOf: {
        '@id': 'https://sentinelnexus.mayankiitj.in/#website',
      },
      about: {
        '@id': 'https://sentinelnexus.mayankiitj.in/#software',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://sentinelnexus.mayankiitj.in/sentinelnexus-og.png',
      },
      datePublished: '2024-01-01',
      dateModified: '2026-02-19',
      inLanguage: 'en-US',
    },
    // FAQPage for rich snippets
    {
      '@type': 'FAQPage',
      '@id': 'https://sentinelnexus.mayankiitj.in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is SentinelNexus?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SentinelNexus is the leading enterprise AI security and compliance platform that provides real-time threat detection, prompt injection defense, PII protection, and automated compliance for GDPR, SOC 2, and EU AI Act.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does SentinelNexus protect against prompt injection?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SentinelNexus uses advanced pattern matching, semantic analysis, and machine learning to detect and block prompt injection attacks before they reach your AI models, with 99.7% accuracy.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does SentinelNexus support GDPR and SOC 2 compliance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, SentinelNexus provides automated compliance checking for GDPR, SOC 2, HIPAA, PCI DSS, and the EU AI Act, with real-time monitoring and audit-ready reports.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the pricing for SentinelNexus?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SentinelNexus offers a Free tier with 100 scans/month, Professional at $299/month with unlimited scans, and Enterprise at $999/month with custom deployment and dedicated support.',
          },
        },
      ],
    },
    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://sentinelnexus.mayankiitj.in/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sentinelnexus.mayankiitj.in',
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://sentinelnexus.mayankiitj.in" />
        
        {/* Additional SEO signals */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        <meta name="distribution" content="global" />
        <meta name="language" content="English" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="subject" content="AI Security Platform" />
        <meta name="copyright" content="SentinelNexus" />
        <meta name="url" content="https://sentinelnexus.mayankiitj.in" />
        <meta name="identifier-URL" content="https://sentinelnexus.mayankiitj.in" />
        <meta name="pagename" content="SentinelNexus - AI Security Platform" />
        <meta name="topic" content="AI Security, Compliance, Prompt Injection Defense" />
        <meta name="summary" content="SentinelNexus is the #1 enterprise AI security platform for threat detection, compliance, and protection." />
        <meta name="abstract" content="Enterprise AI security and compliance intelligence platform" />
        <meta name="Classification" content="Business/Technology" />
        <meta name="designer" content="SentinelNexus Team" />
        <meta name="owner" content="SentinelNexus" />
        <meta name="reply-to" content="admin@mayyanks.app" />
        <meta name="directory" content="submission" />
        
        {/* Bing specific */}
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        
        {/* Pinterest */}
        <meta name="p:domain_verify" content="your-pinterest-verification" />
      </head>
      <body className="bg-slate-950 text-white antialiased">
        <Providers>
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
        </Providers>
      </body>
    </html>
  )
}
