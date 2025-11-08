// src/controllers/lessonController.js
const supabase = require('../utils/supabaseClient');

exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { data, error } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('position', { ascending: true });
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch lessons', error: err.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed', error: err.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, video_url, position, duration } = req.body;

    const { data: course, error: e1 } = await supabase.from('courses').select('instructor_id').eq('id', courseId).single();
    if (e1) throw e1;
    if (!course || course.instructor_id !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

    const { data, error } = await supabase.from('lessons').insert([{ course_id: courseId, title, description, video_url, position, duration }]).select('*').single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create lesson failed', error: err.message });
  }
};
