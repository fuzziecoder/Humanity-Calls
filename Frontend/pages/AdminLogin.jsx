import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShieldAlt, FaLock, FaUser } from "react-icons/fa";
import hclogo from "../assets/humanitycallslogo.avif";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password,
      });
      if (response.data.user.role === "admin") {
        sessionStorage.setItem("adminToken", response.data.token);
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        setError("Unauthorized access");
        toast.error("Unauthorized access");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      toast.error(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0F0F1B 0%, #1E1F2E 50%, #151525 100%)" }}
    >
      {/* Background decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: "rgba(30, 31, 46, 0.95)", backdropFilter: "blur(24px)" }}
        >
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/8 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/10">
                <img src={hclogo} alt="HC" className="w-full h-full object-contain bg-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                <FaShieldAlt size={10} className="text-white" />
              </div>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Humanity Calls</h1>
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.25em] mt-1">Admin Portal</p>
          </div>

          {/* Form body */}
          <div className="px-8 py-8">
            <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
            <p className="text-sm text-white/40 font-medium mb-8">Sign in to continue to your admin panel</p>

            {error && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Username
                </label>
                <div className="relative">
                  <FaUser size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 font-medium text-sm outline-none transition-all border focus:ring-2"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Password
                </label>
                <div className="relative">
                  <FaLock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder-white/20 font-medium text-sm outline-none transition-all border"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl"
                style={{
                  background: isLoading
                    ? "rgba(99,102,241,0.7)"
                    : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
                  color: "#ffffff",
                }}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaShieldAlt size={14} />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
              Humanity Calls Trust® — Authorized Access Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
