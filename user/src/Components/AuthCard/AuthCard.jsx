import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import axios from "../../service/api"; // Import the centralized Axios instance

function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const endpoint = isLogin ? "/auth/login" : "/user/signup";
  
    try {
      const response = await axios.post(endpoint, formData);
  
      if (isLogin) {
        localStorage.setItem("authToken", response.data.token);
        alert("Login successful!");
  
        if (response.data.role === "user") {
          navigate("/patient");
        } else if (response.data.role === "doctor") {
          navigate("/doctors");
        } else if (response.data.role === "nurse") {
          navigate("/nurse");
        } else if (response.data.role === "triage") {
          navigate("/triage");
        } else if (response.data.role === "laboratorist") {
          navigate("/laboratorist");
        } else if (response.data.role === "admin") {
          navigate("/admin");
        }
      } else {
        alert("Signup successful! Please log in.");
        setIsLogin(true); // Switch to login mode after successful signup
        navigate("/form"); // Redirect to the /form page after successful signup
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-lg">
      {/* Header: Title */}
      <h2 className="text-4xl font-bold text-[#04353D] mb-8 text-center">
        {isLogin ? "Welcome Back!" : "Create Your Account"}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Conditional Name Input for Signup */}
        {!isLogin && (
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            />
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#5AC5C8] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#4DA5A8] transition duration-200"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      {/* Switch Between Login and Signup */}
      <p className="mt-6 text-lg text-gray-600 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#5AC5C8] font-semibold cursor-pointer hover:underline"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </span>
      </p>
    </div>
  );
}

export default AuthCard;
