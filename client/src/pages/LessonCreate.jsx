// src/pages/LessonCreate.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LessonCreate() {
  const { id: courseId } = useParams(); // expects route /courses/:id/create-lesson
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_url: '',
    position: 1,
    duration: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    api.get(`/courses/${courseId}`)
      .then(res => setCourse(res.data.data))
      .catch(err => {
        console.error('fetch course failed', err);
        setError('Could not load course');
      });
  }, [courseId]);

  useEffect(() => {
    // redirect non-instructor
    if (user && user.role !== 'instructor') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.video_url.trim()) {
      setError('Title and video URL are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/lessons/${courseId}`, form);
      // navigate to course detail
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Create lesson failed');
    } finally {
      setLoading(false);
    }
  };

  if (!courseId) return <div className="p-6">Missing course id</div>;

  return (
    <div className="max-w-3xl p-6 mx-auto mt-12 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-semibold">Add Lesson to: {course ? course.title : 'Loading...'}</h2>

      {error && <div className="mb-3 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded" placeholder="Lesson title" required />
        <input name="video_url" value={form.video_url} onChange={handleChange} className="w-full p-3 border rounded" placeholder="Video URL (public or signed)" required />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-3 border rounded" placeholder="Short description" rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <input name="position" value={form.position} onChange={handleChange} type="number" className="w-full p-3 border rounded" placeholder="Position" />
          <input name="duration" value={form.duration} onChange={handleChange} type="number" className="w-full p-3 border rounded" placeholder="Duration (seconds)" />
        </div>

        <div className="flex gap-3">
          <button disabled={loading} className="px-4 py-2 text-white bg-green-600 rounded">{loading ? 'Saving...' : 'Add Lesson'}</button>
          <button type="button" onClick={() => navigate(`/courses/${courseId}`)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
