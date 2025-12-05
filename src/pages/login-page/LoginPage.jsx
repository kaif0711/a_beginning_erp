import React, { useState } from "react";
import BgImage from "../../assets/images/bg-login3.jpg";
import logo from "../../assets/images/logo1.png";
import Api from "../../utils/apiClient";
import { CiLock, CiUser } from "react-icons/ci";
import { FiEye, FiEyeOff } from "react-icons/fi"; // ⭐ Added Show/Hide Icons

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false); // ⭐ NEW STATE

  const [errors, setErrors] = useState({ username: "", password: "", api: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = { username: "", password: "", api: "" };
    let hasError = false;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const data1 = await Api.post("/admin/login", { username, password });

      if (data1.status === 200) {
        localStorage.setItem("userName", data1.data.data?.admin?.username);
        localStorage.setItem("accessToken", data1.data.data?.accessToken);
        localStorage.setItem("refreshToken", data1.data.data?.refreshToken);

        window.location.href = "/dashboard";
      }
    } catch (error) {
      setErrors({ ...newErrors, api: "Invalid username or password" });
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#025b6f] to-[#01343f] flex justify-center items-center px-4">
      {/* MAIN WHITE CARD */}
      <div className="w-full max-w-6xl h-auto md:h-[75%] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT SIDE IMAGE SECTION */}
        <div className="w-full md:w-1/2 p-4 md:p-6 relative flex items-end justify-start">
          <div className="absolute top-2 left-2 right-2 bottom-2 md:top-3 md:left-3 md:right-auto md:bottom-auto h-[98%] md:h-[96%] md:inset-0 rounded-l-2xl md:rounded-l-3xl overflow-hidden">
            <img
              src={BgImage}
              alt="bg"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          <img
            src={logo}
            alt="Company Logo"
            className="absolute top-10 left-10 w-20 md:w-24 z-20"
          />

          <div className="relative z-20 text-white p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Login your Account
            </h1>
            <p className="text-sm text-gray-200 hidden md:block">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN FORM */}
        <div
          className="
            w-full md:w-[52%]
            h-auto md:h-full
            bg-white flex flex-col justify-center
            px-6 md:px-12 py-10
            rounded-t-3xl md:rounded-none
            md:rounded-l-[10%]
            relative md:absolute md:left-[48%]
          "
        >
          <h2 className="text-3xl font-semibold text-center mb-10">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* USERNAME INPUT */}
            <div className="relative">
              <input
                type="text"
                placeholder="Your Username"
                className={`w-full border px-10 py-2 rounded-lg ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
              />
              <CiUser className="absolute top-3 left-3 text-xl" />

              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* PASSWORD INPUT WITH SHOW/HIDE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // ⭐ Toggle input type
                placeholder="Password"
                className={`w-full border px-10 py-2 rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
              />

              <CiLock className="absolute top-3 left-3 text-xl" />

              {/* ⭐ Show/Hide Password Icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* API ERROR */}
            {errors.api && (
              <p className="text-red-600 text-center text-sm">{errors.api}</p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#02677a] hover:bg-[#014d59] text-white py-2 rounded-lg font-semibold transition"
            >
              Login Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
