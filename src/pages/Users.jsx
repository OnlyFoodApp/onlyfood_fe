import React, { useState, useEffect } from "react";
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
import { GET_ALL_USERS } from "../api/apiConstants";
import { data } from "../data/datasource";
import { Header } from "../components";
import { contextMenuItems } from "../data/dummy";
const Users = () => {
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
  //call api get data về

  const [users, setUsers] = useState([]); // State để lưu dữ liệu từ API
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    // Create a new CancelToken
    const source = axios.CancelToken.source();
  
    // Make the request, passing the CancelToken
    axiosPrivate.get(GET_ALL_USERS, { cancelToken: source.token })
      .then(response => {
        if (response.status === 200) {
          console.log("danh sách : ", response.data);
          // Lưu dữ liệu API vào state
          setUsers(response.data);
          setDataLoaded(true);
          console.log("users :", users);
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

  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Dialog' };
  return (
    //Mẫu style vui lòng search customersData , customersGrid và Git: https://github.com/adrianhajdin/project_syncfusion_dashboard/blob/main/src/pages/Customers.jsx
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Account" />
    
      {dataLoaded ? (
        //TESTING
        <GridComponent
        id="gridcomp"
        dataSource={users}
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
          <ColumnDirective field='email' headerText='Email' width='120' textAlign='Center' isPrimaryKey={true} allowEditing={false}></ColumnDirective>
          <ColumnDirective field='password' headerText='Password' textAlign='Center' width='120' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='role' headerText='Role' textAlign='Center' width='120' editType='dropdownedit'></ColumnDirective>
          <ColumnDirective field='status' headerText='Status' textAlign='Center' width='120' editType='dropdownedit'></ColumnDirective>
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
      )
      }
      

    </div>
  );
};

export default Users;
