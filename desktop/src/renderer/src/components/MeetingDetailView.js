import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Play, Pause, Volume2, FileText, Sparkles, CheckSquare, Square, Star, Plus, Trash2, Clock, RefreshCw, Mic, AlertTriangle, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
export const MeetingDetailView = ({ meeting, onBack, onToggleStar, onOpenRecordingModalForMeeting }) => {
    const [recordings, setRecordings] = useState([]);
    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);
    const [actionItems, setActionItems] = useState([]);
    const [activeTab, setActiveTab] = useState('summary');
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loadingAI, setLoadingAI] = useState(false);
    const [retryingRecordingId, setRetryingRecordingId] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('executive-brief');
    const [rawUserNotes, setRawUserNotes] = useState('');
    const audioRef = useRef(null);
    const meetingId = meeting.id || meeting._id;
    const fetchMeetingDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/meetings/${meetingId}`);
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setRecordings(json.data.recordings || []);
                    setTranscript(json.data.transcript || null);
                    setSummary(json.data.summary || null);
                    setActionItems(json.data.actionItems || []);
                    if (json.data.recordings && json.data.recordings.length > 0) {
                        if (!selectedRecording) {
                            setSelectedRecording(json.data.recordings[0]);
                        }
                        else {
                            const updatedSel = json.data.recordings.find((r) => (r.id || r._id) === (selectedRecording.id || selectedRecording._id));
                            if (updatedSel)
                                setSelectedRecording(updatedSel);
                        }
                    }
                    else {
                        setSelectedRecording(null);
                    }
                    if (json.data.summary?.rawUserNotes) {
                        setRawUserNotes(json.data.summary.rawUserNotes);
                    }
                }
            }
        }
        catch (err) {
            console.error('Failed to fetch meeting detail:', err);
        }
    };
    useEffect(() => {
        fetchMeetingDetails();
    }, [meetingId]);
    const handlePlayPause = () => {
        if (!audioRef.current)
            return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };
    const handleSeek = (timeSec) => {
        if (audioRef.current) {
            audioRef.current.currentTime = timeSec;
            setCurrentTime(timeSec);
            if (!isPlaying) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };
    const handleDeleteRecording = async (recId, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`http://localhost:5000/api/v1/recordings/${recId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                const remaining = recordings.filter(r => (r.id || r._id) !== recId);
                setRecordings(remaining);
                if (selectedRecording && ((selectedRecording.id || selectedRecording._id) === recId)) {
                    setSelectedRecording(remaining.length > 0 ? remaining[0] : null);
                    setIsPlaying(false);
                }
                fetchMeetingDetails();
            }
        }
        catch (err) {
            console.error('Failed to delete audio recording:', err);
        }
    };
    const handleRetryTranscription = async (recId, e) => {
        e.stopPropagation();
        setRetryingRecordingId(recId);
        try {
            const res = await fetch(`http://localhost:5000/api/v1/transcripts/retry/${recId}`, {
                method: 'POST'
            });
            if (res.ok) {
                await fetchMeetingDetails();
            }
        }
        catch (err) {
            console.error('Failed to retry transcription:', err);
        }
        finally {
            setRetryingRecordingId(null);
        }
    };
    const handleGenerateAISummary = async () => {
        setLoadingAI(true);
        try {
            const res = await fetch('http://localhost:5000/api/v1/summaries/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meetingId,
                    templateId: selectedTemplate,
                    rawUserNotes
                })
            });
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setSummary(json.data.summary);
                    setActionItems(json.data.actionItems || []);
                    setActiveTab('summary');
                }
            }
        }
        catch (err) {
            console.error('Failed to generate summary:', err);
        }
        finally {
            setLoadingAI(false);
        }
    };
    const handleToggleActionItem = async (itemId, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const res = await fetch(`http://localhost:5000/api/v1/summaries/action-items/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setActionItems(prev => prev.map(item => ((item.id || item._id) === itemId ? { ...item, status: newStatus } : item)));
            }
        }
        catch (err) {
            console.error('Failed to toggle action item:', err);
        }
    };
    const formatTimer = (totalSecs) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = Math.floor(totalSecs % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#090D16', overflow: 'hidden', userSelect: 'none', position: 'relative' }, children: [_jsxs("div", { style: {
                    padding: '1.25rem 2rem',
                    backgroundColor: '#0F172A',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsxs("button", { onClick: onBack, style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    backgroundColor: '#151D2F',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '8px',
                                    padding: '0.4rem 0.8rem',
                                    color: '#94A3B8',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }, children: [_jsx(ArrowLeft, { size: 16 }), "Back"] }), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx("h2", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC' }, children: meeting.title }), meeting.category && (_jsx("span", { style: {
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#1E293B',
                                                    color: '#06B6D4'
                                                }, children: meeting.category }))] }), _jsx("div", { style: { fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }, children: _jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '0.3rem' }, children: [_jsx(Clock, { size: 12 }), " ", new Date(meeting.createdAt || Date.now()).toLocaleDateString()] }) })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx("button", { onClick: (e) => onToggleStar(meetingId, meeting.isStarred, e), style: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }, children: _jsx(Star, { size: 20, color: meeting.isStarred ? '#F59E0B' : '#475569', fill: meeting.isStarred ? '#F59E0B' : 'none' }) }), _jsxs("button", { onClick: () => onOpenRecordingModalForMeeting(meetingId), style: {
                                    padding: '0.55rem 1.1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
                                }, children: [_jsx(Plus, { size: 16 }), "Add Follow-up Recording"] })] })] }), _jsxs("div", { style: { flex: 1, display: 'flex', overflow: 'hidden', paddingBottom: '70px' }, children: [_jsxs("div", { style: {
                            flex: '1.1',
                            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#090D16'
                        }, children: [_jsxs("div", { style: { padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0F172A' }, children: [_jsxs("div", { style: { fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }, children: ["Recordings Carousel (", recordings.length, ")"] }), _jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }, children: recordings.length === 0 ? (_jsx("div", { style: { fontSize: '0.85rem', color: '#64748B' }, children: "No recordings attached. Click \"+ Add Follow-up Recording\"." })) : (recordings.map((rec, idx) => {
                                            const recId = rec.id || rec._id;
                                            const isSel = selectedRecording && (selectedRecording.id || selectedRecording._id) === recId;
                                            const sttStatus = rec.sttStatus || 'completed';
                                            return (_jsxs("div", { onClick: () => setSelectedRecording(rec), style: {
                                                    padding: '0.55rem 0.9rem',
                                                    borderRadius: '10px',
                                                    backgroundColor: isSel ? '#1E293B' : '#151D2F',
                                                    border: isSel ? '1px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.08)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    color: isSel ? '#F8FAFC' : '#94A3B8'
                                                }, children: [_jsx("div", { style: {
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            backgroundColor: sttStatus === 'completed' ? '#10B981' : sttStatus === 'failed' ? '#F43F5E' : '#F59E0B'
                                                        } }), _jsxs("span", { children: ["Recording ", idx + 1] }), _jsx("span", { style: { fontSize: '0.75rem', color: '#64748B' }, children: formatTimer(rec.durationSeconds || 10) }), _jsx("button", { onClick: (e) => handleRetryTranscription(recId, e), title: "Retry Speech-to-Text Transcription", disabled: retryingRecordingId === recId, style: {
                                                            background: 'none',
                                                            border: 'none',
                                                            color: retryingRecordingId === recId ? '#06B6D4' : '#64748B',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '0.1rem 0.2rem',
                                                            marginLeft: '0.2rem'
                                                        }, children: _jsx(RefreshCw, { size: 13, className: retryingRecordingId === recId ? 'spin' : '' }) }), _jsx("button", { onClick: (e) => handleDeleteRecording(recId, e), title: "Delete Specific Speech", style: {
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#64748B',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '0.1rem 0.2rem'
                                                        }, onMouseEnter: (e) => (e.currentTarget.style.color = '#F43F5E'), onMouseLeave: (e) => (e.currentTarget.style.color = '#64748B'), children: _jsx(Trash2, { size: 13 }) })] }, recId));
                                        })) }), selectedRecording && (_jsxs("div", { style: {
                                            marginTop: '1rem',
                                            backgroundColor: '#151D2F',
                                            borderRadius: '12px',
                                            padding: '0.75rem 1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            border: '1px solid rgba(255, 255, 255, 0.06)'
                                        }, children: [_jsx("button", { onClick: handlePlayPause, style: {
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#06B6D4',
                                                    border: 'none',
                                                    color: '#FFFFFF',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }, children: isPlaying ? _jsx(Pause, { size: 18, fill: "#FFF" }) : _jsx(Play, { size: 18, fill: "#FFF" }) }), _jsxs("div", { style: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx("span", { style: { fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: '#94A3B8' }, children: formatTimer(currentTime) }), _jsx("input", { type: "range", min: 0, max: duration || 100, value: currentTime, onChange: (e) => handleSeek(parseFloat(e.target.value)), style: { flex: 1, cursor: 'pointer', accentColor: '#06B6D4' } }), _jsx("span", { style: { fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }, children: formatTimer(duration) })] }), _jsx(Volume2, { size: 16, color: "#64748B" }), _jsx("audio", { ref: audioRef, src: `http://localhost:5000/api/v1/recordings/file/${selectedRecording.filePath.split(/[/\\]/).pop()}`, onTimeUpdate: () => setCurrentTime(audioRef.current?.currentTime || 0), onLoadedMetadata: () => setDuration(audioRef.current?.duration || 0), onEnded: () => setIsPlaying(false) })] }))] }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem 1.5rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }, children: [_jsx("span", { style: { fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: "Handwritten Notes" }), _jsxs("button", { onClick: handleGenerateAISummary, disabled: loadingAI, style: {
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #06B6D4',
                                                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                                                    color: '#06B6D4',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    cursor: 'pointer'
                                                }, children: [_jsx(Sparkles, { size: 14 }), loadingAI ? 'Generating...' : 'Enhance with AI'] })] }), _jsx("textarea", { placeholder: "Type your notes here during the meeting...", value: rawUserNotes, onChange: (e) => setRawUserNotes(e.target.value), style: {
                                            flex: 1,
                                            width: '100%',
                                            backgroundColor: '#151D2F',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            color: '#F8FAFC',
                                            fontSize: '0.9rem',
                                            fontFamily: 'Inter, sans-serif',
                                            resize: 'none',
                                            outline: 'none',
                                            lineHeight: 1.6
                                        } })] })] }), _jsxs("div", { style: { flex: '1.2', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A' }, children: [_jsxs("div", { style: {
                                    padding: '0 1.5rem',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    backgroundColor: '#090D16'
                                }, children: [_jsx("button", { onClick: () => setActiveTab('summary'), style: {
                                            padding: '1rem 0',
                                            border: 'none',
                                            background: 'none',
                                            fontSize: '0.95rem',
                                            fontWeight: activeTab === 'summary' ? 600 : 400,
                                            color: activeTab === 'summary' ? '#06B6D4' : '#64748B',
                                            cursor: 'pointer',
                                            borderBottom: activeTab === 'summary' ? '2px solid #06B6D4' : '2px solid transparent'
                                        }, children: "\uD83D\uDCC4 AI Meeting Intelligence" }), _jsx("button", { onClick: () => setActiveTab('transcription'), style: {
                                            padding: '1rem 0',
                                            border: 'none',
                                            background: 'none',
                                            fontSize: '0.95rem',
                                            fontWeight: activeTab === 'transcription' ? 600 : 400,
                                            color: activeTab === 'transcription' ? '#06B6D4' : '#64748B',
                                            cursor: 'pointer',
                                            borderBottom: activeTab === 'transcription' ? '2px solid #06B6D4' : '2px solid transparent'
                                        }, children: "\uD83C\uDF99\uFE0F Merged Verbatim Transcript" })] }), _jsx("div", { style: { flex: 1, padding: '1.5rem', overflowY: 'auto' }, children: activeTab === 'summary' ? (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.25rem' }, children: [_jsxs("div", { style: {
                                                backgroundColor: '#151D2F',
                                                borderRadius: '14px',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                padding: '1.25rem 1.5rem'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A855F7', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }, children: [_jsx(FileText, { size: 18 }), "Executive Brief"] }), _jsx("p", { style: { color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6 }, children: summary?.executiveSummary || 'No summary generated yet. Click "+ Add Follow-up Recording" or "Enhance with AI" to generate structured meeting intelligence.' })] }), summary?.keyPoints && summary.keyPoints.length > 0 && (_jsxs("div", { style: {
                                                backgroundColor: '#151D2F',
                                                borderRadius: '14px',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                padding: '1.25rem 1.5rem'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }, children: [_jsx(Star, { size: 18, fill: "#F59E0B" }), "Key Discussion Points"] }), _jsx("ul", { style: { paddingLeft: '1.2rem', color: '#CBD5E1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.5 }, children: summary.keyPoints.map((point, idx) => (_jsx("li", { children: point }, idx))) })] })), summary?.decisions && summary.decisions.length > 0 && (_jsxs("div", { style: {
                                                backgroundColor: '#151D2F',
                                                borderRadius: '14px',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                padding: '1.25rem 1.5rem'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06B6D4', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }, children: [_jsx(CheckCircle, { size: 18 }), "Agreements & Decisions Reached"] }), _jsx("ul", { style: { paddingLeft: '1.2rem', color: '#CBD5E1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.5 }, children: summary.decisions.map((dec, idx) => (_jsx("li", { children: dec }, idx))) })] })), _jsxs("div", { style: {
                                                backgroundColor: '#151D2F',
                                                borderRadius: '14px',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                padding: '1.25rem 1.5rem'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }, children: [_jsx(CheckSquare, { size: 18 }), "Action Items (", actionItems.filter(a => a.status === 'completed').length, "/", actionItems.length, ")"] }), actionItems.length === 0 ? (_jsx("div", { style: { fontSize: '0.85rem', color: '#64748B' }, children: "No action items extracted." })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.6rem' }, children: actionItems.map((item) => {
                                                        const isDone = item.status === 'completed';
                                                        const itemId = item.id || item._id;
                                                        const prio = item.priority || 'Medium';
                                                        return (_jsxs("div", { onClick: () => handleToggleActionItem(itemId, item.status), style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.75rem',
                                                                padding: '0.6rem 0.75rem',
                                                                borderRadius: '8px',
                                                                backgroundColor: '#090D16',
                                                                cursor: 'pointer'
                                                            }, children: [isDone ? _jsx(CheckSquare, { size: 18, color: "#10B981" }) : _jsx(Square, { size: 18, color: "#64748B" }), _jsx("span", { style: {
                                                                        flex: 1,
                                                                        fontSize: '0.85rem',
                                                                        color: isDone ? '#64748B' : '#F8FAFC',
                                                                        textDecoration: isDone ? 'line-through' : 'none'
                                                                    }, children: item.taskDescription }), _jsx("span", { style: {
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 600,
                                                                        padding: '0.15rem 0.45rem',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: prio === 'High' ? 'rgba(244, 63, 94, 0.15)' : prio === 'Low' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                                        color: prio === 'High' ? '#F43F5E' : prio === 'Low' ? '#06B6D4' : '#F59E0B'
                                                                    }, children: prio }), item.assignee && (_jsx("span", { style: { fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#1E293B', color: '#94A3B8' }, children: item.assignee }))] }, itemId));
                                                    }) }))] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }, children: [summary?.risks && summary.risks.length > 0 && (_jsxs("div", { style: {
                                                        backgroundColor: '#151D2F',
                                                        borderRadius: '14px',
                                                        border: '1px solid rgba(244, 63, 94, 0.2)',
                                                        padding: '1rem 1.25rem'
                                                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F43F5E', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }, children: [_jsx(AlertTriangle, { size: 16 }), " Risks & Dependencies"] }), _jsx("ul", { style: { paddingLeft: '1rem', color: '#CBD5E1', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }, children: summary.risks.map((r, idx) => (_jsx("li", { children: r }, idx))) })] })), summary?.questions && summary.questions.length > 0 && (_jsxs("div", { style: {
                                                        backgroundColor: '#151D2F',
                                                        borderRadius: '14px',
                                                        border: '1px solid rgba(245, 158, 11, 0.2)',
                                                        padding: '1rem 1.25rem'
                                                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }, children: [_jsx(HelpCircle, { size: 16 }), " Unresolved Questions"] }), _jsx("ul", { style: { paddingLeft: '1rem', color: '#CBD5E1', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }, children: summary.questions.map((q, idx) => (_jsx("li", { children: q }, idx))) })] }))] }), summary?.nextSteps && summary.nextSteps.length > 0 && (_jsxs("div", { style: {
                                                backgroundColor: '#151D2F',
                                                borderRadius: '14px',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                padding: '1.25rem 1.5rem'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3B82F6', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }, children: [_jsx(ArrowRight, { size: 18 }), "Immediate Next Steps"] }), _jsx("ul", { style: { paddingLeft: '1.2rem', color: '#CBD5E1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }, children: summary.nextSteps.map((ns, idx) => (_jsx("li", { children: ns }, idx))) })] }))] })) : (
                                /* Merged Verbatim Transcription View */
                                _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: !transcript || !transcript.segments || transcript.segments.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: '#64748B', fontSize: '0.9rem' }, children: "No transcript generated yet for this meeting." })) : (transcript.segments.map((seg, idx) => (_jsxs("div", { onClick: () => handleSeek(seg.startTime), style: {
                                            backgroundColor: '#151D2F',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.06)',
                                            padding: '1rem 1.25rem',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.15s ease'
                                        }, onMouseEnter: (e) => (e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)'), onMouseLeave: (e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'), children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }, children: [_jsx("span", { style: { fontSize: '0.8rem', fontWeight: 600, color: '#06B6D4' }, children: seg.speakerLabel || `Speaker ${idx + 1}` }), _jsxs("span", { style: { fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }, children: [formatTimer(seg.startTime), " - ", formatTimer(seg.endTime)] })] }), _jsx("p", { style: { color: '#E2E8F0', fontSize: '0.88rem', lineHeight: 1.5 }, children: seg.content })] }, seg.id || idx)))) })) })] })] }), _jsx("div", { style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '64px',
                    backgroundColor: '#0F172A',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2rem',
                    zIndex: 100
                }, children: _jsxs("button", { onClick: () => onOpenRecordingModalForMeeting(meetingId), style: {
                        padding: '0.65rem 2rem',
                        borderRadius: '24px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)'
                    }, children: [_jsx(Mic, { size: 18, fill: "#FFFFFF" }), "Start Recording into Current Meeting"] }) })] }));
};
