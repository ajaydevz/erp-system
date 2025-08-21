import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Pencil,
  Trash2,
  Plus,
  Menu,
  Users,
  LayoutDashboard,
  UserCheck,
  UserCog,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios"; // Your axios instance

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // add | edit | delete
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users"); // Replace with your API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  
  const validateForm = () => {
    const errors = {};

    // Username: min 4 letters, only alphabets
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!/^[A-Za-z]{4,}$/.test(formData.username)) {
      errors.username = "Username must be at least 4 letters and contain only alphabets";
    }

    // First Name: only alphabets
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.first_name)) {
      errors.first_name = "First name must contain only alphabets";
    }

    // Last Name: only alphabets
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.last_name)) {
      errors.last_name = "Last name must contain only alphabets";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Password (only on add)
    if (modalType === "add") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(formData.password)) {
        errors.password = "Password must be at least 6 characters and include letters, numbers, and special characters";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirect after logout
  };

  // Filter users for manager view
  const visibleUsers =
    user.role === "Manager" ? users.filter(u => u.role === "Employee") : users;

  // Stats
  const totalUsers = users.length;
  const managers = users.filter(u => u.role === "Manager").length;
  const employees = users.filter(u => u.role === "Employee").length;
  const admins = users.filter(u => u.role === "Admin").length;

  // Modals
  const openAddModal = () => {
    setFormData({ username: "", first_name: "", last_name: "", email: "", password: "", role: "Employee" });
    setModalType("add");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({ ...user, password: "" });
    setSelectedUser(user);
    setModalType("edit");
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalType("delete");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Stop if validation fails
    try {
      console.log("Access token:", localStorage.getItem("access")); 
      let payload = { ...formData };
      if (modalType === "edit") delete payload.password; // Don't send password on edit

      if (modalType === "add") {
        const response = await api.post("/users/create/", formData);
        console.log(formData)
        setUsers([...users, response.data]);
        toast.success("User added successfully!");
      } else if (modalType === "edit") {
        const response = await api.put(`/users/${selectedUser.id}/`, formData);
        setUsers(users.map(u => u.id === selectedUser.id ? response.data : u));
        toast.success("User updated successfully!");
      }
      setShowModal(false);
      setFormErrors({});
    } catch (error) {
      console.error("Error saving user:", error);
       toast.error("Operation failed!");
    }

  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}/`);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowModal(false);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 bg-[#1a1134] text-white w-64 p-6 z-20`}>
        <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-10">ERP System</h2>
        <nav className="space-y-2 md:space-y-4">
          <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-[#2a1f44] p-2 md:p-3 rounded-lg transition">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-[#2a1f44] p-2 md:p-3 rounded-lg transition">
            <Users size={18} /> Users
          </a>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar */}
        <header className="w-full bg-white px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shadow-md">
          <button className="md:hidden text-gray-700" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <h1 className="text-base md:text-xl font-semibold text-gray-800">ERP User Dashboard</h1>
          <button className="bg-[#1a1134] text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2a1f44]" onClick={handleLogout}>Logout</button>
        </header>

        <main className="flex-1 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Welcome message */}
            <p className="text-gray-700 text-sm mb-4">Welcome, {user.role}</p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <StatCard icon={<UserCheck className="text-green-600" size={32} />} label="Total Users" value={totalUsers} />
              <StatCard icon={<UserCog className="text-blue-600" size={32} />} label="Managers" value={managers} />
              <StatCard icon={<User className="text-purple-600" size={32} />} label="Employees" value={employees} />
              <StatCard icon={<User className="text-red-600" size={32} />} label="Admins" value={admins} />
            </div>

            {/* Header + Add Button (only Admin sees Add) */}
            {user.role === "Admin" && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">Manage Users</h2>
                  <p className="text-gray-600 text-xs md:text-sm">Add, edit, or remove users and assign roles.</p>
                </div>
                <button onClick={openAddModal} className="self-start sm:self-auto bg-[#1a1134] hover:bg-[#2a1f44] text-white px-3 md:px-5 py-2 rounded-lg flex items-center gap-2">
                  <Plus size={16} /> Add User
                </button>
              </div>
            )}

            {/* Mobile Cards */}
            <div className="grid gap-3 md:hidden mb-4">
              {visibleUsers.map(u => (
                <div key={u.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{u.username}</p>
                        <p className="text-xs text-gray-500 break-all">{u.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{u.role}</span>
                      </div>
                    </div>
                    {user.role === "Admin" && (
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => openEditModal(u)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-xs"><Pencil size={14} /> Edit</button>
                        <button onClick={() => openDeleteModal(u)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-xs"><Trash2 size={14} /> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 border-b">Username</th>
                    <th className="px-4 py-3 border-b">Email</th>
                    <th className="px-4 py-3 border-b">Role</th>
                    {user.role === "Admin" && <th className="px-4 py-3 border-b text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b">{u.username}</td>
                      <td className="px-4 py-3 border-b">{u.email}</td>
                      <td className="px-4 py-3 border-b">{u.role}</td>
                      {user.role === "Admin" && (
                        <td className="px-4 py-3 border-b text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditModal(u)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"><Pencil size={14} /> Edit</button>
                            <button onClick={() => openDeleteModal(u)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>

        <footer className="w-full bg-white text-gray-600 text-xs text-center py-4 border-t">© {new Date().getFullYear()} ERP System. All rights reserved.</footer>
      </div>

      {/* Modals */}
      {showModal && (modalType === "add" || modalType === "edit") && (
        <Modal formData={formData} setFormData={setFormData}  formErrors={formErrors} modalType={modalType} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
      {showModal && modalType === "delete" && (
        <DeleteModal username={selectedUser?.username} onClose={() => setShowModal(false)} onDelete={handleDelete} />
      )}
    </div>
  );
};

// StatCard, Modal, DeleteModal components remain the same
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
    {icon}
    <div>
      <h3 className="text-gray-500 text-xs md:text-sm">{label}</h3>
      <p className="text-xl md:text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const Modal = ({ formData, setFormData, modalType, onClose, formErrors,onSave }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 md:max-w-lg">
      <h3 className="text-2xl font-semibold mb-5 text-gray-800">{modalType === "add" ? "Add User" : "Edit User"}</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a1134] focus:outline-none" />
         {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" placeholder="First Name" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a1134] focus:outline-none" />
           {formErrors.first_name && <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" placeholder="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a1134] focus:outline-none" />
           {formErrors.last_name && <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a1134] focus:outline-none" />
         {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
      </div>
      {modalType === "add" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a1134] focus:outline-none" />
           {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
        </div>
      )}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a1134] focus:outline-none">
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={onSave} className="px-4 py-2 rounded-lg bg-[#1a1134] text-white hover:bg-[#2a1f44]">Save</button>
      </div>
    </div>
  </div>
);

const DeleteModal = ({ username, onClose, onDelete }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 md:max-w-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Delete User</h3>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete <span className="font-medium">{username}</span>?
      </p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={onDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
);

export default UserDashboard;
