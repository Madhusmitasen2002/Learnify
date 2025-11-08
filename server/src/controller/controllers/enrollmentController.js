// src/controllers/enrollmentController.js
const supabase = require('../utils/supabaseClient');

exports.enroll = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { courseId } = req.params;

    const { data, error } = await supabase
      .from('enrollments')
      .upsert([{ user_id, course_id: courseId }], { onConflict: ['user_id','course_id'] })
      .select('*')
      .single();

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Enroll failed', error: err.message });
  }
};

exports.getEnrollment = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { courseId } = req.params;

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user_id)
      .eq('course_id', courseId)
      .maybeSingle(); // 👈 safer than .single()

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (!data) {
      console.log('🚫 Not enrolled');
      return res.status(404).json({ message: 'Not enrolled' });
    }

    console.log('✅ Enrollment found:', data);
    return res.json({ data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateProgress = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { courseId } = req.params;
    const { progress } = req.body;

    const { data, error } = await supabase.from('enrollments').update({ progress }).eq('user_id', user_id).eq('course_id', courseId).select('*').single();
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed', error: err.message });
  }
};
