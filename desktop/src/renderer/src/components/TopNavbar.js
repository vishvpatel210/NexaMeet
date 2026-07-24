import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, RefreshCw, Wifi, WifiOff, User as UserIcon, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';
export const TopNavbar = ({ searchQuery, onSearchChange, onRefresh, backendConnected }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    useEffect(() => {
        const storedUser = localStorage.getItem('nexameet_user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            }
            catch (e) {
                // ignore
            }
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('nexameet_token');
        localStorage.removeItem('nexameet_user');
        setCurrentUser(null);
    };
    return (_jsxs("header", { style: {
            height: '64px',
            backgroundColor: '#090D16',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2.5rem',
            userSelect: 'none'
        }, children: [_jsxs("div", { style: { position: 'relative', width: '380px' }, children: [_jsx(Search, { size: 18, color: "#64748B", style: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "text", placeholder: "Search meeting title, transcript, or AI summary...", value: searchQuery, onChange: (e) => onSearchChange(e.target.value), style: {
                            width: '100%',
                            padding: '0.55rem 1rem 0.55rem 2.5rem',
                            backgroundColor: '#151D2F',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            color: '#F8FAFC',
                            fontSize: '0.85rem',
                            fontFamily: 'Inter, sans-serif',
                            outline: 'none',
                            transition: 'all 0.15s ease'
                        } })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            backgroundColor: backendConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                            border: backendConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: backendConnected ? '#10B981' : '#F43F5E'
                        }, children: [backendConnected ? _jsx(Wifi, { size: 14 }) : _jsx(WifiOff, { size: 14 }), backendConnected ? 'API Connected' : 'Offline'] }), currentUser ? (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' }, children: [_jsxs("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: '#151D2F',
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    borderRadius: '20px',
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.82rem',
                                    color: '#F8FAFC',
                                    fontWeight: 600
                                }, children: [_jsx(UserIcon, { size: 14, color: "#06B6D4" }), currentUser.name || currentUser.email] }), _jsx("button", { onClick: handleLogout, title: "Log Out", style: {
                                    backgroundColor: '#151D2F',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#94A3B8',
                                    cursor: 'pointer'
                                }, children: _jsx(LogOut, { size: 14 }) })] })) : (_jsx("button", { onClick: () => setIsAuthModalOpen(true), style: {
                            padding: '0.4rem 0.9rem',
                            borderRadius: '10px',
                            border: '1px solid #06B6D4',
                            backgroundColor: 'rgba(6, 182, 212, 0.12)',
                            color: '#06B6D4',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                        }, children: "Sign In" })), _jsx("button", { onClick: onRefresh, title: "Refresh Data", style: {
                            backgroundColor: '#151D2F',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '0.45rem',
                            color: '#94A3B8',
                            cursor: 'pointer'
                        }, children: _jsx(RefreshCw, { size: 16 }) })] }), _jsx(AuthModal, { isOpen: isAuthModalOpen, onClose: () => setIsAuthModalOpen(false), onAuthSuccess: (user) => setCurrentUser(user) })] }));
};
