'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'
import { LoginForm } from '@/components/Auth'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[180px]" />
        </div>
        
        <div className="relative w-full max-w-md space-y-6 z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your SentinelNexus Guard account</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <LoginForm />
          </div>

          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
