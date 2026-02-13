import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminStudyPlans from './pages/admin/AdminStudyPlans';
import AdminNews from './pages/admin/AdminNews';
import AdminGraduates from './pages/admin/AdminGraduates';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherSubjects from './pages/teacher/TeacherSubjects';
import TeacherGrades from './pages/teacher/TeacherGrades';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentDiary from './pages/student/StudentDiary';
import TopStudents from './pages/TopStudents';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardRoute = () => {
    if (!isAuthenticated) return '/';
    
    switch (user?.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'TEACHER':
        return '/teacher/dashboard';
      case 'STUDENT':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <RegisterPage />} 
        />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="study-plans" element={<AdminStudyPlans />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="graduates" element={<AdminGraduates />} />
          <Route path="top-students" element={<TopStudents />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="subjects" element={<TeacherSubjects />} />
          <Route path="grades" element={<TeacherGrades />} />
          <Route path="top-students" element={<TopStudents />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="subjects" element={<StudentSubjects />} />
          <Route path="diary" element={<StudentDiary />} />
          <Route path="top-students" element={<TopStudents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
