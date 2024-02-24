import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Navbar, Footer, ThemeSettings, Sidebar } from "./components";
import {
  Onlyfood,
  Orders,
  Calendar,
  Employees,
  Pyramid,
  Customers,
  Kanban,
  Area,
  Bar,
  Pie,
  Financial,
  ColorPicker,
  ColorMapping,
  Editor,
  Line,
  Chefs,
  Users,
  Login,
  Posts,
} from "./pages";
import { useStateContext } from "./contexts/ContextProvider";
import { LOGIN } from "./api/apiConstants";
import { axiosPrivate, axiosPublic } from "./api/axiosInstance";
import "./App.css";
import { toast } from "react-toastify";
import Patients from "./pages/Patients";
import Pills from "./pages/Pills";

const App = () => {
  //Lấy state của activeMenu
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
    isLoggedIn,
    setIsLoggedIn
  } = useStateContext();
  // user login check
  // useEffect(() => {
  //   const checkLogin = () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         // await axiosPrivate.get("/api/v1/accounts");
  //         setIsLoggedIn(true);
  //         toast.success("Login successfull");
  //       } catch (error) {
  //         localStorage.removeItem("token");
  //         setIsLoggedIn(false);
  //         console.error("Login check error:", error);
  //       }
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   };
  
  //   checkLogin();
  // }, []);
  
  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn); // Log updated value
  }, [isLoggedIn]);

  

  return (
    <div className="application">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Pillsy Dashboard</title>
        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        <meta name="description" content="Pillsy Dashboard Web App" />
      </Helmet>
      <div className={currentMode === "Dark" ? "dark" : ""}>
        <BrowserRouter>
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              <TooltipComponent content="Settings" position="top">
                <button
                  type="button"
                  className=" text-3xl p-3 
                    hover:drop-shadow-xl
                     hover:bg-light-gray text-white"
                  onClick={() => setThemeSettings(true)}
                  style={{ background: currentColor, borderRadius: "50%" }}
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            </div>
            {/* Sidebar */}
            {activeMenu ? (
              <div
                className="w-72 fixed sidebar
                 dark:bg-secondary-dark-bg
                 bg-white"
              >
                <Sidebar />
              </div>
            ) : (
              <div
                className="w-0
                dark:bg-secondary-dark-bg"
              >
                <Sidebar />
              </div>
            )}
            {/* Navbar */}
            <div
              className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full
               ${activeMenu ? "md:ml-72" : "flex-2"}`}
            >
              <div className=" fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                <Navbar />
              </div>
              {/* Theme */}
              {themeSettings && <ThemeSettings />}
              {/* Chỉ show themeSettings khi nó true */}
              {/* Routing */}
              <Routes>
                {isLoggedIn ? (
                  <>
                    {/* Dashboard */}
                    <Route path="/pillsy" element={<Onlyfood />} />
                    {/* Pages */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/accounts" element={<Users />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/pills" element={<Pills />} />
                    <Route path="/chefs" element={<Chefs />} />
                    <Route path="/posts" element={<Posts />} />
                    {/* Apps */}
                    <Route path="/kanban" element={<Kanban />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/color-picker" element={<ColorPicker />} />
                    {/* Chart */}
                    <Route path="/line" element={<Line />} />
                    <Route path="/area" element={<Area />} />
                    <Route path="/bar" element={<Bar />} />
                    <Route path="/pie" element={<Pie />} />
                    <Route path="/financial" element={<Financial />} />
                    <Route path="/color-mapping" element={<ColorMapping />} />
                    <Route path="/pyramid" element={<Pyramid />} />
                    {/* <Route path="/stacked" element={<Stacked />} /> */}
                  </>
                ) : (
                  <Route path="/" element={<Navigate to="/login" replace />} />
                )}
                <Route path="/" element={<Onlyfood />} />
                {/* <Route path="/pillsy" element={<Onlyfood />} /> */}
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
