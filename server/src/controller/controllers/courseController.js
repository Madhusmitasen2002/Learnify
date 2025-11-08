// src/controllers/courseController.js
const supabase = require('../utils/supabaseClient');
const { v4: uuidv4 } = require('uuid');

exports.listCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, q } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('courses').select('*, instructor:users(id,name,email)').order('created_at', { ascending: false });

    if (q) {
      // ilike for search
      query = query.ilike('title', `%${q}%`);
    }

    const { data, error } = await query.range(offset, offset + (+limit) - 1);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('courses')
      .select('*, instructor:users(id,name,email)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ message: 'Course not found' });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail_url, price, is_published } = req.body;
    const instructor_id = req.user?.userId;
    if (!instructor_id) return res.status(401).json({ message: 'Unauthorized' });

    const slug = (title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60) + '-' + uuidv4().slice(0,6);

    const { data, error } = await supabase.from('courses').insert([{
      title, description, thumbnail_url, price: price || 0, is_published: !!is_published, instructor_id, slug
    }]).select('*').single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create course failed', error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const { data: existing, error: e1 } = await supabase.from('courses').select('instructor_id').eq('id', id).single();
    if (e1 || !existing) return res.status(404).json({ message: 'Course not found' });
    if (existing.instructor_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { data, error } = await supabase.from('courses').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: e1 } = await supabase.from('courses').select('instructor_id').eq('id', id).single();
    if (e1 || !existing) return res.status(404).json({ message: 'Course not found' });
    if (existing.instructor_id !== req.user.userId && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
