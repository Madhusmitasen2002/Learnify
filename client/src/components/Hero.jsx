// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-linear-to-r from-white to-gray-50">
      <div className="grid items-center max-w-6xl grid-cols-1 gap-10 px-6 py-20 mx-auto lg:grid-cols-2">
        {/* Left: marketing + CTA */}
        <div className="order-2 lg:order-1">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Learn practical skills from industry experts
          </h1>
          <p className="mb-6 text-gray-600">
            Build projects, earn certificates, and take your career forward with hands-on courses —
            video lessons, quizzes, and progress tracking all in one place.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/courses" className="px-6 py-3 text-white bg-blue-600 rounded-md shadow">
              Browse courses
            </Link>
            <Link to="/signup" className="px-6 py-3 border rounded-md">
              Get started — it's free
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-2 mt-6 text-sm text-gray-600">
            <li>• Verified instructors</li>
            <li>• Certificate of completion</li>
            <li>• Secure payments</li>
            <li>• Offline support (coming soon)</li>
          </ul>
        </div>

        {/* Right: role cards */}
        <div className="order-1 lg:order-2">
          <div className="grid grid-cols-1 gap-6">
            <Link
              to="/signup?role=student"
              className="flex items-center gap-4 p-6 transition bg-white shadow rounded-xl hover:shadow-lg"
            >
              <div className="flex items-center justify-center font-bold text-blue-600 rounded-full shrink-0 w-14 h-14 bg-blue-50">
                S
              </div>
              <div>
                <h3 className="text-lg font-semibold">Continue as Student</h3>
                <p className="text-sm text-gray-500">Browse courses, enroll, and track progress.</p>
              </div>
            </Link>

            <Link
              to="/signup?role=instructor"
              className="items-center block gap-4 p-6 transition bg-white border shadow rounded-xl hover:shadow-lg"
            >
              <div className="flex items-center justify-center font-bold text-green-600 rounded-full shrink-0 w-14 h-14 bg-green-50">
                I
              </div>
              <div>
                <h3 className="text-lg font-semibold">Continue as Instructor</h3>
                <p className="text-sm text-gray-500">Create courses, upload lessons, and manage students.</p>
              </div>
            </Link>
          </div>

          {/* small featured card */}
          <div className="w-full max-w-md p-4 mt-6 bg-white shadow-lg rounded-xl">
            <h4 className="font-semibold">Featured course</h4>
            <p className="mt-1 text-sm text-gray-500">React Masterclass — build real-world apps.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
