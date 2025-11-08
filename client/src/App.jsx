// App.jsx
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetails';
import CourseCreate from './pages/CourseCreate';
import InstructorDashboard from './pages/InstructorDashboard';
import LessonCreate from './pages/LessonCreate';
import PaymentSuccess from './pages/PaymentSuccess';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/create-course" element={<CourseCreate />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/courses/:id/create-lesson" element={<LessonCreate />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
