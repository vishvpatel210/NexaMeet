import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
export const NewMeetingModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Work');
    const [location, setLocation] = useState('');
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim())
            return;
        onSubmit({ title, category, location });
        setTitle('');
        setLocation('');
        onClose();
    };
    return (_jsx("div", { style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            userSelect: 'none'
        }, children: _jsxs("div", { style: {
                width: '440px',
                backgroundColor: '#151D2F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Sparkles, { size: 20, color: "#06B6D4" }), _jsx("h2", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }, children: "Create New Meeting" })] }), _jsx("button", { onClick: onClose, style: { background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }, children: _jsx(X, { size: 20 }) })] }), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '1.25rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }, children: "Meeting Title *" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. Architecture Review & Planning", value: title, onChange: (e) => setTitle(e.target.value), style: {
                                        width: '100%',
                                        padding: '0.65rem 0.9rem',
                                        backgroundColor: '#090D16',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px',
                                        color: '#F8FAFC',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }, children: "Category" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), style: {
                                        width: '100%',
                                        padding: '0.65rem 0.9rem',
                                        backgroundColor: '#090D16',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px',
                                        color: '#F8FAFC',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }, children: [_jsx("option", { value: "Work", children: "Work" }), _jsx("option", { value: "Personal", children: "Personal" }), _jsx("option", { value: "Important", children: "Important" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }, children: "Location / Link (Optional)" }), _jsx("input", { type: "text", placeholder: "e.g. Zoom / Google Meet / Office", value: location, onChange: (e) => setLocation(e.target.value), style: {
                                        width: '100%',
                                        padding: '0.65rem 0.9rem',
                                        backgroundColor: '#090D16',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px',
                                        color: '#F8FAFC',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    } })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }, children: [_jsx("button", { type: "button", onClick: onClose, style: {
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        backgroundColor: 'transparent',
                                        color: '#94A3B8',
                                        cursor: 'pointer'
                                    }, children: "Cancel" }), _jsx("button", { type: "submit", style: {
                                        padding: '0.6rem 1.4rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }, children: "Create" })] })] })] }) }));
};
