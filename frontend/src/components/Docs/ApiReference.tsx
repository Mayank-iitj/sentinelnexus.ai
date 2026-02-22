'use client'

import React, { useState } from 'react'

interface EndpointProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    description: string
    requestBody?: any
    responseBody?: any
    parameters?: { name: string; type: string; required: boolean; description: string }[]
    statusCodes?: { code: number; description: string }[]
}

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    return (
        <div className="relative group mt-4">
            <div className="absolute top-2 right-2 text-xs text-slate-500 uppercase font-mono bg-slate-800/50 px-2 py-1 rounded">
                {language}
            </div>
            <pre className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto text-sm font-mono text-slate-300 custom-scrollbar">
                <code>{code}</code>
            </pre>
            <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="absolute bottom-2 right-2 p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy code"
            >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
        </div>
    )
}

export const ApiEndpoint: React.FC<EndpointProps> = ({
    method,
    path,
    description,
    requestBody,
    responseBody,
    parameters,
    statusCodes
}) => {
    const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'js'>('curl')

    const getMethodColor = (m: string) => {
        switch (m) {
            case 'GET': return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'POST': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case 'PUT': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            case 'DELETE': return 'text-red-400 bg-red-400/10 border-red-400/20'
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
        }
    }

    const curlExample = `curl -X ${method} "https://api.sentinelnexus.mayankiitj.in${path}" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  ${requestBody ? `-H "Content-Type: application/json" \\
  -d '${JSON.stringify(requestBody, null, 2)}'` : ''}`

    const pythonExample = `import requests

url = "https://api.sentinelnexus.mayankiitj.in${path}"
headers = {
    "Authorization": "Bearer YOUR_TOKEN"${requestBody ? ',\n    "Content-Type": "application/json"' : ''}
}

response = requests.${method.toLowerCase()}(
    url, 
    headers=headers${requestBody ? ',\n    json=' + JSON.stringify(requestBody, null, 4) : ''}
)

print(response.json())`

    const jsExample = `const response = await fetch("https://api.sentinelnexus.mayankiitj.in${path}", {
  method: "${method}",
  headers: {
    "Authorization": "Bearer YOUR_TOKEN"${requestBody ? ',\n    "Content-Type": "application/json"' : ''}
  }${requestBody ? ',\n  body: JSON.stringify(' + JSON.stringify(requestBody, null, 2) + ')' : ''}
});

const data = await response.json();
console.log(data);`

    return (
        <div className="py-12 border-b border-slate-800 last:border-0 scroll-mt-24" id={path.replace(/\//g, '-').substring(1)}>
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left column: Info */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getMethodColor(method)}`}>
                            {method}
                        </span>
                        <code className="text-sm font-mono text-slate-200">{path}</code>
                    </div>

                    <p className="text-slate-400 leading-relaxed text-lg">
                        {description}
                    </p>

                    {parameters && parameters.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Parameters</h4>
                            <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800/50 text-slate-400">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Name</th>
                                            <th className="px-4 py-3 font-semibold">Type</th>
                                            <th className="px-4 py-3 font-semibold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {parameters.map((p) => (
                                            <tr key={p.name}>
                                                <td className="px-4 py-3">
                                                    <code className="text-blue-400">{p.name}</code>
                                                    {p.required && <span className="ml-2 text-[10px] text-red-500 font-bold uppercase">Required</span>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.type}</td>
                                                <td className="px-4 py-3 text-slate-400">{p.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {statusCodes && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Responses</h4>
                            <div className="space-y-2">
                                {statusCodes.map((s) => (
                                    <div key={s.code} className="flex gap-4 text-sm">
                                        <span className={`font-mono font-bold ${s.code < 300 ? 'text-green-500' : 'text-red-500'}`}>
                                            {s.code}
                                        </span>
                                        <span className="text-slate-400">{s.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column: Examples */}
                <div className="lg:w-1/2 xl:w-[45%] flex-shrink-0">
                    <div className="sticky top-24 space-y-4">
                        <div className="flex border-b border-slate-800">
                            {(['curl', 'python', 'js'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${activeTab === tab
                                            ? 'text-blue-400 border-blue-500'
                                            : 'text-slate-500 border-transparent hover:text-slate-300'
                                        }`}
                                >
                                    {tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : 'JavaScript'}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'curl' && <CodeBlock code={curlExample} language="bash" />}
                        {activeTab === 'python' && <CodeBlock code={pythonExample} language="python" />}
                        {activeTab === 'js' && <CodeBlock code={jsExample} language="javascript" />}

                        {responseBody && (
                            <div className="mt-6">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Response Sample</h5>
                                <pre className="p-4 bg-slate-900 shadow-inner rounded-xl overflow-x-auto text-xs font-mono text-green-400/80 custom-scrollbar border border-slate-800">
                                    <code>{JSON.stringify(responseBody, null, 2)}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ApiSection = ({ title, children, id }: { title: string; children: React.ReactNode; id: string }) => {
    return (
        <div className="pt-16 first:pt-4" id={id}>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8" />
            <div className="space-y-4">
                {children}
            </div>
        </div>
    )
}
