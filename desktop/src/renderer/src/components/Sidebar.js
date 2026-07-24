import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Video, Calendar, Star, Settings, Plus, Sparkles, FolderKanban } from 'lucide-react';
export const Sidebar = ({ activeCategory, onSelectCategory, onOpenNewMeeting }) => {
    const categories = [
        { id: 'All', label: 'All Meetings', icon: Video },
        { id: 'Work', label: 'Work', icon: FolderKanban },
        { id: 'Personal', label: 'Personal', icon: Calendar },
        { id: 'Important', label: 'Starred', icon: Star }
    ];
    return (_jsxs("aside", { style: {
            width: '240px',
            height: '100%',
            backgroundColor: '#0F172A',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem 1rem',
            userSelect: 'none'
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }, children: [_jsx("div", { style: {
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)'
                        }, children: _jsx(Sparkles, { size: 18, color: "#FFFFFF" }) }), _jsx("span", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }, children: "NexaMeet" })] }), _jsxs("button", { onClick: onOpenNewMeeting, style: {
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
                    marginBottom: '1.5rem',
                    transition: 'transform 0.15s ease'
                }, children: [_jsx(Plus, { size: 18 }), "New Meeting"] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }, children: "Categories" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.25rem' }, children: categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (_jsxs("div", { onClick: () => onSelectCategory(cat.id), style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.6rem 0.75rem',
                                    borderRadius: '10px',
                                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                                    color: isActive ? '#06B6D4' : '#94A3B8',
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }, children: [_jsx(Icon, { size: 18, color: isActive ? '#06B6D4' : '#94A3B8' }), cat.label] }, cat.id));
                        }) })] }), _jsx("div", { style: { borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }, children: _jsxs("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        color: '#94A3B8',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }, children: [_jsx(Settings, { size: 18 }), "Settings"] }) })] }));
};
