// src/components/CourseList.js

import React, { useEffect, useState } from 'react';
import CourseService from '../services/course.service'; // Import service

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    CourseService.getAllCourses()
      .then(response => {
        setCourses(response.data);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Our Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course._id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;