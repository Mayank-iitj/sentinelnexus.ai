'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'
import { LoginForm } from '@/components/Auth'

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your SentinelNexus Guard account</p>
          </div>

          <div className="bg-dark-card border border-slate-700 rounded-lg p-6">
            <LoginForm />
          </div>

          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-blue-400 hover:text-blue-300">
              Create one
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
