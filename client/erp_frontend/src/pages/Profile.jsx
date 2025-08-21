// ProfilePage.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Section: Welcome */}
        <div className="relative md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 text-white">
          {/* Animated circles */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 2 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-[-80px] right-[-80px] w-48 h-48 bg-white/20 rounded-full"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 2 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-white/20 rounded-full"
          />

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold mb-2"
          >
            👋 Welcome, {user?.username || "User"}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white/90 text-sm md:text-base mb-6"
          >
            You are now logged in as <span className="font-semibold">{user?.role || "Employee"}</span> in <span className="font-bold">ERP System</span>. Enjoy managing resources seamlessly!
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handleLogout}
            className="w-full md:w-auto px-6 py-3 rounded-2xl bg-white text-purple-700 font-semibold text-sm md:text-base hover:bg-white/90 transition-all shadow-lg"
          >
            🚪 Logout
          </motion.button>
        </div>

        {/* Right Section: Profile Card */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl p-6 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{user?.username || "User"}</h2>
            <p className="text-gray-500 mb-2">{user?.email || "user@example.com"}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">{user?.role || "Employee"}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 bg-white rounded-2xl shadow-xl p-4 text-center"
          >
            <p className="text-gray-600 text-sm">
              Welcome to the <span className="font-semibold">ERP System</span>! You can manage your profile, explore the dashboard, and collaborate with your team efficiently.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>  
  );
};

export default ProfilePage;
