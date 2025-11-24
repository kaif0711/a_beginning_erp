import React, { useState } from "react";
import BgImage from "../../assets/images/bg-login.jpg";
import Api from "../../utils/apiClient";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data1 = await Api.post("/admin/login", {
        username,
        password,
      });

      console.log(data1);

      if (data1.status === 200) {
        localStorage.setItem("userName", data1.data.data?.adminData?.username);
        localStorage.setItem("accessToken", data1.data.data?.accessToken);
        localStorage.setItem("refreshToken", data1.data.data?.refreshToken);
        window.location.href = "/students";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#025b6f] to-[#01343f] flex justify-center items-center px-4">
      <div className="w-full max-w-7xl h-[70%] border-2xl border-gray-500 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT IMAGE SECTION */}
        <div className="md:w-1/2 relative md:top-6 md:left-4 md:h-[90%] p-6 bg-black flex items-end justify-start rounded-3xl">
          <img
            src={BgImage}
            className="absolute inset-0 w-full h-full object-cover opacity-90 rounded-3xl"
            alt="login"
          />

          {/* TEXT INSIDE IMAGE */}
          <div className="relative text-white p-6 z-10">
            <h1 className="text-3xl font-bold mb-2">Login Admin Account</h1>
            <p className="text-sm text-gray-200">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="md:w-1/2 bg-white py-10 px-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center mb-10">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Email or Mobile"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button className="w-full bg-primary hover:bg-[#014d59] text-white py-2 rounded-lg font-semibold transition">
              Login Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
