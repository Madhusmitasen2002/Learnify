// src/pages/CourseDetail.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const videoRef = useRef(null);

  // Stripe setup
  const stripePromise = loadStripe("pk_test_51S69TpPqgNbSb0uzvYnHqWS9wbfJaI0THAmJaRm8jMR8sA8ovuEDT0p9xzCJEOFdDbx2pu7JCOFTJe6kH3oJ5Gz900KCMlO8kx");

  // Fetch course, lessons, and enrollment status
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setVideoError(null);

    // Fetch course
    api.get(`/courses/${id}`)
      .then(res => mounted && setCourse(res.data.data))
      .catch(err => { console.error('fetch course', err); mounted && setCourse(null); });

    // Fetch lessons
    api.get(`/lessons/${id}`)
      .then(res => {
        if (!mounted) return;
        const arr = res.data.data || [];
        setLessons(arr);
      })
      .catch(err => { console.error('fetch lessons', err); setLessons([]); })
      .finally(() => mounted && setLoading(false));

    // Fetch enrollment status if user is logged in
    if (user) {
      api.get(`/enroll/${id}`)
        .then(() => { if (mounted) setEnrolled(true); })
        .catch(() => { if (mounted) setEnrolled(false); });
    } else {
      setEnrolled(false);
    }

    return () => { mounted = false; };
  }, [id, user]);

  // Enroll handler
  const handleEnroll = async () => {
    if (!user) {
      alert("Please log in to continue to checkout");
      navigate("/login");
      return;
    }

    try {
      if (course.price > 0) {
        // Paid course → Stripe checkout
        const res = await api.post(`/payment/create-checkout-session/${id}`);
        window.location.href = res.data.url;
      } else {
        // Free course → enroll directly
        await api.post(`/enroll/${id}`);
        setEnrolled(true);
        if (lessons.length) setCurrentVideo(lessons[0]);
      }
    } catch (err) {
      console.error("Payment/enroll error", err);
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  // Play lesson
  const playLesson = (lesson) => {
    setVideoError(null);
    setCurrentVideo(lesson);
    setTimeout(() => {
      videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // Video ended → mark progress
  const onVideoEnded = async () => {
    if (!enrolled) return;
    try {
      await api.post(`/enroll/${id}/progress`, { progress: 100 });
    } catch (err) {
      console.error('progress update failed', err);
    }
  };

  const onVideoError = (e) => {
    console.error('video element error', e);
    setVideoError('Video failed to load. Try opening in a new tab.');
  };

  // Play sample
  const playSample = () => {
  if (lessons.length === 0) {
    alert("No lessons available to play as a sample.");
    return;
  }

  const firstLesson = lessons[0];
  setVideoError(null);
  setCurrentVideo(firstLesson);

  // temporarily unlock so user can play first lesson
  setEnrolled(true);

  setTimeout(() => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
};


  // Helpers for YouTube/Vimeo
  const isYouTube = (url = '') => url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = (url = '') => url.includes('vimeo.com');
  const toYouTubeEmbed = (url) => url.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/').split('&')[0];

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found.</div>;

  return (
    <div className="grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 mx-auto lg:grid-cols-3">
      <div className="lg:col-span-2">
        <img src={course.thumbnail_url || '/placeholder.png'} alt={course.title} className="object-cover w-full h-64 mb-6 rounded" />
        <h1 className="mb-3 text-3xl font-bold">{course.title}</h1>
        <p className="mb-6 text-gray-600">{course.description}</p>

        {!enrolled ? (
          <div className="flex gap-3 mb-6">
            <button onClick={handleEnroll} className="px-5 py-3 text-white bg-blue-600 rounded">
              {course.price > 0 ? `Buy for ₹${course.price}` : 'Enroll for free'}
            </button>
            <button onClick={playSample} className="px-5 py-3 border rounded">Play sample</button>
          </div>
        ) : (
          <div className="mb-6">
            <div ref={videoRef} className="overflow-hidden bg-black rounded">
              {currentVideo ? (
                <>
                  <div className="px-4 py-3 text-white">
                    <strong>{currentVideo.position}. {currentVideo.title}</strong>
                  </div>

                  {isYouTube(currentVideo.video_url) ? (
                    <iframe
                      width="100%"
                      height="400"
                      src={toYouTubeEmbed(currentVideo.video_url)}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    />
                  ) : isVimeo(currentVideo.video_url) ? (
                    <iframe
                      src={currentVideo.video_url.replace('vimeo.com', 'player.vimeo.com/video')}
                      width="100%"
                      height="400"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={currentVideo.title}
                      className="rounded"
                    />
                  ) : (
                    <video
                      controls
                      src={currentVideo.video_url.startsWith('http') ? currentVideo.video_url : `http://localhost:5000${currentVideo.video_url}`}
                      className="object-cover w-full bg-black h-72"
                      onEnded={onVideoEnded}
                      onError={onVideoError}
                      crossOrigin="anonymous"
                    />
                  )}
                </>
              ) : (
                <div className="p-8 text-white">Select a lesson to play</div>
              )}
            </div>

            {videoError && (
              <div className="p-3 mt-3 text-sm text-red-700 rounded bg-red-50">
                {videoError}
              </div>
            )}
          </div>
        )}

        <h3 className="mb-3 text-xl font-semibold">Course content</h3>
        <ul className="space-y-2">
          {lessons.map((l) => (
            <li key={l.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
              <div>
                <div className="font-medium">{l.position}. {l.title}</div>
                <div className="text-sm text-gray-500">{l.duration ? `${Math.ceil(l.duration / 60)} min` : ''}</div>
              </div>
              {enrolled ? (
                <button onClick={() => playLesson(l)} className="px-3 py-1 border rounded">Play</button>
              ) : (
                <div className="text-sm text-gray-500">Locked</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <aside className="space-y-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Instructor</div>
          <div className="font-medium">{course.instructor?.name || 'Unknown'}</div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">What you'll get</div>
          <ul className="mt-2 text-sm">
            <li>• {lessons.length} lessons</li>
            <li>• Certificate</li>
            <li>• Lifetime access</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
