import React, { useState, useEffect } from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { Group, Inject, Page, Sort } from "@syncfusion/ej2-react-grids";
import axios from "axios"; // Import Axios
import { axiosPrivate } from "../api/axiosInstance";
import { GET_ALL_PILLS } from "../api/apiConstants";
import { data } from "../data/datasource";
import { Header } from "../components";
const Pills = () => {
  //call api get data về

  const [pills, setPills] = useState([]); // State để lưu dữ liệu từ API
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    // Create a new CancelToken
    const source = axios.CancelToken.source();
  
    // Make the request, passing the CancelToken
    axiosPrivate.get(GET_ALL_PILLS, { cancelToken: source.token })
      .then(response => {
        if (response.status === 200) {
          console.log("danh sách : ", response.data);
          // Lưu dữ liệu API vào state
          setPills(response.data);
          setDataLoaded(true);
          console.log("pills :", pills);
        }
      })
      .catch(error => {
        // If the request was cancelled, log a message to the console
        if (axios.isCancel(error)) {
          console.log('Request cancelled:', error.message);
        } else {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      });
  
    // Cancel the request if the component unmounts
    return () => {
      source.cancel('Component unmounted');
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Pills" />
      {dataLoaded ? (
        <div className="container mt-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pills.map((pill, index) => (
              <div
                key={`pills-${index}`}
                className="card m-2 cursor-pointer border border-gray-400 rounded-lg hover:shadow-md hover:border-opacity-0 transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="m-3">
                  <h2 className="text-md mb-2 max-w-1 font-bold">
                    {pill.pillName}
                  </h2>
                  <p className="mb-2 font-semibold">
                    Dosage per day:
                    <span className="text-sm text-teal-900 font-mono bg-teal-100 rounded-full px-2 animate-pulse">
                      {`${pill.dosagePerDay}`}
                    </span>
                  </p>

                  <p className="mb-2 font-semibold">
                    Quantity Per Dose:
                    <span className="text-sm text-teal-900 font-mono bg-teal-100 rounded-full px-2 animate-pulse">
                      {`${pill.quantityPerDose}`}
                    </span>
                  </p>

                  <p className="mb-2 font-semibold">
                    Quantity:
                    <span className="text-sm text-gray-900 font-mono bg-gray-100 rounded-full px-2 animate-pulse">
                      {`${pill.quantity}`}
                    </span>
                  </p>
                  <p className="mb-2 font-semibold">
                    Unit:
                    <span className="text-sm text-gray-900 font-mono bg-gray-100 rounded-full px-2 animate-pulse">
                      {`${pill.unit}`}
                    </span>
                  </p>
                  <div className="flex justify-center items-center">
                    <p className="mb-2 font-semibold">
                      Morning:
                      <span className="text-xs text-gray-900 font-mono bg-yellow-100 rounded-full px-2 animate-pulse">
                        {`${pill.morning}`}
                      </span>
                    </p>
                    <p className="mb-2 font-semibold">
                      Afternoon:
                      <span className="text-xs text-gray-900 font-mono bg-yellow-100 rounded-full px-2 animate-pulse">
                        {`${pill.afternoon}`}
                      </span>
                    </p>
                    <p className="mb-2 font-semibold">
                      Evening:
                      <span className="text-xs text-gray-900 font-mono bg-yellow-100 rounded-full px-2 animate-pulse">
                        {`${pill.evening}`}
                      </span>
                    </p>
                  </div>

                  <p className="mb-2 font-semibold text-center">
                    Status:
                    <span className="text-sm text-gray-900 font-mono bg-gray-100 rounded-full px-2 animate-pulse">
                      {`${pill.status}`}
                    </span>
                  </p>

                  <p className="font-light font-mono text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">
                    <span className="font-semibold">Description: </span>
                    {pill.pillDescription}
                  </p>
                </div>
                <button className="text-sm text-blue-600 font-mono bg-teal-100 inline-block rounded-full px-4 m-2 align-text-bottom float-left">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Pills;
