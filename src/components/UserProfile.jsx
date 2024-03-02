import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from "../data/leaderdiba.jpg";
const UserProfile = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
    useStateContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Update the isLoggedIn state
    setIsLoggedIn(false);
    // Hide the UserProfile component
    setIsClicked(false);
    // Navigate back to the login page
    navigate("/login");
    toast.success("Logout successfull");
  };
  if (!isLoggedIn) {
    return <p>You must login first</p>;
  }
  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">
          Admin Profile
        </p>
        <button
          className=" text-2xl p-3 w-undefined hover:drop-shadow-xl hover:bg-light-gray"
          type="button"
          style={{ color: `rgb(153, 171, 180)`, borderRadius: `50%` }}
          onClick={() => handleClick()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img className="rounded-full h-24 w-24" src={avatar}></img>

        <div>
          <p class="font-semibold text-xl dark:text-gray-200"> ADMIN </p>
          <p class="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            Administrator{" "}
          </p>
          <p class="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            info@shop.com{" "}
          </p>
        </div>
      </div>
      {/* Mấy cái cần implement để sau này có thể chỉnh user profile */}
      {/* <div>
            <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
                <button className=" text-xl rounded-lg p-3 hover:bg-light-gray" type="button" style={{color: `rgb(3, 201, 215)`, backgroundColor: `rgb(229,250, 251)`}}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"></path></svg>
                </button>

                <div>

                <p class="font-semibold dark:text-gray-200 ">My Profile</p>
                <p class="text-gray-500 text-sm dark:text-gray-400"> Account Settings </p>
                </div>
            </div>
            <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
                <button className="  text-xl rounded-lg p-3 hover:bg-light-gray" type="button" style={{color: `rgb(0, 194, 146)`, backgroundColor: `rgb(235,250, 242)`}}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"></path></svg>    
                </button>

                <div>

                <p class="font-semibold dark:text-gray-200 ">My Profile</p>
                <p class="text-gray-500 text-sm dark:text-gray-400"> Account Settings </p>
                </div>
            </div>
            <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
                <button className=" text-xl rounded-lg p-3 hover:bg-light-gray" type="button" style={{color: `rgb(255, 244, 229)`, backgroundColor: `rgb(254, 201, 15)`}}>
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </button>

                <div>

                <p class="font-semibold dark:text-gray-200 ">My Profile</p>
                <p class="text-gray-500 text-sm dark:text-gray-400"> Account Settings </p>
                </div>
            </div>
          </div> */}

      <div className="mt-5">
        <button
          className=" text-undefined p-3 w-full hover:drop-shadow-xl hover:bg-undefined"
          type="button"
          style={{
            backgroundColor: `rgb(3, 201, 215)`,
            color: ` white`,
            borderRadius: ` 10px`,
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
