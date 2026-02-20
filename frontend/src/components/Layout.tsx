'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { authApi } from '@/lib/api'

export function Navbar() {
  const router = useRouter()
  const { user, setUser, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // ── Hydrate auth store from localStorage on every mount ──
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token && !user) {
      // Try to restore cached user first (fast)
      const cached = localStorage.getItem('user_info')
      if (cached) {
        try { setUser(JSON.parse(cached)) } catch { }
      }
      // Then verify with the server in the background
      authApi.getCurrentUser()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('user_info', JSON.stringify(res.data))
        })
        .catch(() => {
          // Token expired / invalid — clear everything
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_info')
          setUser(null)
        })
    }

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 border-b border-slate-800/50 ${scrolled
          ? 'bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-slate-950/50'
          : 'bg-slate-950/80 backdrop-blur-xl'
        } ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      style={{ transitionProperty: 'transform, opacity, background-color, box-shadow' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  SentinelNexus
                </span>
                <span className="text-lg font-semibold text-white ml-1">
                  Guard
                </span>
              </div>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-1">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/scans">Scans</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/reports">Reports</NavLink>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* User dropdown */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                    {(user.full_name || user.username)?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-white leading-tight">{user.full_name || user.username}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-1">
              <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink href="/scans" onClick={() => setMobileMenuOpen(false)}>Scans</MobileNavLink>
              <MobileNavLink href="/projects" onClick={() => setMobileMenuOpen(false)}>Projects</MobileNavLink>
              <MobileNavLink href="/reports" onClick={() => setMobileMenuOpen(false)}>Reports</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium rounded-lg hover:bg-slate-800/50 transition-all duration-200"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-3 text-slate-300 hover:text-white text-sm font-medium rounded-lg hover:bg-slate-800/50 transition-all duration-200"
    >
      {children}
    </Link>
  )
}

export function Sidebar() {
  const navItems = [
    { icon: 'home', label: 'Dashboard', href: '/dashboard' },
    { icon: 'scan', label: 'Scans', href: '/scans' },
    { icon: 'folder', label: 'Projects', href: '/projects' },
    { icon: 'chart', label: 'Analytics', href: '/analytics' },
    { icon: 'alert', label: 'Alerts', href: '/alerts' },
    { icon: 'settings', label: 'Settings', href: '/settings' },
  ]

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800 min-h-screen">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Navigation</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
