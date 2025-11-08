// src/pages/InstructorDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/Authcontext';
import { Link, useNavigate } from 'react-router-dom';

export default function InstructorDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all courses and filter by instructor id
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/courses')
      .then(res => {
        const all = res.data.data || [];
        const mine = all.filter(c => c.instructor && c.instructor.id === user.id);
        setCourses(mine);
      })
      .catch(err => {
        console.error('fetch courses failed', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="p-6">Please login as instructor.</div>;
  if (user.role !== 'instructor') return <div className="p-6">You are not an instructor.</div>;

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Instructor Dashboard</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded" onClick={() => navigate('/create-course')}>Create Course</button>
          <Link to="/courses" className="px-4 py-2 text-white bg-blue-600 rounded">View All Courses</Link>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {courses.length === 0 ? (
            <div className="p-6 bg-white rounded shadow">You have no published courses yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {courses.map(course => (
                <div key={course.id} className="flex items-start gap-4 p-4 bg-white rounded shadow">
                  <img src={course.thumbnail_url || '/placeholder.png'} alt={course.title} className="object-cover h-20 rounded w-28" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.description?.slice(0,140)}</p>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/courses/${course.id}`} className="px-3 py-1 text-sm border rounded">View</Link>
                      <Link to={`/courses/${course.id}/create-lesson`} className="px-3 py-1 text-sm text-white bg-green-600 rounded">Add Lesson</Link>
                      <Link to={`/courses/${course.id}/edit`} className="px-3 py-1 text-sm border rounded">Edit</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
