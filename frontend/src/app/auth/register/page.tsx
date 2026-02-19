'use client'

import React from 'react'
import { Navbar } from '@/components/Layout'
import { RegisterForm } from '@/components/Auth'

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
            <p className="text-slate-400">Join SentinelNexus Guard for enterprise AI security</p>
          </div>

          <div className="bg-dark-card border border-slate-700 rounded-lg p-6">
            <RegisterForm />
          </div>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <a href="/auth/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
