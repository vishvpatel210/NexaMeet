import React, { useState } from 'react';
import { IMeeting } from '@shared/types/index';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Mic, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';

interface CalendarViewProps {
  meetings: IMeeting[];
  onRefresh: () => void;
  onRecordForMeeting: (meeting: IMeeting) => void;
  onSelectMeeting: (meeting: IMeeting) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  meetings,
  onRefresh,
  onRecordForMeeting,
  onSelectMeeting
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);

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
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Filter meetings for selected date
  const selectedDateMeetings = meetings.filter((m) => {
    const meetingDate = m.scheduledStart ? new Date(m.scheduledStart) : new Date(m.createdAt || Date.now());
    return isSameDay(meetingDate, selectedDate);
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const [hours, minutes] = taskTime.split(':').map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours || 12, minutes || 0, 0, 0);

    await ApiService.createMeeting({
      title: taskTitle,
      category: taskCategory,
      scheduledStart: scheduledDate.toISOString(),
      status: 'scheduled'
    } as any);

    setTaskTitle('');
    setIsTaskModalOpen(false);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%', userSelect: 'none' }}>
      {/* Left Month Calendar Grid */}
      <div style={{
        flex: 1.4,
        backgroundColor: '#151D2F',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Month Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarIcon size={22} color="#06B6D4" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC' }}>
              {monthNames[month]} {year}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={prevMonth}
              style={{
                backgroundColor: '#090D16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.4rem 0.6rem',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              style={{
                backgroundColor: '#090D16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.4rem 0.6rem',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', flex: 1 }}>
          {/* Empty lead padding days */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(year, month, dayNum);
            const isSelected = isSameDay(dateObj, selectedDate);
            const isToday = isSameDay(dateObj, new Date());

            // Check if day has meetings
            const dayMeetings = meetings.filter((m) => {
              const md = m.scheduledStart ? new Date(m.scheduledStart) : new Date(m.createdAt || Date.now());
              return isSameDay(md, dateObj);
            });

            return (
              <div
                key={dayNum}
                onClick={() => setSelectedDate(dateObj)}
                style={{
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
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: isToday || isSelected ? 700 : 500,
                    color: isSelected ? '#06B6D4' : isToday ? '#10B981' : '#F8FAFC'
                  }}>
                    {dayNum}
                  </span>
                  {dayMeetings.length > 0 && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#06B6D4'
                    }} />
                  )}
                </div>

                {dayMeetings.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dayMeetings.slice(0, 2).map((m, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: '#1E293B',
                          color: '#94A3B8',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {m.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <span style={{ fontSize: '0.65rem', color: '#64748B' }}>+{dayMeetings.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Task Details & Schedule Panel */}
      <div style={{
        flex: 1,
        backgroundColor: '#151D2F',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Selected Date Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Scheduled Tasks
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.2rem' }}>
              {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            style={{
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
            }}
          >
            <Plus size={16} />
            Schedule Task
          </button>
        </div>

        {/* Task List for Selected Date */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {selectedDateMeetings.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
              No tasks scheduled for this date. Click "+ Schedule Task" above to add a meeting or discussion item.
            </div>
          ) : (
            selectedDateMeetings.map((task) => {
              const taskId = task.id || (task as any)._id;
              const startTime = task.scheduledStart
                ? new Date(task.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '14:00';

              return (
                <div
                  key={taskId}
                  style={{
                    backgroundColor: '#090D16',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#06B6D4', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {startTime}
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#1E293B', color: '#94A3B8' }}>
                        {task.category || 'Work'}
                      </span>
                    </div>

                    {task.status === 'completed' ? (
                      <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Summarized
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 500 }}>● Scheduled</span>
                    )}
                  </div>

                  <h4
                    onClick={() => onSelectMeeting(task)}
                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 600, color: '#F8FAFC', cursor: 'pointer' }}
                  >
                    {task.title}
                  </h4>

                  {/* Instant Record & Summarize CTA Button */}
                  <button
                    onClick={() => onRecordForMeeting(task)}
                    style={{
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
                    }}
                  >
                    <Mic size={16} color="#F43F5E" />
                    Record Speech & Summarize
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200
        }}>
          <div style={{
            width: '420px',
            backgroundColor: '#151D2F',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sparkles size={20} color="#06B6D4" />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
                Schedule Task for {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </h3>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Task / Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architecture Sprint Review"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    backgroundColor: '#090D16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Time
                </label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    backgroundColor: '#090D16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Category
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    backgroundColor: '#090D16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Important">Important</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'transparent',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
