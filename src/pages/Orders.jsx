import React, { useEffect, useState } from "react";
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

import {
  ordersData,
  contextMenuItems,
  ordersGrid,
  ordersSample,
} from "../data/dummy";
import { axiosPrivate, axiosPublic } from "../api/axiosInstance";
import { GET_ALL_ORDERS,DATA_OF_ORDERS } from "../api/apiConstants";
import { Header } from "../components";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
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
// CUSTOME STATUS 
const orderStatus = ['Cancelled','Pending','Delivered','In Progress','Completed'].map((status, index) => ({ id: index, status }));
const statusTemplate = (field) => {
  if (field && field.status !== undefined) {
    return (
      <div>
        <span>{field.status.status}</span>
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
    // CRUD
    const actionBegin = async (args) => {
      if (args.data) {
        console.log("DATA: \n",args.data);
        console.log("ROW DATA: \n", args.rowData);
      }
    
      if (args.requestType === 'save') {
        if (args.action === 'add') {
          // Send a POST request to add a new order
          await axiosPublic.post(DATA_OF_ORDERS, args.data);
        } else if (args.action === 'edit') {
          // Ensure args.data includes a 'command' field and 'status' is an integer
          const data = {
            id: args.data.id,
            orderDate: args.data.orderDate,
            customerId: args.data.customerId,
            paymentId: args.data.paymentId,
            expectedDeliveryTime: args.data.expectedDeliveryTime,
            totalAmount: args.data.totalAmount,
            numberOfItems: args.data.numberOfItems,
            discount: args.data.discount,
            status: typeof args.data.status === 'string' ? getStatusId(args.data.status) : args.data.status.id,
          };
          console.log("Data: ", data);
          console.log("Status:", args.data.status);
          // Send a PUT request to update an existing order

          try {
            await axiosPublic.put(`${DATA_OF_ORDERS}/${args.data.id}`, data);
            window.location.reload();
          } catch (error) {
            if (error.response) {
              console.error(error.response.data); // Log the server's error message
            } else {
              console.error(error.message); // Log the error message
            }
          }
        }
        args.cancel = true; // Cancel the grid update because we've already updated the data source
      } else if (args.requestType === 'delete') {
        console.log(args.data[0].id);
        const data = {
          id: args.data[0].id,
        };
        console.log("DELETE Order id: ", data);
        // Send a DELETE request to delete an order
        // await axiosPublic.delete(`${DATA_OF_ORDERS}/${args.data[0].id}`, data);
        try {
          await axiosPublic.delete(`${DATA_OF_ORDERS}/${args.data[0].id}`);
          window.location.reload();
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


  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosPublic.get(GET_ALL_ORDERS);
        if (response.status === 200) {
          console.log("Order list: ", response.data.data);
          const orderData = modifyOrderData(response.data.data);
          setOrders(orderData);
          setDataLoaded(true);
          console.log("Orders: ", orders);
        }
      } catch (error) {
        console.error("Error fetching data from API: ", error);
      }
    };

    getOrders();
  }, []);

  const modifyOrderData = (data) => {
    let ordersRes = data.map((item, index) => {

      return {
        ...item,
        index: index + 1,
        status: orderStatus[item.status],
        // expectedDeliveryTime: new Date(
        //   item.expectedDeliveryTime
        // ).toLocaleDateString(),
      };
    });
    return ordersRes;
  };

  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Dialog' };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />

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
        ref={grid => gridInstance = grid}
        pageSettings={pageSettings}
        actionBegin={actionBegin.bind(this)}
        width="100%"
      >
        <ColumnsDirective>
              <ColumnDirective field='id' headerText='Order ID' width='120' textAlign='Right' isPrimaryKey={true}></ColumnDirective>
              <ColumnDirective field='customerId' headerText='Customer ID' width='120' textAlign='Right' allowEditing={false}></ColumnDirective>
              <ColumnDirective field='paymentId' headerText='paymentId' width='120' textAlign='Right' allowEditing={false}></ColumnDirective>
              <ColumnDirective field='customerName' headerText='Customer Name' width='120' allowEditing={false}></ColumnDirective>
              <ColumnDirective field='expectedDeliveryTime' headerText='ExpectedDeliveryTime' editType='datetimepickeredit' width='200'></ColumnDirective>
              <ColumnDirective field='orderDate' headerText='Order Date' editType='datetimepickeredit' width='120'></ColumnDirective>
              <ColumnDirective field='totalAmount' headerText='Total Amount' width='120' format='C2' textAlign='Right' editType='numericedit'></ColumnDirective>
              <ColumnDirective field='numberOfItems' headerText='Number of Items' width='120' textAlign='Right' editType='numericedit'></ColumnDirective>
              <ColumnDirective field='discount' headerText='Discount' width='120' format='C2' textAlign='Right' editType='numericedit'></ColumnDirective>
              <ColumnDirective field='status' headerText='Status' width='120' textAlign='Right' editType='dropdownedit' template={statusTemplate} edit={{ params: {  dataSource: orderStatus, fields: { value: 'status' }  } }}></ColumnDirective>
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
    </div>
  );
};
export default Orders;
