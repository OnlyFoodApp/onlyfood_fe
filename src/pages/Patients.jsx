import React, { useState, useEffect, useRef } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import axios from "axios"; // Import Axios
import { axiosPrivate } from "../api/axiosInstance";
import { GET_ALL_PATIENTS, DATA_OF_PATIENTS } from "../api/apiConstants";
import { data } from "../data/datasource";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { contextMenuItems } from "../data/dummy";
const Patients = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
    useStateContext();
  const [patients, setPatients] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isMounted = useRef(false); // Add this line
  const navigate = useNavigate();
  //TEST
  const toolbarOptions = ["Add", "Edit", "Update","Delete", "Cancel"];
  const editparams = { params: { popupHeight: "300px" } };
  const validationRule = { required: true };
  const customeridRules = { required: true, number: true };
  const pageSettings = { pageCount: 5 };
  const format = { type: "dateTime", format: "M/d/y hh:mm a" };
  let gridInstance;
  let dropDownInstance;
  const droplist = [
    { text: "Top", value: "Top" },
    { text: "Bottom", value: "Bottom" },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("User must login first");
      navigate("/login");
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  const modifyPatientData = (data) => {
    let patientRes = data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    return patientRes;
  };

  useEffect(() => {
    isMounted.current = true; // Set the ref to true when the component mounts

    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(GET_ALL_PATIENTS);
        if (response.status === 200 && isMounted.current) {
          // Check if the component is still mounted
          console.log("danh sách patients: ", response.data);
          const patientData = modifyPatientData(response.data);
          setPatients(patientData);
          setDataLoaded(true);
          console.log("patients :", patients);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        toast.error("Cannot get the data please refresh or log back in!");
      }
    };

    fetchData();

    return () => {
      isMounted.current = false; // Set the ref to false when the component unmounts
    };
  }, []);
  // CUSTOM genderStatus
  const genderStatus = [0, 1, 2].map((gender, index) => ({
    id: index,
    gender,
  }));
  const statusTemplate = (field) => {
    if (field && field.gender !== undefined) {
      const gender = genderStatus.find((status) => status.id === field.gender);
      const genderMap = {
        0: "Male",
        1: "Female",
        2: "Others",
      };
      console.log("GENDER UI ", gender);
      return (
        <div>
          <span>{gender ? genderMap[gender.gender] : "Unknown"}</span>
        </div>
      );
    } else {
      return (
        <div>
          <span>Unknown</span>
        </div>
      );
    }
  };

  
  //HANDLE UPDATE
  const updatePatientInState = (oldData, newData) => {
    setPatients((prevPatient) => {
      return prevPatient.map((patient) =>
        patient.patientID === oldData.patientID
          ? { ...oldData, ...newData }
          : patient
      );
    });
  };
  //Status helper
  const getStatusId = (statusName) => {
    console.log("Status name: ", statusName); // Log the status name
    console.log("Gender status: ", genderStatus); // Log the order status array
    const status = genderStatus.find((status) => status.gender === statusName);
    return status ? status.id : null;
  };
  // CRUD
  const actionBegin = async (args) => {
    if (args.data) {
      console.log("DATA: \n", args.data);
      console.log("ROW DATA: \n", args.rowData);
    }

    if (args.requestType === "save") {
      if (args.action === "add") {
        // Send a POST request to add a new order
        await axiosPrivate.post(DATA_OF_PATIENTS, args.data);
      } else if (args.action === "edit") {
        // Ensure args.data includes a 'command' field and 'status' is an integer
        const data = {
          patientID: args.data.patientID,
          firstName: args.data.firstName,
          lastName: args.data.lastName,
          dateOfBirth: args.data.dateOfBirth,
          gender: args.data.gender,
          phoneNumber: args.data.phoneNumber,
          address: args.data.address,
          // patient: args.data.patient,
          // orderDetails: args.data.orderDetails,
          // createdBy: args.data.createdBy,
          // createdDate: args.data.createdDate,
          // modifiedBy: args.data.modifiedBy,
          // lastModifiedDate: args.data.lastModifiedDate,
        };
        const genderId =
          typeof args.data.gender === "number"
            ? getStatusId(args.data.gender)
            : args.data.gender;
        if (genderId !== null) {
          data.gender = genderId;
        }
        console.log("Data: ", data);
        console.log("gender:", args.data.gender);
        // Send a PUT request to update an existing order

        try {
          // Before sending the PUT request, find the order in the state that you're about to update
          const patientToUpdate = patients.find(
            (patient) => patient.patientID === args.data.patientID
          );
          await axiosPrivate.put(DATA_OF_PATIENTS, data);
          updatePatientInState(patientToUpdate, data);
          toast.success("Update Patient successfully!");
        } catch (error) {
          if (error.response) {
            console.error(error.response.data); // Log the server's error message
            toast.error("Update Patient failed!");
          } else {
            console.error(error.message); // Log the error message
            toast.error("Update Patient failed!");
          }
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    } else if (args.requestType === "delete") {
      console.log(args.data[0].patientID);
      const data = {
        id: args.data[0].patientID,
      };
      console.log("DELETE Order id: ", data);
      // Send a DELETE request to delete an order
      try {
        await axiosPrivate.delete(
          `${DATA_OF_PATIENTS}/${args.data[0].patientID}`
        );
        setPatients((prevOrders) =>
          prevOrders.filter(
            (patient) => patient.patientID !== args.data[0].patientID
          )
        );
        toast.success("Update Patient successfully!");
      } catch (error) {
        if (error.response) {
          console.error(error.response.data); // Log the server's error message
          toast.error("Update Patient failed!");
        } else {
          console.error(error.message); // Log the error message
          toast.error("Update Patient failed!");
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    }
  };

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: true,
    mode: "Dialog",
  };

  return (
    //Mẫu style vui lòng search customersData , customersGrid và Git: https://github.com/adrianhajdin/project_syncfusion_dashboard/blob/main/src/pages/Customers.jsx
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ToastContainer />
      <Header category="Page" title="Patients" />
      {dataLoaded ? (
        //TESTING
        <GridComponent
          id="gridcomp"
          dataSource={patients}
          allowPaging={true}
          allowSorting
          allowExcelExport
          allowPdfExport
          editSettings={editing}
          contextMenuItems={contextMenuItems}
          toolbar={toolbarOptions}
          ref={(grid) => (gridInstance = grid)}
          pageSettings={pageSettings}
          actionBegin={actionBegin.bind(this)}
          width="100%"
        >
          <ColumnsDirective>
            <ColumnDirective
              field="patientID"
              headerText="PatientID"
              width="120"
              textAlign="Center"
              isPrimaryKey={true}
            ></ColumnDirective>
            {/* <ColumnDirective field='createdDate' headerText='CreatedDate' width='120' textAlign='Center' allowEditing={false}></ColumnDirective> */}
            <ColumnDirective
              field="firstName"
              headerText="First Name"
              width="120"
              textAlign="Center"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="lastName"
              headerText="Last Name"
              textAlign="Center"
              width="120"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="dateOfBirth"
              headerText="Date Of Birth"
              textAlign="Center"
              width="120"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="gender"
              headerText="Gender"
              textAlign="Center"
              width="120"
              editType="dropdownedit"
              template={statusTemplate}
              edit={{
                params: {
                  dataSource: genderStatus,
                  fields: { value: "gender" },
                },
              }}
            ></ColumnDirective>
            <ColumnDirective
              field="phoneNumber"
              headerText="PhoneNumber"
              textAlign="Center"
              width="120"
            ></ColumnDirective>
            <ColumnDirective
              field="address"
              headerText="Address"
              textAlign="Center"
              width="120"
            ></ColumnDirective>
            {/* <ColumnDirective field='customerPackages' headerText='CustomerPackages' textAlign='Center' width='120' editType='dropdownedit'></ColumnDirective> */}
            {/* <ColumnDirective field='lastModifiedDate' headerText='LastModifiedDate' textAlign='Center' width='120'allowEditing={false}></ColumnDirective> */}
          </ColumnsDirective>
          <Inject
            services={[
              Toolbar,
              Resize,
              Sort,
              ContextMenu,
              Filter,
              Page,
              ExcelExport,
              Edit,
              PdfExport,
            ]}
          />
        </GridComponent>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Patients;
