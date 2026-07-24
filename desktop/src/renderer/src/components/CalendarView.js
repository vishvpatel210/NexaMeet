import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Mic, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';
export const CalendarView = ({ meetings, onRefresh, onRecordForMeeting, onSelectMeeting }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    // Task creation state
    const [taskTitle, setTaskTitle] = useState('');
    const [taskCategory, setTaskCategory] = useState('Work');
    const [taskTime, setTaskTime] = useState('14:00');
    // Month navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    // Calendar math
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // Helper to check if two dates are on the same day
    const isSameDay = (d1, d2) => {
        return (d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate());
    };
    // Filter meetings for selected date
    const selectedDateMeetings = meetings.filter((m) => {
        const meetingDate = m.scheduledStart ? new Date(m.scheduledStart) : new Date(m.createdAt || Date.now());
        return isSameDay(meetingDate, selectedDate);
    });
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim())
            return;
        const [hours, minutes] = taskTime.split(':').map(Number);
        const scheduledDate = new Date(selectedDate);
        scheduledDate.setHours(hours || 12, minutes || 0, 0, 0);
        await ApiService.createMeeting({
            title: taskTitle,
            category: taskCategory,
            scheduledStart: scheduledDate.toISOString(),
            status: 'scheduled'
        });
        setTaskTitle('');
        setIsTaskModalOpen(false);
        onRefresh();
    };
    return (_jsxs("div", { style: { display: 'flex', gap: '2rem', height: '100%', userSelect: 'none' }, children: [_jsxs("div", { style: {
                    flex: 1.4,
                    backgroundColor: '#151D2F',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column'
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx(CalendarIcon, { size: 22, color: "#06B6D4" }), _jsxs("h2", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC' }, children: [monthNames[month], " ", year] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx("button", { onClick: prevMonth, style: {
                                            backgroundColor: '#090D16',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '10px',
                                            padding: '0.4rem 0.6rem',
                                            color: '#94A3B8',
                                            cursor: 'pointer'
                                        }, children: _jsx(ChevronLeft, { size: 18 }) }), _jsx("button", { onClick: nextMonth, style: {
                                            backgroundColor: '#090D16',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '10px',
                                            padding: '0.4rem 0.6rem',
                                            color: '#94A3B8',
                                            cursor: 'pointer'
                                        }, children: _jsx(ChevronRight, { size: 18 }) })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }, children: [_jsx("span", { children: "Sun" }), _jsx("span", { children: "Mon" }), _jsx("span", { children: "Tue" }), _jsx("span", { children: "Wed" }), _jsx("span", { children: "Thu" }), _jsx("span", { children: "Fri" }), _jsx("span", { children: "Sat" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', flex: 1 }, children: [Array.from({ length: firstDayOfMonth }).map((_, idx) => (_jsx("div", {}, `empty-${idx}`))), Array.from({ length: daysInMonth }).map((_, idx) => {
                                const dayNum = idx + 1;
                                const dateObj = new Date(year, month, dayNum);
                                const isSelected = isSameDay(dateObj, selectedDate);
                                const isToday = isSameDay(dateObj, new Date());
                                // Check if day has meetings
                                const dayMeetings = meetings.filter((m) => {
                                    const md = m.scheduledStart ? new Date(m.scheduledStart) : new Date(m.createdAt || Date.now());
                                    return isSameDay(md, dateObj);
                                });
                                return (_jsxs("div", { onClick: () => setSelectedDate(dateObj), style: {
                                        backgroundColor: isSelected ? '#1E293B' : isToday ? 'rgba(6, 182, 212, 0.1)' : '#090D16',
                                        border: isSelected ? '1px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.04)',
                                        borderRadius: '12px',
                                        padding: '0.6rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        minHeight: '70px',
                                        transition: 'all 0.15s ease',
                                        boxShadow: isSelected ? '0 0 12px rgba(6, 182, 212, 0.25)' : 'none'
                                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: {
                                                        fontSize: '0.85rem',
                                                        fontWeight: isToday || isSelected ? 700 : 500,
                                                        color: isSelected ? '#06B6D4' : isToday ? '#10B981' : '#F8FAFC'
                                                    }, children: dayNum }), dayMeetings.length > 0 && (_jsx("span", { style: {
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#06B6D4'
                                                    } }))] }), dayMeetings.length > 0 && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '2px' }, children: [dayMeetings.slice(0, 2).map((m, mIdx) => (_jsx("div", { style: {
                                                        fontSize: '0.7rem',
                                                        backgroundColor: '#1E293B',
                                                        color: '#94A3B8',
                                                        padding: '0.1rem 0.35rem',
                                                        borderRadius: '4px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }, children: m.title }, mIdx))), dayMeetings.length > 2 && (_jsxs("span", { style: { fontSize: '0.65rem', color: '#64748B' }, children: ["+", dayMeetings.length - 2, " more"] }))] }))] }, dayNum));
                            })] })] }), _jsxs("div", { style: {
                    flex: 1,
                    backgroundColor: '#151D2F',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column'
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: "Scheduled Tasks" }), _jsx("h3", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.2rem' }, children: selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) })] }), _jsxs("button", { onClick: () => setIsTaskModalOpen(true), style: {
                                    padding: '0.5rem 0.9rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    cursor: 'pointer'
                                }, children: [_jsx(Plus, { size: 16 }), "Schedule Task"] })] }), _jsx("div", { style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.9rem' }, children: selectedDateMeetings.length === 0 ? (_jsx("div", { style: { padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }, children: "No tasks scheduled for this date. Click \"+ Schedule Task\" above to add a meeting or discussion item." })) : (selectedDateMeetings.map((task) => {
                            const taskId = task.id || task._id;
                            const startTime = task.scheduledStart
                                ? new Date(task.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '14:00';
                            return (_jsxs("div", { style: {
                                    backgroundColor: '#090D16',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem'
                                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsxs("span", { style: { fontSize: '0.8rem', color: '#06B6D4', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: '0.3rem' }, children: [_jsx(Clock, { size: 14 }), " ", startTime] }), _jsx("span", { style: { fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#1E293B', color: '#94A3B8' }, children: task.category || 'Work' })] }), task.status === 'completed' ? (_jsxs("span", { style: { fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }, children: [_jsx(CheckCircle2, { size: 14 }), " Summarized"] })) : (_jsx("span", { style: { fontSize: '0.75rem', color: '#F59E0B', fontWeight: 500 }, children: "\u25CF Scheduled" }))] }), _jsx("h4", { onClick: () => onSelectMeeting(task), style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 600, color: '#F8FAFC', cursor: 'pointer' }, children: task.title }), _jsxs("button", { onClick: () => onRecordForMeeting(task), style: {
                                            width: '100%',
                                            padding: '0.6rem',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(244, 63, 94, 0.4)',
                                            backgroundColor: 'rgba(244, 63, 94, 0.1)',
                                            color: '#F43F5E',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }, children: [_jsx(Mic, { size: 16, color: "#F43F5E" }), "Record Speech & Summarize"] })] }, taskId));
                        })) })] }), isTaskModalOpen && (_jsx("div", { style: {
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(9, 13, 22, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1200
                }, children: _jsxs("div", { style: {
                        width: '420px',
                        backgroundColor: '#151D2F',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }, children: [_jsx(Sparkles, { size: 20, color: "#06B6D4" }), _jsxs("h3", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }, children: ["Schedule Task for ", selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })] })] }), _jsxs("form", { onSubmit: handleCreateTask, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }, children: "Task / Meeting Title *" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. Architecture Sprint Review", value: taskTitle, onChange: (e) => setTaskTitle(e.target.value), style: {
                                                width: '100%',
                                                padding: '0.65rem',
                                                backgroundColor: '#090D16',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: '#F8FAFC',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }, children: "Time" }), _jsx("input", { type: "time", value: taskTime, onChange: (e) => setTaskTime(e.target.value), style: {
                                                width: '100%',
                                                padding: '0.65rem',
                                                backgroundColor: '#090D16',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: '#F8FAFC',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }, children: "Category" }), _jsxs("select", { value: taskCategory, onChange: (e) => setTaskCategory(e.target.value), style: {
                                                width: '100%',
                                                padding: '0.65rem',
                                                backgroundColor: '#090D16',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: '#F8FAFC',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            }, children: [_jsx("option", { value: "Work", children: "Work" }), _jsx("option", { value: "Personal", children: "Personal" }), _jsx("option", { value: "Important", children: "Important" })] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }, children: [_jsx("button", { type: "button", onClick: () => setIsTaskModalOpen(false), style: {
                                                padding: '0.55rem 1.1rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                backgroundColor: 'transparent',
                                                color: '#94A3B8',
                                                cursor: 'pointer'
                                            }, children: "Cancel" }), _jsx("button", { type: "submit", style: {
                                                padding: '0.55rem 1.25rem',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                                                color: '#FFFFFF',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }, children: "Save Task" })] })] })] }) }))] }));
};
