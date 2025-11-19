import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./layout/Sidebar";
import StudentPage from "./pages/student-page/StudentPage";
import CoursesPage from "./pages/student-page/CoursesPage";
import FeesPage from "./pages/student-page/FeesPage";
import CertificatePage from "./pages/student-page/CertificatePage";
import InternshipPage from "./pages/student-page/InternshipPage";
import LeaveStudentsPage from "./pages/student-page/LeaveStudentsPage";

import Login from "./pages/login-page/LoginPage";
import ProtectedRoute from "./pages/login-page/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function LayoutWithSidebar({ children }) {
  return (
    <div className="flex">
      <ToastContainer position="top-right" autoClose={2000} />

      <Sidebar />
      <div className="w-full lg:ml-64 md:ml-64 sm:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ADMIN PAGES */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <StudentPage />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <CoursesPage />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fees"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <FeesPage />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <CertificatePage />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/internship"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <InternshipPage />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <LeaveStudentsPage />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
