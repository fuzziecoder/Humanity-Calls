import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUserAlt, FaArrowRight, FaEnvelope, FaLock, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BecomeAMember = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
    isSubscribedForMail: true,
  });

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const { user, login, signup } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(`${API_URL}/auth/send-otp`, { email: formData.email });
      setOtpSent(true);
      toast.success("Verification code sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otpValues.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, {
        email: formData.email,
        otp: otpString,
      });
      setOtpVerified(true);
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        if (!formData.acceptTerms) {
          toast.error("Please accept the terms and conditions");
          setLoading(false);
          return;
        }
        await signup(formData);
        toast.success("Account created successfully!");
      }
      navigate(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blood/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.05)] border border-black/5 relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <Link to="/" className="group flex items-center gap-2 mb-6 bg-black/3 px-3.5 py-1.5 rounded-full hover:bg-black/5 transition-colors">
              <FaChevronLeft className="text-[9px] text-black/40 group-hover:text-blood transition-colors" />
              <span className="text-[10px] font-black tracking-widest text-black/40 uppercase group-hover:text-blood transition-colors" style={{ fontFamily: '"Syne", sans-serif' }}>Home</span>
            </Link>
            
            <h2 className="text-4xl font-black text-black tracking-tighter text-center leading-tight mb-3" style={{ fontFamily: '"Syne", sans-serif' }}>
              {isLogin ? "Welcome back." : "Join the cause."}
            </h2>
            <p className="text-black/30 font-bold text-sm text-center max-w-[280px]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {isLogin ? "Impact starts with action." : "Build a legacy of kindness today."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-1.5 ml-3">Full Name</label>
                  <div className="relative">
                    <FaUserAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 text-xs" />
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full bg-black/2 border border-black/5 rounded-2xl px-12 py-3.5 text-xs font-bold placeholder:text-black/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-1.5 ml-3">Email</label>
                <div className="flex flex-col gap-2">
                  <div className="relative grow">
                    <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 text-xs" />
                    <input
                      name="email"
                      type="email"
                      required
                      disabled={!isLogin && otpSent}
                      className="w-full bg-black/2 border border-black/5 rounded-2xl px-12 py-3.5 text-xs font-bold placeholder:text-black/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none disabled:opacity-50"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {!isLogin && !otpVerified && (
                    <motion.button
                      type="button"
                      initial="initial"
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendOtp}
                      disabled={!formData.email || otpSent || otpLoading}
                      className="relative w-full py-3.5 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest overflow-hidden group disabled:opacity-50"
                    >
                      <motion.div 
                        variants={{
                          initial: { scaleX: 0, opacity: 0 },
                          hover: { scaleX: 1, opacity: 1 },
                        }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="absolute inset-0 bg-purple-600 z-0 origin-center"
                      />
                      <span className="relative z-10">{otpSent ? "CODE SENT" : "SEND OTP"}</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {!isLogin && otpSent && !otpVerified && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-black/1 rounded-4xl border border-black/5"
                >
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 text-center mb-5">
                    Verification Code
                  </label>
                  <div className="flex justify-center gap-2 mb-6">
                    {otpValues.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-10 h-12 text-center text-xl font-black bg-white rounded-xl shadow-sm border border-black/5 outline-none focus:ring-2 focus:ring-blood/10 focus:scale-105 transition-all"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpValues(["", "", "", "", "", ""]);
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-black/30 hover:text-blood transition-colors"
                    >
                      Change Email
                    </button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleVerifyOtp}
                      className="bg-blood text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg shadow-blood/10"
                    >
                      Verify
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-1.5 ml-3">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 text-xs" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full bg-black/2 border border-black/5 rounded-2xl px-12 py-3.5 text-xs font-bold placeholder:text-black/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end pr-2">
                <Link
                  to="/forgot-password"
                  className="relative text-[9px] font-black uppercase tracking-widest text-black/50 hover:text-purple-600 transition-colors group/forgot"
                >
                  Forgot password?
                  <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-purple-600/40 rounded-full scale-x-0 group-hover/forgot:scale-x-100 transition-transform origin-left" />
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group/check ml-3">
                  <div className="relative flex items-center">
                    <input
                      name="acceptTerms"
                      type="checkbox"
                      required
                      className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    <div className="h-5 w-5 bg-black/2 rounded-md border border-black/5 peer-checked:bg-purple-600 transition-all flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/30 group-hover/check:text-black transition-colors">
                    Accept Terms
                  </span>
                </label>
              </div>
            )}

            <div className="pt-2">
              <motion.button
                type="submit"
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                disabled={loading || (!isLogin && !otpVerified)}
                className="relative w-full bg-[#1a1a1a] text-white py-5 rounded-3xl shadow-xl shadow-black/5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group/main"
              >
                {/* Center-to-Edge Fill Layer */}
                <motion.div 
                  variants={{
                    initial: { scaleX: 0, opacity: 0 },
                    hover: { scaleX: 1, opacity: 1 },
                  }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 bg-purple-600 z-0 origin-center"
                />
                
                <div className="relative z-10 flex items-center justify-center gap-2.5">
                  <span className="text-[11px] font-black uppercase tracking-widest" style={{ fontFamily: '"Syne", sans-serif' }}>
                    {loading ? "Please Wait..." : isLogin ? "Login Now" : "Create Account"}
                  </span>
                  <motion.div
                    variants={{
                      initial: { x: 0 },
                      hover: { x: 5 }
                    }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <FaArrowRight className="text-sm" />
                  </motion.div>
                </div>
              </motion.button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group flex flex-col items-center gap-1.5 w-full"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/20 group-hover:text-black/40 transition-colors">
                {isLogin ? "No account?" : "Have an account?"}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-blood group-hover:text-[#c00] transition-colors" style={{ fontFamily: '"Syne", sans-serif' }}>
                {isLogin ? "Create Profile →" : "Sign In →"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeAMember;
