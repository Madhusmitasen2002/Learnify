import React, { useContext } from "react";
import { AuthContext } from "../context/Authcontext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl p-8 mx-auto bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          👤 My Profile
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                user.role === "instructor"
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since
            </p>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {user.role === "instructor" ? (
            <a
              href="/instructor-dashboard"
              className="inline-block px-5 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Go to Instructor Dashboard
            </a>
          ) : (
            <a
              href="/my-progress"
              className="inline-block px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              View Progress
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
