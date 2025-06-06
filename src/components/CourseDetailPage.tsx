import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

interface Comment {
  username: string;
  comment_text: string;
  _id: string;
}

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  estimatedDuration: string; // derived from estimated_total_duration_hours
  totalStudyTime: string; // placeholder or computed if available
  targetStudyTime: string; // derived from estimated_total_duration_hours
  progress: number; // placeholder or computed if available
  comments: Comment[];
}

interface CourseDetailPageProps {
  userRole: 'admin' | 'user' | null;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ userRole }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isEditingCourse, setIsEditingCourse] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedEstimatedDuration, setEditedEstimatedDuration] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isNewCourse, setIsNewCourse] = useState<boolean>(false);


  useEffect(() => {
    if (!courseId) {
      navigate('/app/home');
      return;
    }
    if (courseId === 'new') {
      setIsNewCourse(true);
      const newCourseData: CourseDetail = {
        _id: '',
        title: '',
        description: '',
        estimatedDuration: '~ 0 giờ',
        totalStudyTime: '00:00:00',
        targetStudyTime: '0 giờ mục tiêu',
        progress: 0,
        comments: [],
      };
      setCourse(newCourseData);
      setEditedTitle('');
      setEditedDescription('');
      setEditedEstimatedDuration(newCourseData.estimatedDuration);
      setIsEditingCourse(true);
      setHasUnsavedChanges(false);
    } else {
      setIsNewCourse(false);
      apiClient.get(`/courses/${courseId}`)
        .then(async res => {
          const c = res.data;
          // Map backend fields to frontend fields
          const estimatedDuration = c.estimated_total_duration_hours ? `~ ${c.estimated_total_duration_hours} giờ` : '~ 0 giờ';
          const targetStudyTime = c.estimated_total_duration_hours ? `${c.estimated_total_duration_hours} giờ mục tiêu` : '0 giờ mục tiêu';
          // Fetch comments for this course
          let comments: Comment[] = [];
          try {
            const commentsRes = await apiClient.get(`/courses/${c._id}/comments`);
            comments = commentsRes.data;
          } catch {}
          setCourse({
            _id: c._id,
            title: c.title,
            description: c.description || '',
            estimatedDuration,
            totalStudyTime: c.totalStudyTime || '00:00:00', // fallback if not present
            targetStudyTime,
            progress: c.progress || 0, // fallback if not present
            comments,
          });
          setEditedTitle(c.title);
          setEditedDescription(c.description || '');
          setEditedEstimatedDuration(estimatedDuration);
          setIsEditingCourse(false);
          setHasUnsavedChanges(false);
        })
        .catch(() => {
          alert(`Không tìm thấy khóa học với ID: ${courseId}. Đang điều hướng về trang chủ.`);
          navigate('/app/home');
        });
    }
  }, [courseId, navigate]);

  useEffect(() => {
    // Effect này để tự động lưu course vào allCourses khi course state thay đổi (ví dụ: khi thêm comment)
    // Chỉ thực hiện khi không phải là khóa học mới và không trong chế độ chỉnh sửa
    if (course && course._id && !isNewCourse && !isEditingCourse) {
      let allCourses: CourseDetail[] = [];
      try {
        const storedCourses = localStorage.getItem('allCourses');
        if (storedCourses) {
          allCourses = JSON.parse(storedCourses);
        }
      } catch (e) {
        console.error("Failed to parse 'allCourses' for saving individual course update.", e);
        allCourses = [];
      }

      const courseExists = allCourses.some(c => c._id === course._id);
      let updatedAllCourses;

      if (courseExists) {
        updatedAllCourses = allCourses.map(c =>
          c._id === course._id ? course : c
        );
      } else {
        // Trường hợp này không nên xảy ra nếu logic load và save ban đầu đúng
        console.warn("Course to update (e.g., after adding comment) was not found in allCourses array.");
        return; // Không làm gì nếu không tìm thấy khóa học để cập nhật
      }
      localStorage.setItem('allCourses', JSON.stringify(updatedAllCourses));
    }
  }, [course, isNewCourse, isEditingCourse]);


  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let titleChanged = editedTitle !== (course?.title ?? '');
    let descriptionChanged = editedDescription !== (course?.description ?? '');
    let durationChanged = editedEstimatedDuration !== (course?.estimatedDuration ?? '');

    if (name === "editedTitle") {
        setEditedTitle(value);
        titleChanged = value !== (course?.title ?? '');
    } else if (name === "editedDescription") {
        setEditedDescription(value);
        descriptionChanged = value !== (course?.description ?? '');
    } else if (name === "editedEstimatedDuration") {
        setEditedEstimatedDuration(value);
        durationChanged = value !== (course?.estimatedDuration ?? '');
    }

    if (isNewCourse) {
        // Đối với khóa học mới, bất kỳ thay đổi nào so với giá trị rỗng/mặc định đều được coi là thay đổi
        // Hoặc đơn giản là chỉ cần tiêu đề không rỗng để có thể tạo
        setHasUnsavedChanges(
            (name === "editedTitle" && value.trim() !== '') || // Luôn cần tiêu đề cho khóa mới
            (name === "editedDescription" && value !== '') ||
            (name === "editedEstimatedDuration" && value !== '~ 0 giờ') ||
            (editedTitle.trim() !== '') // Đảm bảo nếu các trường khác thay đổi, nút lưu vẫn active nếu title đã có
        );
    } else if (course) {
        // Đối với khóa học hiện có, so sánh với giá trị gốc của khóa học
        // Cần đảm bảo rằng state hiện tại (editedTitle, etc.) được dùng để so sánh chính xác
        const currentTitle = name === "editedTitle" ? value : editedTitle;
        const currentDescription = name === "editedDescription" ? value : editedDescription;
        const currentDuration = name === "editedEstimatedDuration" ? value : editedEstimatedDuration;

        setHasUnsavedChanges(
            currentTitle !== course.title ||
            currentDescription !== course.description ||
            currentDuration !== course.estimatedDuration
        );
    }
  }, [course, editedTitle, editedDescription, editedEstimatedDuration, isNewCourse]);


  const handleAddComment = async () => {
    if (!newCommentText.trim() || !course) return;
    try {
      const username = localStorage.getItem('username') || 'Người dùng';
      await apiClient.post(`/courses/${course._id}/comments`, { username, comment_text: newCommentText });
      // Refetch comments
      const commentsRes = await apiClient.get(`/courses/${course._id}/comments`);
      setCourse({ ...course, comments: commentsRes.data });
      setNewCommentText('');
    } catch {
      alert('Gửi bình luận thất bại.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (userRole !== 'admin' || !course) {
      alert('Bạn không có quyền xóa bình luận này.');
      return;
    }
    try {
      await apiClient.delete(`/comments/${commentId}`);
      // Refetch comments
      const commentsRes = await apiClient.get(`/courses/${course._id}/comments`);
      setCourse({ ...course, comments: commentsRes.data });
    } catch {
      alert('Xóa bình luận thất bại.');
    }
  };

  const handleToggleEditMode = () => {
    if (userRole !== 'admin' && !isNewCourse) {
      alert("Bạn không có quyền chỉnh sửa.");
      return;
    }
    
    const aboutToEnterEditMode = !isEditingCourse;
    setIsEditingCourse(aboutToEnterEditMode);

    if (aboutToEnterEditMode) { // Đang từ view -> edit
        if (course) {
            // Đảm bảo các trường chỉnh sửa được đồng bộ với trạng thái course hiện tại
            setEditedTitle(course.title);
            setEditedDescription(course.description);
            setEditedEstimatedDuration(course.estimatedDuration);
            setHasUnsavedChanges(false); // Reset khi bắt đầu chỉnh sửa
        }
    } else { // Đang từ edit -> view (Cancel)
      if (isNewCourse) {
        navigate('/app/home'); // Nếu hủy tạo khóa học mới, quay về home
      } else if (course) {
        // Reset các trường về giá trị gốc của khóa học nếu hủy chỉnh sửa
        setEditedTitle(course.title);
        setEditedDescription(course.description);
        setEditedEstimatedDuration(course.estimatedDuration);
        setHasUnsavedChanges(false);
      }
    }
  };

  const handleSaveCourse = async () => {
    if (userRole !== 'admin' || !course) {
      alert('Bạn không có quyền lưu thay đổi.');
      return;
    }
    if (!isNewCourse && !hasUnsavedChanges) {
      alert('Không có thay đổi nào để lưu.');
      return;
    }
    if (isNewCourse && !editedTitle.trim()) {
      alert('Tiêu đề khóa học không được để trống khi tạo mới.');
      return;
    }
    // Parse estimated hours from editedEstimatedDuration
    const durationMatch = editedEstimatedDuration.match(/\d+/);
    const estimated_total_duration_hours = durationMatch ? parseInt(durationMatch[0], 10) : 0;
    const targetStudyTime = estimated_total_duration_hours ? `${estimated_total_duration_hours} giờ mục tiêu` : '0 giờ mục tiêu';
    const estimatedDuration = estimated_total_duration_hours ? `~ ${estimated_total_duration_hours} giờ` : '~ 0 giờ';
    const courseDataToSave = {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      estimated_total_duration_hours,
      // Add other fields as needed
    };
    try {
      let savedCourse;
      if (isNewCourse) {
        const res = await apiClient.post('/courses', courseDataToSave);
        savedCourse = res.data;
        navigate(`/app/course/${savedCourse._id}`, { replace: true });
      } else {
        const res = await apiClient.put(`/courses/${course._id}`, courseDataToSave);
        savedCourse = res.data.data || res.data; // .data if wrapped
      }
      // Refetch comments for the saved course
      let comments: Comment[] = [];
      try {
        const commentsRes = await apiClient.get(`/courses/${savedCourse._id}/comments`);
        comments = commentsRes.data;
      } catch {}
      setCourse({
        _id: savedCourse._id,
        title: savedCourse.title,
        description: savedCourse.description || '',
        estimatedDuration,
        totalStudyTime: savedCourse.totalStudyTime || '00:00:00',
        targetStudyTime,
        progress: savedCourse.progress || 0,
        comments,
      });
      setIsNewCourse(false);
      setIsEditingCourse(false);
      setHasUnsavedChanges(false);
    } catch {
      alert('Lưu khóa học thất bại.');
    }
  };

  const handleDeleteCourse = async () => {
    if (userRole !== 'admin' || !course || isNewCourse) {
      alert('Bạn không có quyền xóa khóa học này.');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}" này không?`)) {
      try {
        await apiClient.delete(`/courses/${course._id}`);
        alert(`Khóa học "${course.title}" đã được xóa.`);
        navigate('/app/home');
      } catch {
        alert('Xóa khóa học thất bại.');
      }
    }
  };

  const handleBackNavigation = () => {
    if (isEditingCourse && hasUnsavedChanges) {
        if (window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?")) {
            if (isNewCourse) navigate('/app/home'); // Nếu là khóa mới và hủy, về home
            else navigate(-1); // Nếu là khóa cũ, quay lại
        }
    } else if (isNewCourse && !isEditingCourse) { 
        // Trường hợp này là khi new course được tạo (isEditingCourse=true), sau đó bấm cancel (isEditingCourse=false),
        // handleToggleEditMode đã navigate về home. Nếu người dùng cố back lại trang /new thì về home.
      navigate('/app/home');
    }
     else {
      navigate(-1);
    }
  };


  if (!course) {
    return <div>Đang tải chi tiết khóa học...</div>;
  }

  const canSaveChanges = isNewCourse ? (editedTitle.trim() !== '') : hasUnsavedChanges;
  const headerButtonText = isNewCourse ? 'Tạo khóa học' : (isEditingCourse ? 'Lưu thay đổi' : 'Chỉnh sửa');
  const headerButtonAction = isNewCourse || isEditingCourse ? handleSaveCourse : handleToggleEditMode;
  // Nút "Lưu" hoặc "Tạo khóa học" chỉ active khi có thay đổi (cho khóa cũ) hoặc tiêu đề không rỗng (cho khóa mới)
  const headerButtonDisabled = (isEditingCourse || isNewCourse) && !canSaveChanges;


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--gray-200, #e5e7eb)' }}>
        <button onClick={handleBackNavigation} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '15px', color: 'var(--gray-700, #374151)' }}>
          &lt;
        </button>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--gray-800, #1f2937)', flexGrow: 1 }}>
          {isEditingCourse && isNewCourse ? 'Tạo khóa học mới' : (isEditingCourse && editedTitle ? editedTitle : course.title)}
        </h2>
        {userRole === 'admin' && (
          <>
            <button
              onClick={headerButtonAction}
              disabled={headerButtonDisabled}
              style={{
                background: headerButtonDisabled ? 'var(--gray-400, #9ca3af)' : 'var(--primary-green, #10b981)',
                color: 'white',
                padding: '8px 15px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: headerButtonDisabled ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease',
              }}
            >
              {headerButtonText}
            </button>
            {isEditingCourse && ( // Luôn hiển thị nút Hủy khi đang ở chế độ chỉnh sửa (cả mới và cũ)
                 <button
                    onClick={handleToggleEditMode} // Sẽ xử lý navigate cho new course hoặc reset field cho existing
                    style={{
                        background: 'var(--gray-500, #6b7280)',
                        color: 'white',
                        padding: '8px 15px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        transition: 'background 0.3s ease',
                    }}
                >
                    Hủy
                </button>
            )}
            {!isNewCourse && !isEditingCourse && ( // Chỉ hiển thị Xóa khi xem khóa học đã tồn tại
              <button
                onClick={handleDeleteCourse}
                style={{
                  background: 'var(--accent-red, #ef4444)',
                  color: 'white',
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginLeft: '10px',
                  transition: 'background 0.3s ease',
                }}
              >
                Xóa khóa học
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--gray-900, #111827)', marginBottom: '8px' }}>
          {isEditingCourse && userRole === 'admin' ? (
            <input
              type="text"
              name="editedTitle"
              value={editedTitle}
              onChange={handleFieldChange}
              placeholder="Tiêu đề khóa học"
              style={{ width: '100%', padding: '8px', fontSize: '24px', fontWeight: '700', border: '1px solid var(--gray-300)', borderRadius: '6px', marginBottom: '10px' }}
            />
          ) : (
            course.title
          )}
        </h1>
        {!isEditingCourse && (
             <button
                style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: 'var(--primary-green, #10b981)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                    transition: 'background 0.3s ease',
                }}
            >
                ▶️ BẮT ĐẦU HỌC
            </button>
        )}
      </div>

      {/* Estimated Duration Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>🕒</span>
          {isEditingCourse && userRole === 'admin' ? (
            <input
              type="text"
              name="editedEstimatedDuration"
              value={editedEstimatedDuration}
              onChange={handleFieldChange}
              placeholder="VD: ~ 10 giờ hoặc 15 giờ"
              style={{ flexGrow: 1, padding: '8px', fontSize: '16px', border: '1px solid var(--gray-300)', borderRadius: '6px' }}
            />
          ) : (
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800, #1f2937)' }}>
                Thời lượng dự kiến: {course.estimatedDuration || (isNewCourse ? "~ 0 giờ" : "Chưa có thông tin")}
            </h3>
          )}
        </div>
      </div>


      {/* Chỉ hiển thị tiến độ nếu không phải khóa học mới và không trong chế độ chỉnh sửa */}
      {!(isNewCourse && isEditingCourse) && !isEditingCourse && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800, #1f2937)', marginBottom: '12px' }}>Tiến độ của bạn</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            {/* Hiển thị course.targetStudyTime đã được cập nhật */}
            <span style={{ fontSize: '14px', color: 'var(--gray-600, #4b5563)' }}>Tổng thời gian đã học: {course.totalStudyTime} / {course.targetStudyTime}</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary-green, #10b981)' }}>{course.progress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200, #e5e7eb)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: 'var(--primary-green, #10b981)', borderRadius: '4px' }} />
          </div>
        </div>
      )}


      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800, #1f2937)', marginBottom: '12px' }}>
          Mô tả khóa học
        </h3>
        {isEditingCourse && userRole === 'admin' ? (
          <div>
            <textarea
              name="editedDescription"
              value={editedDescription}
              onChange={handleFieldChange}
              placeholder="Mô tả khóa học"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--gray-300, #d1d5db)',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--gray-700, #374151)', whiteSpace: 'pre-line' }}>
            {course.description || (isNewCourse && isEditingCourse ? "Điền mô tả cho khóa học mới..." : "Chưa có mô tả.")}
            </p>
        )}
      </div>

      {/* Chỉ hiển thị bình luận nếu không phải khóa học mới và không trong chế độ chỉnh sửa */}
      {!(isNewCourse && isEditingCourse) && !isEditingCourse && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray-800, #1f2937)', marginBottom: '12px' }}>Bình luận ({course.comments.length})</h3>
          {course.comments.map((comment) => (
            <div key={comment._id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', borderBottom: '1px solid var(--gray-100, #f3f4f6)', paddingBottom: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--gray-300, #d1d5db)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginRight: '12px', flexShrink: 0 }}>
                👤
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray-800, #1f2937)', marginBottom: '4px' }}>{comment.username}</p>
                <p style={{ fontSize: '14px', color: 'var(--gray-700, #374151)' }}>{comment.comment_text}</p>
              </div>
              {userRole === 'admin' && (
                <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-red, #ef4444)', fontSize: '14px', cursor: 'pointer', marginLeft: '10px', fontWeight: '500' }}>
                  Xóa
                </button>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              style={{ flexGrow: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--gray-300, #d1d5db)', fontSize: '14px' }}
            />
            <button onClick={handleAddComment} style={{ padding: '10px 20px', backgroundColor: 'var(--primary-green, #10b981)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.3s ease' }}>
              Gửi
            </button>
          </div>
        </div>
      )}
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default CourseDetailPage;