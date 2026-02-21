'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from '@/components/Layout'
import Link from 'next/link'

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [welcomePhase, setWelcomePhase] = useState(0)


  useEffect(() => {
    // Phase 1: Logo appears
    const t1 = setTimeout(() => setWelcomePhase(1), 200)
    // Phase 2: Text reveals
    const t2 = setTimeout(() => setWelcomePhase(2), 800)
    // Phase 3: Tagline
    const t3 = setTimeout(() => setWelcomePhase(3), 1500)
    // Phase 4: Fade out
    const t4 = setTimeout(() => setWelcomePhase(4), 2800)
    // Phase 5: Remove welcome
    const t5 = setTimeout(() => setShowWelcome(false), 3500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])



  if (showWelcome) {
    return (
      <div className={`fixed inset-0 z-50 bg-slate-950 flex items-center justify-center overflow-hidden transition-opacity duration-700 ${welcomePhase >= 4 ? 'opacity-0' : 'opacity-100'}`}>
        {/* Dynamic background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/40 rounded-full blur-[200px] transition-all duration-1000 ${welcomePhase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-[150px] transition-all duration-1000 delay-200 ${welcomePhase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/40 rounded-full blur-[120px] transition-all duration-1000 delay-300 ${welcomePhase >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
        </div>

        {/* Shield animation */}
        <div className="relative z-10 text-center">
          <div className={`mb-8 transition-all duration-700 ${welcomePhase >= 1 ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'}`}>
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-3xl animate-pulse shadow-2xl shadow-blue-500/50" />
              <div className="absolute inset-1 bg-slate-900 rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              {/* Rotating ring */}
              <div className="absolute -inset-4 border-2 border-blue-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute -inset-8 border border-cyan-500/20 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            </div>
          </div>

          {/* Text reveal */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-4 transition-all duration-700 ${welcomePhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-white">SentinelNexus</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"> Guard</span>
          </h1>

          {/* Tagline with typing effect */}
          <p className={`text-xl text-slate-400 transition-all duration-700 ${welcomePhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
              Initializing AI Security Intelligence...
            </span>
          </p>

          {/* Loading bar */}
          <div className={`mt-8 w-64 mx-auto h-1 bg-slate-800 rounded-full overflow-hidden transition-opacity duration-500 ${welcomePhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full transition-all duration-2000"
              style={{ width: welcomePhase >= 3 ? '100%' : '0%' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="bg-slate-950 min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative animate-fade-in-up">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute top-60 -left-40 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse delay-1000" />
            <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse delay-500" />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2Mmgtdi0yem0tNCA0di0yaDJ2MmgtMnptMi00di0yaDJ2MmgtMnptLTItNHYyaC0ydi0yaDJ6bS00IDRoMnYyaC0ydi0yem0wLTRoMnYyaC0ydi0yem0tNCA0aDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Enterprise AI Security Platform
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block text-white">SentinelNexus</span>
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Guard
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Next-generation AI security intelligence. Detect vulnerabilities, ensure compliance, and protect your AI applications with enterprise-grade scanning.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Free Trial
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <a
                  href="https://drive.google.com/file/d/1hLKbVFkG4y6dxi8e8ix3C3eeUzwAltK_/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500/50 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40 group-hover:opacity-75"></span>
                      <svg className="relative w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    Watch Demo
                  </span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
                {['SOC 2 Ready', 'GDPR Compliant', 'EU AI Act Ready', 'ISO 27001'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Stats Section */}
        <div className="relative border-y border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '99.9%', label: 'Detection Accuracy', icon: '🎯' },
                { value: '50ms', label: 'Avg Scan Time', icon: '⚡' },
                { value: '10K+', label: 'Scans Processed', icon: '🔍' },
                { value: '500+', label: 'Enterprise Clients', icon: '🏢' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Features</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Everything you need to secure AI
              </h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Comprehensive security scanning for modern AI applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '💻',
                  title: 'Code Security Scanning',
                  description: 'Detect hardcoded secrets, PII exposure, unsafe patterns, and dangerous function calls in your codebase.',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: '🛡️',
                  title: 'Prompt Injection Defense',
                  description: 'Identify jailbreak attempts, injection vectors, and data exfiltration risks in LLM prompts.',
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: '🔐',
                  title: 'PII & Data Protection',
                  description: 'Scan for emails, phone numbers, credit cards, SSNs and ensure GDPR & AI Act compliance.',
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: '📊',
                  title: 'AI Risk Scoring',
                  description: 'Get comprehensive risk scores and downloadable compliance audit reports for your AI systems.',
                  gradient: 'from-orange-500 to-red-500',
                },
                {
                  icon: '🔔',
                  title: 'Real-time Alerts',
                  description: 'Get instant email and Slack notifications for critical risks and compliance violations.',
                  gradient: 'from-yellow-500 to-orange-500',
                },
                {
                  icon: '🔄',
                  title: 'Continuous Monitoring',
                  description: 'Track toxicity, hallucinations, bias, and output drift in real-time across your AI models.',
                  gradient: 'from-indigo-500 to-blue-500',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="relative py-24 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">How It Works</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Secure your AI in minutes
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500" />

              {[
                { step: '01', title: 'Connect', desc: 'Connect your repositories and AI applications', icon: '🔗' },
                { step: '02', title: 'Scan', desc: 'Our AI scans for vulnerabilities and compliance issues', icon: '🔍' },
                { step: '03', title: 'Protect', desc: 'Get actionable insights and automated protection', icon: '✅' },
              ].map((item, idx) => (
                <div key={idx} className="relative text-center group">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-slate-700 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-5xl">{item.icon}</span>
                  </div>
                  <div className="text-blue-400 font-mono text-sm mb-2">{item.step}</div>
                  <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Pricing</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Simple, transparent pricing
              </h3>
              <p className="text-slate-400 text-lg">Start free, scale as you grow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'Starter',
                  price: '$0',
                  period: 'forever',
                  description: 'Perfect for exploring SentinelNexus Guard',
                  features: ['5 scans/month', 'Code security scanning', 'PII detection', 'Email support'],
                  cta: 'Get Started',
                  highlighted: false,
                },
                {
                  name: 'Pro',
                  price: '$299',
                  period: '/month',
                  description: 'For growing teams',
                  features: ['100 scans/month', 'All scanning engines', 'Custom rules', 'Slack integration', 'Priority support', 'API access'],
                  cta: 'Start Free Trial',
                  highlighted: true,
                },
                {
                  name: 'Enterprise',
                  price: '$999',
                  period: '/month',
                  description: 'For large organizations',
                  features: ['Unlimited scans', 'All Pro features', 'SOC 2 reports', 'SSO/SAML', 'Dedicated support', 'Custom SLA'],
                  cta: 'Contact Sales',
                  highlighted: false,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${plan.highlighted
                    ? 'bg-gradient-to-b from-blue-600/20 to-blue-900/20 border-blue-500/50 ring-1 ring-blue-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative py-24 bg-slate-900/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">Testimonials</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Trusted by industry leaders
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Chen', role: 'CTO, TechFlow AI', text: 'SentinelNexus Guard transformed our security posture. We catch vulnerabilities before they become problems.', avatar: '👩‍💼' },
                { name: 'Marcus Johnson', role: 'Security Lead, DataCorp', text: 'The prompt injection detection alone saved us from a major security incident. Essential for any AI team.', avatar: '👨‍💻' },
                { name: 'Emily Rodriguez', role: 'VP Engineering, MLOps Inc', text: 'Best investment we made for AI compliance. SOC 2 audit was a breeze with their reports.', avatar: '👩‍🔬' },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm hover:-translate-y-1 hover:border-slate-600 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">"{testimonial.text}"</p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to secure your AI?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join thousands of teams using SentinelNexus Guard to protect their AI applications
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Contact Admin Section */}
        <div id="contact" className="relative py-24 overflow-hidden">
          {/* Blended background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[180px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[200px] mix-blend-screen animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[150px] mix-blend-overlay animate-pulse delay-300" />
          </div>

          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent backdrop-blur-sm" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">Get In Touch</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Contact the Admin
              </h3>
              <p className="text-slate-400 text-lg">
                Have questions? Reach out through any of these channels
              </p>
            </div>

            {/* Contact cards with blended glass effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Email Cards */}
              <a
                href="mailto:admin.sentinelnexus@mayankiitj.in"
                className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">admin.sentinelnexus@mayankiitj.in</div>
                    <div className="text-slate-400 text-sm">Primary Email</div>
                  </div>
                </div>
              </a>

              <a
                href="mailto:ms1591934@gmail.com"
                className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold group-hover:text-purple-400 transition-colors">ms1591934@gmail.com</div>
                    <div className="text-slate-400 text-sm">Secondary Email (Personal)</div>
                  </div>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://linkedin.com/in/mayankiitj"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-8 py-5 hover:border-blue-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-600/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen" />
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-blue-600/30 rounded-full blur-2xl group-hover:bg-blue-600/50 transition-all duration-500" />
                <div className="relative w-12 h-12 bg-[#0A66C2] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="relative">
                  <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">LinkedIn</div>
                  <div className="text-slate-400 text-sm">@mayankiitj</div>
                </div>
              </a>

              <a
                href="https://github.com/Mayank-iitj"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-8 py-5 hover:border-slate-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-slate-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-500/30 rounded-full blur-2xl group-hover:bg-slate-400/50 transition-all duration-500" />
                <div className="relative w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-slate-700 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div className="relative">
                  <div className="text-white font-semibold group-hover:text-slate-300 transition-colors">GitHub</div>
                  <div className="text-slate-400 text-sm">@Mayank-iitj</div>
                </div>
              </a>
            </div>

            {/* Decorative element */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-slate-600" />
                <span>Built with 💙 by Mayank</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-12 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-bold">SentinelNexus</span>
                    <span className="text-slate-400 font-semibold ml-1">Guard</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Next-generation AI security intelligence platform.</p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
              <div className="text-slate-500 text-sm">
                © 2026 SentinelNexus Guard. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a
                  href="https://linkedin.com/in/mayankiitj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 hover:-translate-y-1 inline-block transition-all text-sm"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Mayank-iitj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white hover:-translate-y-1 inline-block transition-all text-sm"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
