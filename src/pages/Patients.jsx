import React, { useState, useEffect, useRef } from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { Group, Inject, Page, Sort } from "@syncfusion/ej2-react-grids";
import axios from "axios"; // Import Axios
import { axiosPrivate } from "../api/axiosInstance";
import { GET_ALL_PATIENTS } from "../api/apiConstants";
import { data } from "../data/datasource";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const Patients = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
    useStateContext();
  const [patients, setPatients] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isMounted = useRef(false); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('User must login first');
      navigate('/login');
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  useEffect(() => {
    isMounted.current = true; // Set the ref to true when the component mounts

    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(GET_ALL_PATIENTS);
        if (response.status === 200 && isMounted.current) { // Check if the component is still mounted
          setPatients(response.data);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false; // Set the ref to false when the component unmounts
    };
  }, []);


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ToastContainer/>
      <Header category="Page" title="Patients" />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {/* <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-all-search" class="sr-only">
                    checkbox
                  </label>
                </div>
              </th> */}
              {/* <th scope="col" class="px-6 py-3">
                Id
              </th> */}
              <th style={{width: '300px', textAlign: 'center'}} scope="col" class="px-6 py-3">
                Full Name
              </th>
              <th style={{width: '300px', textAlign: 'center'}} scope="col" class="px-6 py-3">
                Address
              </th>
              <th style={{width: '300px', textAlign: 'center'}} scope="col" class="px-6 py-3">
                Gender
              </th>
              <th style={{width: '300px', textAlign: 'center'}} scope="col" class="px-6 py-3">
                DateOfBirth
              </th>
              <th style={{width: '300px', textAlign: 'center'}} scope="col" class="px-6 py-3">
                PhoneNumber
              </th>
              <th style={{width: '300px', textAlign: 'center'}} scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {dataLoaded ? (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={`patients-${index}`}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover-bg-gray-600"
              >
                {/* <td class="w-4 p-4">
                  <div class="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-table-search-1" class="sr-only">
                      checkbox
                    </label>
                  </div>
                </td> */}
                {/* <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index}
                </th> */}
                <td style={{width: '300px', textAlign: 'center'}} class="px-6 py-3">{`${patient.firstName} ${patient.lastName}`}</td>
                <td style={{width: '300px', textAlign: 'center'}} class="px-6 py-3">{patient.address}</td>
                <td style={{width: '300px', textAlign: 'center'}} class="px-6 py-3">{patient.gender}</td>
                <td style={{width: '300px', textAlign: 'center'}} class="px-6 py-3">{patient.dateOfBirth}</td>
                <td style={{width: '300px', textAlign: 'center'}} class="px-6 py-3">{patient.phoneNumber}</td>
                <td style={{width: '300px', textAlign: 'center'}} class="flex items-center justify-center px-6 py-4 space-x-3">
                  <a
                    href="#"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    class="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Remove
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Patients;
