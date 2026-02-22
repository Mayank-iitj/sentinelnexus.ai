'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Github, Mail, ShieldCheck } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 23 23">
      <path fill="#f3f3f3" d="M0 0h11v11H0z" />
      <path fill="#f3f3f3" d="M12 0h11v11H12z" />
      <path fill="#f3f3f3" d="M0 12h11v11H0z" />
      <path fill="#f3f3f3" d="M12 12h11v11H12z" />
      <path fill="#737373" d="M1 1h9v9H1z" />
      <path fill="#737373" d="M13 1h9v9H13z" />
      <path fill="#737373" d="M1 13h9v9H1z" />
      <path fill="#737373" d="M13 13h9v9H13z" />
    </svg>
  )
}

interface SocialButtonProps {
  provider: string
  label: string
  icon: React.ReactNode
  color: string
}

function SocialSignInButton({ provider, label, icon, color }: SocialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      toast.error(`${label} sign-in failed`)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-bold transition-all duration-300 group relative overflow-hidden ${color} disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] border border-white/10`}
    >
      <div className="flex items-center gap-3 relative z-10">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <div className="group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <span className="tracking-tight">{isLoading ? 'Authorizing...' : `Continue with ${label}`}</span>
      </div>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

export function LoginForm() {
  return (
    <div className="space-y-4 py-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Secure Gateway</h2>
        <p className="text-slate-400 text-sm">Please select an enterprise identity provider</p>
      </div>

      <SocialSignInButton
        provider="google"
        label="Google"
        icon={<GoogleIcon />}
        color="bg-[#1a1a1a] text-white hover:bg-[#222]"
      />

      <SocialSignInButton
        provider="github"
        label="GitHub"
        icon={<Github className="w-5 h-5 text-white" />}
        color="bg-[#24292e] text-white hover:bg-[#2f363d]"
      />

      <SocialSignInButton
        provider="azure-ad"
        label="Microsoft"
        icon={<MicrosoftIcon />}
        color="bg-[#2f2f2f] text-white hover:bg-[#3f3f3f]"
      />

      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
          By continuing, you agree to SentinelNexus'
          <a href="#" className="text-blue-500 hover:underline mx-1">Terms of Service</a>
          and
          <a href="#" className="text-blue-500 hover:underline mx-1">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export function RegisterForm() {
  return (
    <div className="space-y-4 py-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 mb-4">
          <Mail className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Create Intelligence Account</h2>
        <p className="text-slate-400 text-sm">Join the platform using your existing account</p>
      </div>

      <SocialSignInButton
        provider="google"
        label="Google"
        icon={<GoogleIcon />}
        color="bg-slate-100 text-slate-900 hover:bg-white"
      />

      <SocialSignInButton
        provider="github"
        label="GitHub"
        icon={<Github className="w-5 h-5 text-slate-900" />}
        color="bg-slate-100 text-slate-900 hover:bg-white"
      />

      <SocialSignInButton
        provider="azure-ad"
        label="Microsoft"
        icon={<MicrosoftIcon />}
        color="bg-slate-100 text-slate-900 hover:bg-white"
      />

      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
          SentinelNexus uses biometric-linked OAuth for identity verification.
          Manual registration is strictly disabled for security compliance.
        </p>
      </div>
    </div>
  )
}
