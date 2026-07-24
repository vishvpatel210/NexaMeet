import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, Lock, Mail, User as UserIcon } from 'lucide-react';
export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/signup';
            const body = mode === 'login' ? { email, password } : { name, email, password };
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || json.error || 'Authentication failed');
            }
            if (json.token && json.user) {
                localStorage.setItem('nexameet_token', json.token);
                localStorage.setItem('nexameet_user', JSON.stringify(json.user));
                onAuthSuccess(json.user, json.token);
                onClose();
            }
        }
        catch (err) {
            setErrorMsg(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            userSelect: 'none'
        }, children: _jsxs("div", { style: {
                width: '420px',
                backgroundColor: '#151D2F',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '24px',
                padding: '2.25rem',
                boxShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
                display: 'flex',
                flexDirection: 'column'
            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' }, children: [_jsx("div", { style: {
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }, children: _jsx(Sparkles, { size: 18, color: "#FFFFFF" }) }), _jsx("h2", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC' }, children: mode === 'login' ? 'Sign In to NexaMeet' : 'Create Account' })] }), _jsx("button", { onClick: onClose, style: { background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }, children: _jsx(X, { size: 20 }) })] }), errorMsg && (_jsx("div", { style: {
                        backgroundColor: 'rgba(244, 63, 94, 0.15)',
                        border: '1px solid rgba(244, 63, 94, 0.4)',
                        borderRadius: '10px',
                        padding: '0.65rem 0.9rem',
                        color: '#F43F5E',
                        fontSize: '0.85rem',
                        marginBottom: '1.25rem'
                    }, children: errorMsg })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '1.1rem' }, children: [mode === 'signup' && (_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }, children: "Full Name *" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(UserIcon, { size: 16, color: "#64748B", style: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "text", required: true, placeholder: "e.g. Alex Software Architect", value: name, onChange: (e) => setName(e.target.value), style: {
                                                width: '100%',
                                                padding: '0.65rem 1rem 0.65rem 2.4rem',
                                                backgroundColor: '#090D16',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: '#F8FAFC',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            } })] })] })), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }, children: "Email Address *" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Mail, { size: 16, color: "#64748B", style: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "email", required: true, placeholder: "name@company.com", value: email, onChange: (e) => setEmail(e.target.value), style: {
                                                width: '100%',
                                                padding: '0.65rem 1rem 0.65rem 2.4rem',
                                                backgroundColor: '#090D16',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: '#F8FAFC',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            } })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }, children: "Password *" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Lock, { size: 16, color: "#64748B", style: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "password", required: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), style: {
                                                width: '100%',
                                                padding: '0.65rem 1rem 0.65rem 2.4rem',
                                                backgroundColor: '#090D16',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: '#F8FAFC',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            } })] })] }), _jsxs("button", { type: "submit", disabled: loading, style: {
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
                            }, children: [mode === 'login' ? _jsx(LogIn, { size: 18 }) : _jsx(UserPlus, { size: 18 }), loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'] })] }), _jsxs("div", { style: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748B' }, children: [mode === 'login' ? "Don't have an account?" : 'Already have an account?', ' ', _jsx("span", { onClick: () => {
                                setMode(mode === 'login' ? 'signup' : 'login');
                                setErrorMsg('');
                            }, style: { color: '#06B6D4', fontWeight: 600, cursor: 'pointer' }, children: mode === 'login' ? 'Sign Up' : 'Log In' })] })] }) }));
};
