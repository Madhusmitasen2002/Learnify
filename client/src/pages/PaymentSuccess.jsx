import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const enrollAfterPayment = async () => {
      const courseId = params.get("courseId");
      const sessionId = params.get("session_id");
      if (!courseId || !sessionId) return;

      try {
        // Optional: Verify session with backend before enrolling
        await api.post(`/enroll/${courseId}`);
        alert("Payment successful! You are now enrolled.");
        navigate(`/courses/${courseId}`);
      } catch (err) {
        console.error("Enroll after payment failed", err);
        alert("Something went wrong, contact support.");
      }
    };
    enrollAfterPayment();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4">Redirecting you to your course...</p>
    </div>
  );
}
