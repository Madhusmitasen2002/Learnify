// src/pages/CourseCreate.jsx
import React, { useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

export default function CourseCreate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // redirect non-instructors away (frontend guard only)
  useEffect(() => {
    if (user && user.role !== 'instructor') {
      // not instructor -> send to home
      navigate('/');
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    price: 0,
    is_published: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      // API requires auth (token) and instructor role on backend
      const res = await api.post('/courses', form);
      const courseId = res.data.data.id;
      // navigate to course detail page
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto mt-12 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-semibold">Create course</h2>

      {!user && (
        <div className="mb-4 text-sm text-gray-600">
          You must be logged in as an instructor to create a course.
        </div>
      )}

      {error && <div className="mb-3 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <div className="mb-1 text-sm font-medium">Title</div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            placeholder="React Masterclass"
            required
            disabled={!user}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">Thumbnail URL</div>
          <input
            name="thumbnail_url"
            value={form.thumbnail_url}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            placeholder="https://example.com/image.png"
            disabled={!user}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">Description</div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows={4}
            placeholder="Short course description"
            disabled={!user}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <div className="mb-1 text-sm font-medium">Price (INR)</div>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              className="w-full p-3 border rounded"
              disabled={!user}
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              disabled={!user}
            />
            <span className="text-sm">Publish now</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={!user || loading}
            className="px-5 py-3 text-black bg-blue-600 rounded disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create course'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
