import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MeetingCard } from './MeetingCard';
import { CalendarX } from 'lucide-react';
export const MeetingList = ({ meetings, loading, onSelectMeeting, onToggleStar, onDeleteMeeting }) => {
    if (loading) {
        return (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }, children: [1, 2, 3].map((i) => (_jsx("div", { style: {
                    height: '80px',
                    backgroundColor: '#151D2F',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    animation: 'pulse 1.5s infinite ease-in-out'
                } }, i))) }));
    }
    if (meetings.length === 0) {
        return (_jsxs("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#151D2F',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: '1.5rem',
                textAlign: 'center'
            }, children: [_jsx("div", { style: {
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }, children: _jsx(CalendarX, { size: 28, color: "#06B6D4" }) }), _jsx("h3", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.5rem' }, children: "No meetings found" }), _jsx("p", { style: { fontSize: '0.85rem', color: '#64748B', maxWidth: '360px' }, children: "Click \"+ New Meeting\" in the sidebar to schedule your first meeting or start recording audio instantly." })] }));
    }
    return (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1.25rem' }, children: meetings.map((meeting) => (_jsx(MeetingCard, { meeting: meeting, onSelect: onSelectMeeting, onToggleStar: onToggleStar, onDeleteMeeting: onDeleteMeeting }, meeting.id || meeting._id))) }));
};
