import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import logo from "../access/img/pillsy_icon.png";
import { LOGIN } from "../api/apiConstants.js";
import { axiosPublic } from "../api/axiosInstance.js";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { useStateContext } from "../contexts/ContextProvider.js";

function Login() {
  const { isLoggedIn, setIsLoggedIn } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate để nhận hàm chuyển hướng

  const handleLogin = async () => {
    try {
      const response = await axiosPublic.post(LOGIN, {
        email: email,
        password: password,
      });

      // const user = jwtDecode(response.data); Chỉ dùng cho phân role
      // Kiểm tra response và xử lý dựa trên kết quả
      if (response.status === 200) {
        // Đăng nhập thành công
        console.log("Token: ", response.data);
        const token = response.data;
        // Lưu token vào localStorage
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        toast.success("Login successfull");
        navigate("/pillsy"); // Chuyển hướng đến trang '/'
        console.log("Đăng nhập thành công");
      } else {
        // Xử lý khi đăng nhập thất bại
        console.log("Đăng nhập thất bại");
      }
    } catch (error) {
      // Xử lý khi có lỗi kết nối hoặc lỗi khác
      console.error("Lỗi khi đăng nhập:", error);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
          <div>
            <section class="bg-gray-50 dark:bg-gray-900">
              <div class="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
                <a
                  href="#"
                  className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
                  Pillsy Admin
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Sign in to your account
                    </h1>
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@company.com"
                          required=""
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required=""
                        />
                      </div>
                      {/* <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    htmlForgot password?
                  </a>
                </div> */}
                      <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        style={{
                          color: `rgb(3, 201, 215)`,
                          backgroundColor: `rgb(229,250, 251)`,
                        }}
                      >
                        Sign in
                      </button>
                      {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
