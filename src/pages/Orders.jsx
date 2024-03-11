import React, { useEffect, useRef, useState } from "react";
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

import {
  ordersData,
  contextMenuItems,
  ordersGrid,
  ordersSample,
} from "../data/dummy";
import { axiosPrivate, axiosPublic } from "../api/axiosInstance";
import { GET_ALL_ORDERS, DATA_OF_ORDERS } from "../api/apiConstants";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../components";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const Orders = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
    useStateContext();
  const [orders, setOrders] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isMounted = useRef(false); // Add this line
  const toolbarOptions = ["Add", "Edit", "Update", "Cancel"];
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
  // CUSTOME STATUS
  // const orderStatus = ['Cancelled','Completed'].map((status, index) => ({ id: index, status }));
  // CUSTOM STATUS
  const orderStatus = [{ status: true }, { status: false }];
  const statusTemplate = (field) => {
    if (field && field.status !== undefined) {
      return (
        <div>
          <span>{field.status}</span>
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
  //Status helper
  const getStatusId = (statusName) => {
    console.log("Status name: ", statusName); // Log the status name
    console.log("Order status: ", orderStatus); // Log the order status array
    const status = orderStatus.find((status) => status.status === statusName);
    return status.id ? status.id : 0; // Default to 0 if the status name is not found
  };

  useEffect(() => {
    isMounted.current = true; // Set the ref to true when the component mounts
    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get(GET_ALL_ORDERS);
        if (response.status === 200 && isMounted.current) {
          console.log("Order list: ", response.data);
          const orderData = modifyOrderData(response.data);
          setOrders(orderData);
          setDataLoaded(true);
          console.log("Orders state: ", orders);
        }
      } catch (error) {
        console.error("Error fetching data from API: ", error);
      }
    };

    getOrders();
    return () => {
      isMounted.current = false; // Set the ref to false when the component unmounts
    };
  }, []);

  const modifyOrderData = (data) => {
    let ordersRes = data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    return ordersRes;
  };

   //HANDLE UPDATE
   const updateOrderInState = (oldData, newData) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) =>
        order.orderID === oldData.orderID ? { ...oldData, ...newData } : order
      );
    });
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
        await axiosPrivate.post(DATA_OF_ORDERS, args.data);
      } else if (args.action === "edit") {
        // Ensure args.data includes a 'command' field and 'status' is an integer
        const data = {
          orderID: args.data.orderID,
          totalPrice: args.data.totalPrice,
          totalItem: args.data.totalItem,
          orderId_PayOS: args.data.orderId_PayOS,
          patientId: args.data.patientId,
          status: args.data.status,
          // patient: args.data.patient,
          // orderDetails: args.data.orderDetails,
          // createdBy: args.data.createdBy,
          // createdDate: args.data.createdDate,
          // modifiedBy: args.data.modifiedBy,
          // lastModifiedDate: args.data.lastModifiedDate,
        };
        console.log("Data: ", data);
        console.log("Status:", args.data.status);
        // Send a PUT request to update an existing order

        try {
          // Before sending the PUT request, find the order in the state that you're about to update
          const orderToUpdate = orders.find(
            (order) => order.orderID === args.data.orderID
          );
          await axiosPrivate.put(DATA_OF_ORDERS, data);
          updateOrderInState(orderToUpdate, data);
          toast.success("Update Order successfully!");
        } catch (error) {
          if (error.response) {
            console.error(error.response.data); // Log the server's error message
            toast.error("Update Order failed!");
          } else {
            console.error(error.message); // Log the error message
            toast.error("Update Order failed!");
          }
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    } else if (args.requestType === "delete") {
      console.log(args.data[0].orderID);
      const data = {
        id: args.data[0].orderID,
      };
      console.log("DELETE Order id: ", data);
      // Send a DELETE request to delete an order
      try {
        await axiosPrivate.delete(`${DATA_OF_ORDERS}/${args.data[0].orderID}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderID !== args.data[0].orderID)
        );
      } catch (error) {
        if (error.response) {
          console.error(error.response.data); // Log the server's error message
        } else {
          console.error(error.message); // Log the error message
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    }
  };
  function ddChange() {
    gridInstance.editSettings.newRowPosition = dropDownInstance.value;
  }

  

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: true,
    mode: "Dialog",
  };
 

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('User must login first');
      navigate('/login');
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ToastContainer />
      <Header category="Page" title="Orders" />
      {dataLoaded ? (
        <GridComponent
          id="gridcomp"
          dataSource={orders}
          allowPaging={true}
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          editSettings={editing}
          toolbar={toolbarOptions}
          ref={(grid) => (gridInstance = grid)}
          pageSettings={pageSettings}
          actionBegin={actionBegin.bind(this)}
          width="100%"
        >
          <ColumnsDirective>
            <ColumnDirective
              field="orderID"
              headerText="orderID"
              width="120"
              textAlign="Center"
              isPrimaryKey={true}
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="totalPrice"
              headerText="totalPrice"
              width="120"
              textAlign="Center"
              allowEditing={false}
              format="C2"
              editType="numericedit"
            ></ColumnDirective>
            <ColumnDirective
              field="totalItem"
              headerText="totalItem"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="status"
              headerText="Status"
              width="120"
              textAlign="Right"
              editType="dropdownedit"
              edit={{
                params: {
                  dataSource: orderStatus,
                  fields: { value: "status" },
                },
              }}
            ></ColumnDirective>
            <ColumnDirective
              field="orderId_PayOS"
              headerText="orderId_PayOS"
              width="140"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="patientId"
              headerText="patientId"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
            {/* <ColumnDirective
              field="patient"
              headerText="patient"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            {/* <ColumnDirective
              field="orderDetails"
              headerText="orderDetails"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            {/* <ColumnDirective
              field="createdBy"
              headerText="createdBy"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            <ColumnDirective
              field="createdDate"
              headerText="createdDate"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
            {/* <ColumnDirective
              field="modifiedBy"
              headerText="modifiedBy"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            <ColumnDirective
              field="lastModifiedDate"
              headerText="lastModifiedDate"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
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
export default Orders;
