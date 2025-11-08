import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import api from "../api/axios";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user?.role === "student") {
      api.get("/enrollments")
        .then((res) => setCourses(res.data.data || []))
        .catch(() => setCourses([]));
    }
  }, [user]);

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          👋 Welcome back, {user?.name || "Learner"}!
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Continue learning or explore new courses below.
        </p>

        {/* Quick Actions */}
        <div className="grid gap-4 mb-10 sm:grid-cols-2 lg:grid-cols-3">
          {user?.role === "instructor" ? (
            <>
              <button
                onClick={() => navigate("/create-course")}
                className="p-6 text-left transition bg-white border rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <h3 className="mb-1 text-lg font-semibold">📚 Create a new course</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start teaching by uploading your own lessons.
                </p>
              </button>

              <button
                onClick={() => navigate("/instructor-dashboard")}
                className="p-6 text-left transition bg-white border rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <h3 className="mb-1 text-lg font-semibold">🧭 Instructor Dashboard</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your published courses and lessons.
                </p>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/courses")}
                className="p-6 text-left transition bg-white border rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <h3 className="mb-1 text-lg font-semibold">🎓 Browse all courses</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Discover new subjects to expand your skills.
                </p>
              </button>

              <button
                onClick={() => navigate("/my-progress")}
                className="p-6 text-left transition bg-white border rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <h3 className="mb-1 text-lg font-semibold">📈 View progress</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your enrolled courses and achievements.
                </p>
              </button>
            </>
          )}
        </div>

        {/* My Courses Section */}
        {user?.role === "student" && (
          <>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              My Courses
            </h2>
            {courses.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                You haven’t enrolled in any courses yet.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 transition bg-white border rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <img
                      src={course.thumbnail_url || "/placeholder.png"}
                      alt={course.title}
                      className="object-cover w-full h-40 mb-3 rounded"
                    />
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.description?.slice(0, 80)}...
                    </p>
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="px-4 py-2 mt-3 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
