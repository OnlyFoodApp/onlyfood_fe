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
import { GET_ALL_USERS, DATA_OF_USERS } from "../api/apiConstants";
import { useStateContext } from "../contexts/ContextProvider";
import { data } from "../data/datasource";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../components";
import { contextMenuItems } from "../data/dummy";
const Users = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
  useStateContext();
  const [users, setUsers] = useState([]); // State để lưu dữ liệu từ API
  const [dataLoaded, setDataLoaded] = useState(false);
  const isMounted = useRef(false); // Add this line
  const navigate = useNavigate();
  //TEST
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Cancel'];
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
    useEffect(() => {
      if (!isLoggedIn) {
        toast.error("User must login first");
        navigate("/login");
      }
    }, []); // Empty dependency array means this effect runs once after the initial render

    const modifyUserData = (data) => {
      let userRes = data.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      });
      return userRes;
    };
  

  //call api get data về
  useEffect(() => {
    isMounted.current = true; // Set the ref to true when the component mounts
  
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(GET_ALL_USERS);
        if (response.status === 200 && isMounted.current) {
          console.log("danh sách users: ", response.data);
          const userData = modifyUserData(response.data);
          setUsers(userData);
          setDataLoaded(true);
          console.log("users :", users);
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
  // CUSTOM UserStatus
  const userStatusIndex = [0, 1].map((userStatus, index) => ({
    id: index,
    userStatus,
  }));
  const UserStatusTemplate = (field) => {
    if (field && field.status !== undefined) {
      const userStatus = userStatusIndex.find((status) => status.id === field.status);
      const userStatusMap = {
        0: "Not Active",
        1: "Active",
      };
      console.log("userStatus UI ", userStatus);
      return (
        <div>
          <span>{userStatus ? userStatusMap[userStatus.userStatus] : "Unknown"}</span>
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
  // CUSTOM UserRole
  const userRoleIndex = [0, 1, 2].map((userRole, index) => ({
    id: index,
    userRole,
  }));
  const UserRoleTemplate = (field) => {
    if (field && field.role !== undefined) {
      const userRole = userRoleIndex.find((status) => status.id === field.role);
      const userRoleMap = {
        0: "Admin",
        1: "Doctor",
        2: "Patient",
      };
      console.log("userRole UI ", userRole);
      return (
        <div>
          <span>{userRole ? userRoleMap[userRole.userRole] : "Unknown"}</span>
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
  const updateUserInState = (oldData, newData) => {
    setUsers((prevUser) => {
      return prevUser.map((user) =>
      user.accountId === oldData.accountId
          ? { ...oldData, ...newData }
          : user
      );
    });
  };
  //userStatus helper
  const getUserStatusId = (statusName) => {
    console.log("Status name: ", statusName); // Log the status name
    console.log("userStatusIndex: ", userStatusIndex); 
    const status = userStatusIndex.find((status) => status.userStatus === statusName);
    return status ? status.id : null;
  };
  //userRoleStatus helper
  const getUserRoleStatusId = (statusName) => {
    console.log("Status name: ", statusName); // Log the status name
    console.log("userRoleIndex: ", userRoleIndex); 
    const status = userRoleIndex.find((status) => status.userRole === statusName);
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
        await axiosPrivate.post(DATA_OF_USERS, args.data);
      } else if (args.action === "edit") {
        // Ensure args.data includes a 'command' field and 'status' is an integer
        const data = {
          accountId: args.data.accountId,
          role: args.data.role,
          status: args.data.status,
         
        };
        //status
        const statusId =
          typeof args.data.status === "number"
            ? getUserStatusId(args.data.status)
            : args.data.status;
        if (statusId !== null) {
          data.status = statusId;
        }
        //role
        const roleId =
          typeof args.data.role === "number"
            ? getUserRoleStatusId(args.data.role)
            : args.data.role;
        if (statusId !== null) {
          data.role = roleId;
        }
        console.log("Data: ", data);
        console.log("User status:", args.data.status);
        console.log("User role:", args.data.role);
        // Send a PUT request to update an existing order

        try {
          // Before sending the PUT request, find the order in the state that you're about to update
          const userToUpdate = users.find(
            (user) => user.accountId === args.data.accountId
          );
          await axiosPrivate.put(DATA_OF_USERS, data);
          updateUserInState(userToUpdate, data);
          toast.success("Update User successfully!");
        } catch (error) {
          if (error.response) {
            console.error(error.response.data); // Log the server's error message
            toast.error("Update User failed!");
          } else {
            console.error(error.message); // Log the error message
            toast.error("Update User failed!");
          }
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    } else if (args.requestType === "delete") {
      console.log(args.data[0].accountId);
      const data = {
        id: args.data[0].accountId,
      };
      console.log("DELETE Order id: ", data);
      // Send a DELETE request to delete an order
      try {
        await axiosPrivate.delete(
          `${DATA_OF_USERS}/${args.data[0].accountId}`
        );
        setUsers((prevOrders) =>
          prevOrders.filter(
            (user) => user.accountId !== args.data[0].accountId
          )
        );
        toast.success("Update User successfully!");
      } catch (error) {
        if (error.response) {
          console.error(error.response.data); // Log the server's error message
          toast.error("Update User failed!");
        } else {
          console.error(error.message); // Log the error message
          toast.error("Update User failed!");
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    }
  };


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
        ref={(grid) => (gridInstance = grid)}
        pageSettings={pageSettings}
        actionBegin={actionBegin.bind(this)}
        width="100%"
      >
        <ColumnsDirective>
          <ColumnDirective field='accountId' headerText='AccountId' width='120' textAlign='Center' isPrimaryKey={true} allowEditing={false}></ColumnDirective>
          <ColumnDirective field='email' headerText='Email' width='120' textAlign='Center' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='password' headerText='Password' textAlign='Center' width='120' allowEditing={false}></ColumnDirective>
          <ColumnDirective field='role' headerText='Role' template={UserRoleTemplate}  textAlign='Center' width='120' editType='numericedit'></ColumnDirective>
          <ColumnDirective field='status' headerText='Status' template={UserStatusTemplate} textAlign='Center' width='120' editType='numericedit'></ColumnDirective>
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
