// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import LoginPage from "./pages/Loginpage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* Public login page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Admin , Manager → Dashboard only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Employee → Profile only */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["Employee"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
