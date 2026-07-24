import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MeetingCard } from './MeetingCard.js';
import { Video } from 'lucide-react';
export const MeetingList = ({ meetings, loading, onSelectMeeting, onToggleStar }) => {
    if (loading) {
        return (_jsx("div", { style: { padding: '3rem', textAlign: 'center', color: '#94A3B8' }, children: _jsx("div", { style: { fontSize: '1rem', fontWeight: 500 }, children: "Loading meetings..." }) }));
    }
    if (meetings.length === 0) {
        return (_jsxs("div", { style: {
                padding: '4rem 2rem',
                textAlign: 'center',
                backgroundColor: '#151D2F',
                borderRadius: '16px',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }, children: [_jsx("div", { style: {
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }, children: _jsx(Video, { size: 24, color: "#64748B" }) }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.25rem' }, children: "No Meetings Found" }), _jsx("p", { style: { fontSize: '0.85rem', color: '#64748B' }, children: "Create a new meeting to begin recording audio and generating AI summaries." })] })] }));
    }
    return (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: meetings.map((meeting) => (_jsx(MeetingCard, { meeting: meeting, onSelect: onSelectMeeting, onToggleStar: onToggleStar }, meeting.id || meeting._id))) }));
};
