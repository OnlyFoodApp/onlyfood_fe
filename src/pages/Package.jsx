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
  loadCldr,
  setCulture,
  Internationalization,
  setCurrencyCode,
} from "@syncfusion/ej2-base";
import * as numberingSystems from "cldr-data/supplemental/numberingSystems.json";
import * as gregorian from "cldr-data/main/vi/ca-gregorian.json";
import * as numbers from "cldr-data/main/vi/numbers.json";
import * as timeZoneNames from "cldr-data/main/vi/timeZoneNames.json";
import * as numberingSystem from "cldr-data/supplemental/numberingSystems.json";
import * as currencyData from "cldr-data/main/vi/currencies.json";
loadCldr(
  numberingSystems,
  gregorian,
  numbers,
  timeZoneNames,
  numberingSystem,
  currencyData
);
setCulture("vi");
setCurrencyCode("VND");
const instance = new Internationalization();
const formatCurrency = (value) => {
  return (
    instance.formatNumber(value, { format: "C0", currency: "VND" }) + " VND"
  );
};

import {
  ordersData,
  contextMenuItems,
  ordersGrid,
  ordersSample,
} from "../data/dummy";
import { axiosPrivate, axiosPublic } from "../api/axiosInstance";
import {
  GET_ALL_CUSTOMER_PACKAGE,
  DATA_OF_CUSTOMER_PACKAGE,
  STATUS_OF_CUSTOMER_PACKAGE,
} from "../api/apiConstants";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../components";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const Packages = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
    useStateContext();
  const [packages, setPackages] = useState([]);
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
  // const packageStatus = ['Cancelled','Completed'].map((status, index) => ({ id: index, status }));
  // CUSTOM STATUS
  const packageStatus = [{ status: 0 }, { status: 1 }];
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
    console.log("Package status: ", packageStatus); // Log the order status array
    const status = packageStatus.find((status) => status.status === statusName);
    return status.id ? status.id : 0; // Default to 0 if the status name is not found
  };

  useEffect(() => {
    isMounted.current = true; // Set the ref to true when the component mounts
    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get(GET_ALL_CUSTOMER_PACKAGE);
        if (response.status === 200 && isMounted.current) {
          console.log("Package list: ", response.data);
          const packageData = modifyPackageData(response.data);
          setPackages(packageData);
          setDataLoaded(true);
          console.log("Packages state: ", packages);
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

  const modifyPackageData = (data) => {
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
    setPackages((prevOrders) => {
      return prevOrders.map((order) =>
        order.customerPackageId === oldData.customerPackageId
          ? { ...oldData, ...newData }
          : order
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
        await axiosPrivate.post(DATA_OF_CUSTOMER_PACKAGE, args.data);
      } else if (args.action === "edit") {
        // Ensure args.data includes a 'command' field and 'status' is an integer
        const data = {
          customerPackageId: args.data.customerPackageId,
          customerPackageName: args.data.customerPackageName,
          totalItem: args.data.totalItem,
          dateStart: args.data.dateStart,
          dateEnd: args.data.dateEnd,
          patientId: args.data.patientId,
          status: args.data.status,
          numberScan: args.data.numberScan,
          // orderDetails: args.data.orderDetails,
          // createdBy: args.data.createdBy,
          // createdDate: args.data.createdDate,
          // modifiedBy: args.data.modifiedBy,
          // lastModifiedDate: args.data.lastModifiedDate,
        };
        console.log("PatientId to update package: ", data.patientId);
        // console.log("Status:", args.data.status);
        // Send a PUT request to update an existing order
        try {
          // Before sending the PUT request, find the order in the state that you're about to update
          const packageToUpdate = packages.find(
            (order) => order.customerPackageId === args.data.customerPackageId
          );
          const responses = await Promise.all([
            // axiosPrivate.put(DATA_OF_ORDERS, data),
            axiosPrivate.put(`${STATUS_OF_CUSTOMER_PACKAGE}?patientId=${data.patientId}`),
          ]);
          console.log("Response: ", responses);
          const statusResponse = responses[0];
          if (statusResponse.status === 200) {
            // Display a toast with the response data
            toast(statusResponse.data);
          }
          updateOrderInState(packageToUpdate, data);
          toast.success("Update Package successfully!");
        } catch (error) {
          if (error.response) {
            console.error(error.response.data); // Log the server's error message
            toast.error("Update Package failed!");
          } else {
            console.error(error.message); // Log the error message
            toast.error("Update Package failed!");
          }
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    } else if (args.requestType === "delete") {
      console.log(args.data[0].customerPackageId);
      const data = {
        id: args.data[0].customerPackageId,
      };
      console.log("DELETE Package id: ", data);
      // Send a DELETE request to delete an order
      try {
        await axiosPrivate.delete(DATA_OF_CUSTOMER_PACKAGE, {
          params: { customerPackageId: args.data[0].customerPackageId },
        });
        setPackages((prevOrders) =>
          prevOrders.filter(
            (order) =>
              order.customerPackageId !== args.data[0].customerPackageId
          )
        );
        toast.success("Delete Packages successfully!");
      } catch (error) {
        if (error.response) {
          console.error(error.response.data); // Log the server's error message
          toast.error("Delete Packages failed!");
        } else {
          console.error(error.response.data); // Log the error message
          toast.error("Delete Packages failed!");
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
      toast.error("User must login first");
      navigate("/login");
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ToastContainer />
      <Header category="Page" title="Packages" />
      {dataLoaded ? (
        <GridComponent
          id="gridcomp"
          dataSource={packages}
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
              field="customerPackageId"
              headerText="customerPackageId"
              width="120"
              textAlign="Center"
              isPrimaryKey={true}
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="customerPackageName"
              headerText="customerPackageName"
              width="120"
              textAlign="Center"
              allowEditing={false}
              format="C0"
            ></ColumnDirective>
            <ColumnDirective
              field="patientId"
              headerText="patientId"
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
                  dataSource: packageStatus,
                  fields: { value: "status" },
                },
              }}
            ></ColumnDirective>
            <ColumnDirective
              field="dateStart"
              headerText="dateStart"
              width="140"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="dateEnd"
              headerText="dateEnd"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>
            <ColumnDirective
              field="numberScan"
              headerText="numberScan"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective>

            {/* <ColumnDirective
              field="createdBy"
              headerText="createdBy"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            {/* <ColumnDirective
              field="createdDate"
              headerText="createdDate"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            {/* <ColumnDirective
              field="modifiedBy"
              headerText="modifiedBy"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
            {/* <ColumnDirective
              field="lastModifiedDate"
              headerText="lastModifiedDate"
              width="120"
              textAlign="Right"
              allowEditing={false}
            ></ColumnDirective> */}
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
export default Packages;
