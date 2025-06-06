import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';


// --- Header (inlined) ---
const Header = ({ username }: { username: string }) => {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  return (
    <header style={{
      background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-light) 100%)',
      color: 'white',
      padding: '24px 20px',
      borderRadius: '0 0 24px 24px',
      marginBottom: '20px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{greeting}, {username}!</h1>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Hôm nay bạn muốn học gì?</p>
          </div>
          <div style={{ position: 'relative', padding: '8px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
    </header>
  );
};


// --- TodaySchedule (inlined) ---
interface TodayEvent {
  id: number;
  title: string;
  time: string;
  color: string;
  status: string;
}
const TodaySchedule: React.FC = () => {
  const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([]);
  useEffect(() => {
    apiClient.get('/schedules/me')
      .then(res => setTodayEvents(res.data))
      .catch(() => setTodayEvents([]));
  }, []);
  const getEventIcon = (title: string) => {
    if (title.includes('Yoga')) return '🧘‍♀️';
    if (title.includes('Web')) return '💻';
    if (title.includes('English')) return '🗣️';
    return '🗓️';
  };
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800)' }}>
          Lịch hôm nay - {new Date().toLocaleDateString('vi-VN')}
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '4px 8px', borderRadius: '6px' }}>
          {todayEvents.length} sự kiện
        </span>
      </div>
      {todayEvents.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px 0' }}>
          Không có sự kiện nào cho hôm nay.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {todayEvents.map((event) => (
            <div key={event.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'var(--gray-50, #f9fafb)', borderRadius: '8px', borderLeft: `4px solid ${event.color}` }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: event.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '16px', color: 'white' }}>{getEventIcon(event.title)}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '2px' }}>{event.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{event.time}</p>
              </div>
              <div style={{ padding: '4px 8px', background: `${event.color}20`, borderRadius: '6px', fontSize: '12px', fontWeight: '500', color: event.color }}>
                Sắp tới
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- CourseCard (inlined) ---
interface Course {
  _id: string; // MongoDB ObjectId
  title: string;
  progress: number;
  color: string;
  nextSession: string;
  icon: string;
  description: string;
  totalStudyTime: string;
  estimatedDuration: string;
}
interface CourseCardProps {
  course: Course;
  onStartLearning: (courseId: string) => void;
}
const CourseCard: React.FC<CourseCardProps> = ({ course, onStartLearning }) => {
  return (
    <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--gray-200, #e5e7eb)', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: `linear-gradient(135deg, ${course.color}, ${course.color}80)`, borderRadius: '0 0 0 60px', opacity: 0.1 }} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${course.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '12px', flexShrink: 0 }}>{course.icon}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800, #1f2937)', marginBottom: '4px' }}>{course.title}</h3>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gray-700, #374151)', marginBottom: '8px' }}>Mô tả khóa học</p>
        <p style={{ fontSize: '14px', color: 'var(--gray-600, #4b5563)' }}>{course.description}</p>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gray-700)' }}>Tiến độ</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: course.color }}>{course.progress}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--gray-200, #e5e7eb)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${course.progress}%`, height: '100%', background: `linear-gradient(90deg, ${course.color}, ${course.color}80)`, borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => onStartLearning(course._id)} style={{ width: '100%', fontSize: '16px', padding: '12px 20px', borderRadius: '8px', background: 'var(--primary-green, #10b981)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)', transition: 'background 0.3s ease' }}>
        BẮT ĐẦU HỌC
      </button>
    </div>
  );
};

const HomePage: React.FC<{ userRole?: 'admin' | 'user' | null }> = ({ userRole }) => {
  const navigate = useNavigate();
  const [currentCourses, setCurrentCourses] = useState<any[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch courses from backend
    apiClient.get('/courses')
      .then(res => setCurrentCourses(res.data))
      .catch(() => setCurrentCourses([]));
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleStartLearning = (courseId: string) => {
    navigate(`/app/course/${courseId}`);
  };

  const handleAddNewCourse = () => {
    navigate('/app/course/new');
  };

  return (
    <div className="animate-fadeIn">
      <Header username={username} />
      <div className="container" style={{ padding: '20px' }}>
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--gray-800)' }}>Lịch hôm nay</h2>
          <TodaySchedule />
        </section>
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--gray-800)' }}>Khóa học của bạn</h2>
          {currentCourses.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', padding: '20px 0' }}>
              Bạn chưa có khóa học nào. Hãy bắt đầu bằng cách thêm một khóa học mới!
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {currentCourses.map((course) => (
                <CourseCard key={course._id} course={course} onStartLearning={handleStartLearning} />
              ))}
            </div>
          )}
          {userRole === 'admin' && (
            <div onClick={handleAddNewCourse} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', borderRadius: '12px', border: '2px dashed var(--gray-300, #d1d5db)', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', minHeight: '200px', marginTop: currentCourses.length > 0 ? '16px' : '0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-green, #10b981)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--gray-300, #d1d5db)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-green-light, #e6f7f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', fontSize: '36px', color: 'var(--primary-green, #10b981)', fontWeight: 'lighter' }}>+</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-700, #374151)' }}>Thêm Khóa học mới</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;