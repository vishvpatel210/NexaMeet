import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export default function App() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchHealth = async () => {
            try {
                if (window.nexameetAPI) {
                    const res = await window.nexameetAPI.checkBackendHealth();
                    setHealth(res);
                }
                else {
                    // Direct HTTP fallback for dev preview
                    const res = await fetch('http://localhost:5000/api/v1/health');
                    const data = await res.json();
                    setHealth(data);
                }
            }
            catch (err) {
                setHealth({ status: 'offline', error: 'Failed to reach API server' });
            }
            finally {
                setLoading(false);
            }
        };
        fetchHealth();
    }, []);
    return (_jsx("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '2rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, #0F172A 0%, #090D16 100%)'
        }, children: _jsxs("div", { style: {
                background: 'rgba(21, 29, 47, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '2.5rem 3rem',
                maxWidth: '520px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }, children: [_jsx("div", { style: {
                        display: 'inline-block',
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                        marginBottom: '1.25rem',
                        boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)'
                    } }), _jsx("h1", { style: {
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '1.85rem',
                        fontWeight: 700,
                        color: '#F8FAFC',
                        marginBottom: '0.5rem'
                    }, children: "NexaMeet AI Desktop" }), _jsx("p", { style: { color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.75rem' }, children: "Milestone 1 Scaffolding: Monorepo & Express API Health Channel" }), _jsxs("div", { style: {
                        background: '#090D16',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontFamily: 'JetBrains Mono, monospace'
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }, children: [_jsx("span", { style: { color: '#64748B' }, children: "Backend Connection:" }), loading ? (_jsx("span", { style: { color: '#F59E0B' }, children: "Connecting..." })) : health?.status === 'ok' ? (_jsx("span", { style: { color: '#10B981', fontWeight: 600 }, children: "\u25CF Connected (200 OK)" })) : (_jsx("span", { style: { color: '#F43F5E', fontWeight: 600 }, children: "\u25CB Offline" }))] }), _jsx("div", { style: { color: '#94A3B8', fontSize: '0.8rem', wordBreak: 'break-all' }, children: JSON.stringify(health, null, 2) })] })] }) }));
}
