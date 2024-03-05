import React, { useEffect, useState } from "react";
import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import IconVietQR, { SparklineAreaData, dropdownData } from "../data/dummy";
import { FaCircle, FaUserInjured } from "react-icons/fa";
import { useStateContext } from "../contexts/ContextProvider";
import {
  GET_TOTAL_EXPENSES_PER_MONTHS,
  GET_TOTAL_REVENUE_PER_MONTHS,
  GET_TOTAL_USERS,
  GET_TOTAL_PACKAGES_SOLD,
  GET_TOTAL_PATIENTS,
} from "../api/apiConstants";
import axios from "axios";
import { axiosPrivate } from "../api/axiosInstance";
import { BsBoxSeam, BsCurrencyDollar, BsShield } from "react-icons/bs";
import { FiBarChart, FiCreditCard } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { MdOutlineSupervisorAccount } from "react-icons/md";
const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: "Time", value: "Id" }}
      style={{ border: "none", color: currentMode === "Dark" && "white" }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);
const Onlyfood = () => {
  const { currentColor, currentMode } = useStateContext();

  //call api get data về
  const [totalExpensePerMonths, setTotalExpensePerMonths] = useState([]); // State để lưu dữ liệu từ API
  const [totalRevenuePerMonths, setTotalRevenuePerMonths] = useState([]);
  const [totalUser, setTotalUser] = useState([]);
  const [totalPackageSold, setTotalPackageSold] = useState([]);
  const [totalPatient, setTotalPatient] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Create a new CancelToken
    const source = axios.CancelToken.source();

    // Make the request, passing the CancelToken
    axiosPrivate
      .get(GET_TOTAL_EXPENSES_PER_MONTHS, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("Tổng expensePerMonths : ", response.data);
          // Lưu dữ liệu API vào state
          setTotalExpensePerMonths(response.data);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        // If the request was cancelled, log a message to the console
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      });

    axiosPrivate
      .get(GET_TOTAL_REVENUE_PER_MONTHS, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("Tổng revenuePerMonths : ", response.data);
          setTotalRevenuePerMonths(response.data);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error fetching data from API:", error);
        }
      });

    axiosPrivate
      .get(GET_TOTAL_USERS, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("Tổng totalUser : ", response.data);
          setTotalUser(response.data);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error fetching data from API:", error);
        }
      });

    axiosPrivate
      .get(GET_TOTAL_PACKAGES_SOLD, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("Tổng packageSold : ", response.data);
          setTotalPackageSold(response.data);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error fetching data from API:", error);
        }
      });

    axiosPrivate
      .get(GET_TOTAL_PATIENTS, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("Tổng patients : ", response.data);
          setTotalPatient(response.data);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error fetching data from API:", error);
        }
      });

    // Cancel the request if the component unmounts
    return () => {
      source.cancel("Component unmounted");
    };
  }, []);

  //For earning Data at the top of the page
  let earningData = [];
  if (dataLoaded) {
    earningData = [
      {
        icon: <MdOutlineSupervisorAccount />,
        amount: `${totalUser} accounts`,
        // percentage: "-4%",
        title: "Total Users",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "red-600",
      },
      {
        icon: <BsBoxSeam />,
        amount: `${totalPackageSold} packages`,
        // percentage: "+23%",
        title: "Plan sold",
        iconColor: "rgb(255, 244, 229)",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
      },
      {
        icon: <FiBarChart />,
        amount: `$${totalRevenuePerMonths}`,
        // percentage: "+38%",
        title: "Total Sales",
        iconColor: "rgb(228, 106, 118)",
        iconBg: "rgb(255, 244, 229)",

        pcColor: "green-600",
      },
      {
        icon: <FaUserInjured />,
        amount: `${totalPatient} people`,
        // percentage: "-12%",
        title: "Total Patients",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
        pcColor: "red-600",
      },
    ];
  } else {
    earningData = [
      {
        icon: <MdOutlineSupervisorAccount />,
        amount: `Loading...`,
        // percentage: "-4%",
        title: "Total Users",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "red-600",
      },
      {
        icon: <BsBoxSeam />,
        amount: `Loading...`,
        // percentage: "+23%",
        title: "Plan sold",
        iconColor: "rgb(255, 244, 229)",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
      },
      {
        icon: <FiBarChart />,
        amount: `Loading...`,
        // percentage: "+38%",
        title: "Total Sales",
        iconColor: "rgb(228, 106, 118)",
        iconBg: "rgb(255, 244, 229)",

        pcColor: "green-600",
      },
      {
        icon: <FaUserInjured />,
        amount: `Loading...`,
        // percentage: "-12%",
        title: "Total Patients",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
        pcColor: "red-600",
      },
    ];
  }
  //For pie chart Data of Total Sale/Year
  const ecomPieChartData = [
    { x: "2024", y: `${totalPackageSold}`, text: "100%" },
    // { x: '2025', y: 0, text: '0%' },
    // { x: '2026', y: 0, text: '0%' },
    // { x: '2027', y: 0, text: '0%' },
  ];

  //For transaction display & icon
  let recentTransactions = [];
  if (dataLoaded) {
    recentTransactions = [
      {
        icon: <IconVietQR />, // that I can Import it right here?
        amount: `+$${totalRevenuePerMonths}`,
        title: "PayOS",
        desc: "VietQR/ Napas247",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "green-600",
      },
      {
        icon: <BsShield />,
        amount: "Not available yet",
        desc: "Bill Payment",
        title: "Wallet",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
        pcColor: "red-600",
      },
      {
        icon: <FiCreditCard />,
        amount: "Not available yet",
        title: "Credit Card",
        desc: "Money reversed",
        iconColor: "rgb(255, 244, 229)",
        iconBg: "rgb(254, 201, 15)",

        pcColor: "red-600",
      },
      {
        icon: <TiTick />,
        amount: "Not available yet",
        title: "Bank Transfer",
        desc: "Money Added",

        iconColor: "rgb(228, 106, 118)",
        iconBg: "rgb(255, 244, 229)",
        pcColor: "red-600",
      },
      {
        icon: <BsCurrencyDollar />,
        amount: "Not available yet",
        // percentage: "+38%",
        title: "Refund",
        desc: "Payment Sent",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "red-600",
      },
    ];
  } else {
    recentTransactions = [
      {
        icon: <IconVietQR />, // that I can Import it right here?
        amount: `Loading...`,
        title: "PayOS",
        desc: "VietQR/ Napas247",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "green-600",
      },
      {
        icon: <BsShield />,
        amount: "Loading...",
        desc: "Bill Payment",
        title: "Wallet",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
        pcColor: "red-600",
      },
      {
        icon: <FiCreditCard />,
        amount: "Loading...",
        title: "Credit Card",
        desc: "Money reversed",
        iconColor: "rgb(255, 244, 229)",
        iconBg: "rgb(254, 201, 15)",

        pcColor: "red-600",
      },
      {
        icon: <TiTick />,
        amount: "Loading...",
        title: "Bank Transfer",
        desc: "Money Added",
        iconColor: "rgb(228, 106, 118)",
        iconBg: "rgb(255, 244, 229)",
        pcColor: "red-600",
      },
      {
        icon: <BsCurrencyDollar />,
        amount: "Loading...",
        // percentage: "+38%",
        title: "Refund",
        desc: "Payment Sent",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "red-600",
      },
    ];
  }

  return (
    <div className="mt-12">
      {/* HOMEPAGE */}
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          {/* EARNING */}
          <div className="flex justify-between items-center">
            {dataLoaded ? (
              <div>
                <p className="font-bold text-green-400">Hello</p>
                <p className="text-2xl font-bold text-green-800">Admin 😁</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-green-400">Loading...</p>
                <p className="text-2xl font-bold text-green-800">
                  Please login again or reload 😥
                </p>
              </div>
            )}
          </div>
          {/* BUTTON */}
          <div className="mt-6 ">
            {/* <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              borderRadius="10px"
              size="md"
            /> */}
          </div>
        </div>
        {/* CARD */}
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {earningData.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl"
            >
              {/*[CARD] icon */}
              <button
                type="button"
                style={{
                  color: item.iconColor,
                  backgroundColor: item.iconBg,
                }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              {/*[CARD] text percent */}
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                {/* <span className={`text-sm text-item text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span> */}
              </p>
              {/*[CARD] title */}
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      {/* REVENUE SECTION*/}

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <FaCircle />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <FaCircle />
                </span>
                <span>Revenue</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className=" border-r-1 border-color m-4 pr-10">
              {/* Start RevernueUpdate API */}
              <div>
                <p>
                  {/* RevenueAmount */}
                  {dataLoaded ? (
                    <span className="text-3xl font-semibold">
                      {" "}
                      ${totalRevenuePerMonths}{" "}
                    </span>
                  ) : (
                    <span className="text-3xl font-semibold">
                      {" "}
                      Loading....{" "}
                    </span>
                  )}

                  {dataLoaded ? (
                    <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                      NET
                    </span>
                  ) : (
                    <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                      Please reloading...
                    </span>
                  )}
                </p>
                {dataLoaded ? (
                  <p className="text-gray-500 mt-1">Revenue</p>
                ) : (
                  <p className="text-gray-500 mt-1">Please reloading</p>
                )}
              </div>
              <div className="mt-8">
                {/* expenseAmount */}
                {dataLoaded ? (
                  <p className="text-3xl font-semibold">
                    {" "}
                    ${totalExpensePerMonths}{" "}
                  </p>
                ) : (
                  <p className="text-3xl font-semibold"> Loading.... </p>
                )}

                {dataLoaded ? (
                  <p className="text-gray-500 mt-1">Expense</p>
                ) : (
                  <p className="text-gray-500 mt-1">Please reloading</p>
                )}
              </div>
              {/* End RevernueUpdate API */}

              <div className="mt-5">
                {/* Start SparklineAreaData */}
                {/* <SparkLine
                  currentColor={currentColor}
                  id="line-sparkLine"
                  type="Line"
                  height="80px"
                  width="250px"
                  data={SparklineAreaData}
                  color={currentColor}
                /> */}
                {/* End SparklineAreaData */}
              </div>
              <div className="mt-10">
                {/* <Button
                  color="white"
                  bgColor={currentColor}
                  text="Download Report"
                  borderRadius="10px"
                /> */}
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>

        <div>
          <div
            className=" rounded-2xl  md:w-400 p-4 m-3 "
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Earnings</p>

              <div>
                <p className="text-2xl text-red-600 font-semibold mt-8">
                  Not enough data
                </p>
                <p className="text-gray-200">Monthly revenue</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine
                currentColor={currentColor}
                id="column-sparkLine"
                height="100px"
                type="Column"
                data={SparklineAreaData}
                width="320"
                color="rgb(242, 252, 253)"
              />
            </div>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              {dataLoaded ? (
                <>
                  <p className="text-2xl font-semibold ">
                    {totalRevenuePerMonths}$
                  </p>
                  <p className="text-gray-400">Yearly sales</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-semibold ">Loading...</p>
                  <p className="text-gray-400">Please reloading...</p>
                </>
              )}
            </div>

            <div className="w-40">
              <Pie
                id="pie-chart"
                data={ecomPieChartData}
                legendVisiblity={false}
                height="160px"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-10 m-4 flex-wrap justify-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
            <div className="flex justify-between items-center gap-2">
              <p className="text-xl font-semibold">Transactions</p>
              <DropDown currentMode={currentMode} />
            </div>
            <div className="mt-10 w-72 md:w-400 ">
              {dataLoaded ? (
                <>
                  {recentTransactions.map((item) => (
                    <div key={item.title} className="flex justify-between mt-4">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          style={{
                            color: item.iconColor,
                            backgroundColor: item.iconBg,
                          }}
                          className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                        >
                          {item.icon}
                        </button>
                        <div>
                          <p className="text-md font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                      <p className={`text-${item.pcColor}`}>{item.amount}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p>Please Reloading...</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-5 border-t-1 border-color">
              <div className="mt-3">
                {/* <Button
                  color="white"
                  bgColor={currentColor}
                  text="Add"
                  borderRadius="10px"
                /> */}
              </div>

              {/* <p className="text-gray-400 text-sm">36 Recent Transactions</p> */}
            </div>
          </div>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
            <div className="flex justify-between items-center gap-2 mb-10">
              <p className="text-xl font-semibold">User/Months</p>
              <DropDown currentMode={currentMode} />
            </div>
            <div className="md:w-full overflow-auto">
              <LineChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onlyfood;
