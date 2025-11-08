// src/pages/Courses.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function CourseCard({ course, progress }) {
  return (
    <div className="p-4 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl">
      <img src={course.thumbnail_url || '/placeholder.png'} alt={course.title} className="object-cover w-full h-40 mb-3 rounded" />
      <h3 className="font-semibold">{course.title}</h3>
      <p className="mb-3 text-sm text-gray-500">{course.description?.slice(0, 120)}</p>

      {progress != null && (
        <div className="h-2 mt-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-600 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <Link to={`/courses/${course.id}`} className="text-blue-600">View</Link>
        <span className="text-sm font-medium">{course.price > 0 ? `₹${course.price}` : 'Free'}</span>
      </div>
    </div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));

    api.get('/my-progress')
      .then(res => setProgressMap(res.data || {}))
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto">
      <h2 className="mb-6 text-2xl font-semibold">All courses</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {courses.map(c => (
          <CourseCard key={c.id} course={c} progress={progressMap[c.id] || 0} />
        ))}
      </div>
    </div>
  );
}
