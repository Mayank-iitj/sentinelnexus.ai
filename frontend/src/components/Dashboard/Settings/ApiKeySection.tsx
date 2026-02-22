'use client'

import React, { useState, useEffect } from 'react'
import { apiKeyApi } from '@/lib/api'
import { Plus, Trash2, Key, Copy, Check, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ApiKey {
    id: string
    name: string
    key_prefix: string
    created_at: string
    last_used_at: string | null
    expires_at: string | null
}

export default function ApiKeySection() {
    const [keys, setKeys] = useState<ApiKey[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newKeyName, setNewKeyName] = useState('')
    const [newKeyData, setNewKeyData] = useState<any>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const fetchKeys = async () => {
        try {
            const response = await apiKeyApi.listKeys()
            setKeys(response.data)
        } catch (error) {
            toast.error('Failed to load API keys')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchKeys()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newKeyName) return

        setIsCreating(true)
        try {
            const response = await apiKeyApi.createKey(newKeyName)
            setNewKeyData(response.data)
            setNewKeyName('')
            fetchKeys()
            toast.success('API Key created successfully')
        } catch (error) {
            toast.error('Failed to create API key')
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return

        try {
            await apiKeyApi.deleteKey(id)
            setKeys(keys.filter(k => k.id !== id))
            toast.success('API Key revoked')
        } catch (error) {
            toast.error('Failed to revoke API key')
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast.success('Copied to clipboard')
    }

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">API Keys</h2>
                    <p className="text-slate-400">Create security keys for programmatic access to the SentinelNexus engine.</p>
                </div>
                <Plus className="w-8 h-8 text-blue-500/20" />
            </div>

            {newKeyData && (
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden ring-2 ring-blue-500/20">
                    <div className="flex items-center gap-3 mb-4 text-blue-400 font-bold">
                        <AlertCircle className="w-5 h-5" />
                        Save your secret key
                    </div>
                    <p className="text-sm text-blue-300/80 mb-4 max-w-xl">
                        This secret key will only be shown <span className="text-white font-bold underline">once</span>. If you lose it, you will need to create a new one.
                    </p>
                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-blue-500/20">
                        <code className="flex-1 text-white font-mono break-all text-sm">{newKeyData.plain_text_key}</code>
                        <button
                            onClick={() => copyToClipboard(newKeyData.plain_text_key, 'new')}
                            className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg"
                        >
                            {copiedId === 'new' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <button
                        onClick={() => setNewKeyData(null)}
                        className="mt-4 text-sm text-blue-400 font-medium hover:text-white transition-colors"
                    >
                        I've stored this key securely
                    </button>
                </div>
            )}

            <form onSubmit={handleCreate} className="flex gap-4">
                <input
                    type="text"
                    placeholder="e.g. Production Scanner"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
                <button
                    type="submit"
                    disabled={isCreating || !newKeyName}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
                >
                    {isCreating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-5 h-5" />}
                    Generate Key
                </button>
            </form>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Your Active Keys
                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{keys.length}</span>
                </h3>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-sm">Fetching credentials...</p>
                    </div>
                ) : keys.length === 0 ? (
                    <div className="py-20 bg-white/5 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-500">
                        <Key className="w-12 h-12 text-slate-800" />
                        <p className="text-sm">No API keys found. Create one to get started.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {keys.map((key) => (
                            <div key={key.id} className="group bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{key.name}</h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <code className="text-blue-400/80 font-mono">{key.key_prefix}••••••••</code>
                                            <span className="flex items-center gap-1.5 uppercase tracking-tighter font-bold">
                                                <Clock className="w-3 h-3" />
                                                Created {new Date(key.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(key.id)}
                                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                        title="Revoke Key"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
