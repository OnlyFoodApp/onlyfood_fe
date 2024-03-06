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
  Toolbar
} from "@syncfusion/ej2-react-grids";
import axios from "axios"; // Import Axios
import { axiosPrivate } from "../api/axiosInstance";
import { GET_ALL_PATIENTS } from "../api/apiConstants";
import { data } from "../data/datasource";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { contextMenuItems } from "../data/dummy";
const Patients = () => {
  //TEST
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    const editparams = { params: { popupHeight: '300px' } };
    const validationRule = { required: true };
    const customeridRules = { required: true, number: true };
    const pageSettings = { pageCount: 5 };
    const format = { type: 'dateTime', format: 'M/d/y hh:mm a' };
    let gridInstance;
    let dropDownInstance;
    const droplist = [
        { text: 'Top', value: 'Top' },
        { text: 'Bottom', value: 'Bottom' }
    ];
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
          console.log("danh sách patients: ", response.data);
          setPatients(response.data);
          setDataLoaded(true);
          console.log("patients :", patients);
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

  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Dialog' };

  return (
     //Mẫu style vui lòng search customersData , customersGrid và Git: https://github.com/adrianhajdin/project_syncfusion_dashboard/blob/main/src/pages/Customers.jsx
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ToastContainer/>
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
        pageSettings={pageSettings}
        width="100%"
      >
        <ColumnsDirective>
          <ColumnDirective field='accountId' headerText='AccountId' width='120' textAlign='Center' isPrimaryKey={true}></ColumnDirective>
          <ColumnDirective field='createdDate' headerText='CreatedDate' width='120' textAlign='Center' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='firstName' headerText='First Name' width='120' textAlign='Center' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='lastName' headerText='Last Name' textAlign='Center' width='120' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='address' headerText='Address' textAlign='Center' width='120' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='gender' headerText='Gender' textAlign='Center' width='120' editType='dropdownedit'></ColumnDirective>
          <ColumnDirective field='phoneNumber' headerText='PhoneNumber' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='dateOfBirth' headerText='Date Of Birth' textAlign='Center' width='120' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='customerPackages' headerText='CustomerPackages' textAlign='Center' width='120' editType='dropdownedit'></ColumnDirective>
          <ColumnDirective field='lastModifiedDate' headerText='LastModifiedDate' textAlign='Center' width='120'allowEditing={false}></ColumnDirective>
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
