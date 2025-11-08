import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

export default function Progress() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .get("/enrollments") // Adjust to your backend route for student enrollments
      .then((res) => {
        setCourses(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch progress:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        Please log in to view your progress.
      </div>
    );

  if (user.role !== "student")
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        Only students can view progress.
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          📈 My Progress
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : courses.length === 0 ? (
          <div className="p-6 text-gray-600 bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            You haven’t enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <div
                key={c.course_id}
                className="p-5 bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <img
                  src={c.course?.thumbnail_url || "/placeholder.png"}
                  alt={c.course?.title}
                  className="object-cover w-full h-40 mb-3 rounded"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {c.course?.title}
                </h3>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  {c.course?.description?.slice(0, 80)}...
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="h-2.5 rounded-full bg-blue-600"
                    style={{ width: `${c.progress || 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>{c.progress || 0}% complete</span>
                  <button
                    onClick={() => navigate(`/courses/${c.course_id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
