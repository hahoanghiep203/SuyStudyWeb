import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

// --- Calendar component (inlined) ---
interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}
const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  // ...existing code from Calendar.tsx...
  // ...Calendar logic...
  const currentDate = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth - 1);
    onDateSelect(newDate);
  };
  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + 1);
    onDateSelect(newDate);
  };
  const selectDate = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  };
  const isToday = (day: number) => {
    return currentDate.getDate() === day && 
           currentDate.getMonth() === currentMonth && 
           currentDate.getFullYear() === currentYear;
  };
  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth && 
           selectedDate.getFullYear() === currentYear;
  };
  const hasEvent = (day: number) => {
    // Mock data - some days have events
    return [8, 15, 22, 28].includes(day);
  };
  return (
    <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
      {/* ...existing Calendar JSX... */}
      {/* ...existing code from Calendar.tsx... */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button onClick={prevMonth} className="btn btn-ghost" style={{ padding: '8px' }}>←</button>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-800)' }}>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth} className="btn btn-ghost" style={{ padding: '8px' }}>→</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {dayNames.map((day) => (
          <div key={day} style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: 'var(--gray-500)' }}>{day}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {Array.from({ length: firstDayOfMonth }, (_, i) => (<div key={`empty-${i}`} />))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              style={{
                padding: '12px 8px',
                border: 'none',
                borderRadius: '8px',
                background: isSelected(day) 
                  ? 'var(--primary-green)' 
                  : isToday(day) 
                  ? 'var(--primary-green-light)' 
                  : 'transparent',
                color: isSelected(day) || isToday(day) 
                  ? 'white' 
                  : 'var(--gray-700)',
                fontSize: '14px',
                fontWeight: isSelected(day) ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isSelected(day) && !isToday(day)) {
                  e.currentTarget.style.background = 'var(--gray-100)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected(day) && !isToday(day)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {day}
              {hasEvent(day) && (
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: isSelected(day) || isToday(day) 
                    ? 'white' 
                    : 'var(--accent-orange)'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Timeline component (inlined) ---
interface TimelineEvent {
  title: string;
  color: string;
  duration: number;
  pattern?: string;
}
interface TimeSlot {
  time: string;
  events: TimelineEvent[];
}
const Timeline: React.FC<{ selectedDate: Date }> = ({ selectedDate }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  useEffect(() => {
    apiClient.get('/schedules/me', { params: { date: selectedDate.toISOString() } })
      .then(res => setTimeSlots(res.data))
      .catch(() => setTimeSlots([]));
  }, [selectedDate]);
  const getEventIcon = (title: string) => {
    if (title.includes('Yoga')) return '🧘‍♀️';
    if (title.includes('Web')) return '💻';
    if (title.includes('English')) return '🗣️';
    if (title.includes('Data')) return '📊';
    return '📚';
  };
  return (
    <div className="card" style={{ padding: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '4px' }}>
        Timeline - {selectedDate.toLocaleDateString('vi-VN')}
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginBottom: '20px' }}>
        Lịch trình chi tiết trong ngày
      </p>
      {timeSlots.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px 0' }}>
          Không có lịch trình nào cho ngày này.
        </p>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '32px', top: '0', bottom: '0', width: '2px', background: 'var(--gray-200)' }} />
          {timeSlots.map((slot) => (
            <div key={slot.time} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
              <div style={{ width: '64px', fontSize: '14px', fontWeight: '500', color: 'var(--gray-600)', paddingTop: '4px', textAlign: 'right', paddingRight: '8px' }}>{slot.time}</div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: slot.events.length > 0 ? 'var(--primary-green)' : 'var(--gray-300)', marginTop: '8px', zIndex: 1, position: 'relative' }} />
              <div style={{ flex: 1, marginLeft: '16px' }}>
                {slot.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="card" style={{ padding: '16px', marginBottom: '8px', background: event.pattern === 'striped' ? `repeating-linear-gradient(45deg, ${event.color}10, ${event.color}10 8px, ${event.color}20 8px, ${event.color}20 16px)` : `${event.color}10`, borderLeft: `4px solid ${event.color}`, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: event.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'white' }}>{getEventIcon(event.title)}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '4px' }}>{event.title}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{event.duration} phút</p>
                      </div>
                      <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px', color: event.color }}>Chi tiết</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="animate-fadeIn">
      {/* ...existing header and warning ... */}
      <div className="container" style={{ padding: '20px' }}>
        {/* ...existing warning ... */}
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        <Timeline selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default CalendarPage;
