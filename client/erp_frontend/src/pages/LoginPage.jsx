import { useState, useContext,useEffect,useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import showCred from "../components/showCred";

const LoginPage = () => {
    
    const navigate = useNavigate();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext)

    const shownRef = useRef(false);

    useEffect(() => {
    if (!shownRef.current) {
      showCred();
      shownRef.current = true; // mark as shown
    }
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return; // stop if invalid

            setLoading(true);
        try {
            await login(username, password);

            const storedUser = JSON.parse(localStorage.getItem("user"));
            const role = storedUser?.role;

            toast.success("Login successful!");

            if (role === "Admin" || role === "Manager") {
            navigate("/dashboard");
            } else {
            navigate("/profile");
            }
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            toast.error("Invalid credentials!");
        } finally {
            setLoading(false)
        }
    };

    // Live field validation
    const validateField = (name, value) => {
        let message = "";

        if (name === "username") {
            if (!value.trim()) {
                message = "Username is required.";
            } else if (!/^[a-zA-Z0-9._-]{4,20}$/.test(value)) {
                message = "Username must be 4-20 characters, alphanumeric, _ or .";
            }
        }

        if (name === "password") {
            if (!value) {
                message = "Password is required.";
            } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/.test(value)) {
                message = "Password must be at least 6 chars with a number and special char.";
            }
        }

        setErrors(prev => ({ ...prev, [name]: message }));
    };

    // Full validation on submit
    const validate = () => {
        validateField("username", username);
        validateField("password", password);
        return !errors.username && !errors.password;
    };


    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-2">
            <div className="w-full max-w-sm p-4 space-y-4 bg-white rounded-lg ">
                <h1 className="text-xl font-semibold text-center text-[#1a1134]">Welcome to ERP System</h1>
                <p className="text-center text-gray-600 text-xs">Access your dashboard to manage users, roles, and resources securely.</p>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-xs font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="username"
                            required
                            value={username}
                            onChange={(e) => {
                                setUserName(e.target.value);
                                validateField("username", e.target.value); // live validate
                                // console.log("Typed username:", e.target.value); 
                                }}
                             className={`w-full mt-1 p-2 text-sm border rounded focus:ring-[#1a1134] focus:border-[#1a1134] ${errors.username ? "border-red-500" : "border-gray-300"}`}
                            placeholder="username"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                 validateField("password", e.target.value); // live validate
                                // console.log("Typed password:", e.target.value); 
                                }}
                               className={`w-full mt-1 p-2 text-sm border rounded focus:ring-[#1a1134] focus:border-[#1a1134] ${errors.password ? "border-red-500" : "border-gray-300"}`}
                            placeholder="••••••••"
                        />
                         {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-sm text-white rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a1134] hover:bg-[#2a1f44] hover:cursor-pointer'}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500 ">Or continue with</span>
                    </div>
                </div>

                {/* Social Logins */}
                <button
                    className="hover:cursor-pointer w-full flex items-center justify-center py-2 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    <span className="ml-2 ">Continue with Google</span>
                </button>

                {/* Links */}
                <div className="flex justify-between text-xs">
                    <button
                        className="text-[#1a1134] font-medium hover:underline hover:cursor-pointer"
                        // onClick={() => navigate('/register')}
                    >
                        Create Account
                    </button>
                    <button
                        className="text-gray-600 hover:underline hover:cursor-pointer"
                        // onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
