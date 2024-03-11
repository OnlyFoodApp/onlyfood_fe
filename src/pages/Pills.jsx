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
import { GET_ALL_PILLS, DATA_OF_PILLS } from "../api/apiConstants";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { data } from "../data/datasource";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Pills = () => {
  const { isClicked, setIsClicked, handleClick, setIsLoggedIn, isLoggedIn } =
  useStateContext();
  const [pills, setPills] = useState([]); // State để lưu dữ liệu từ API
  const [dataLoaded, setDataLoaded] = useState(false);
  const isMounted = useRef(false); // Add this line
  const navigate = useNavigate();
  const contextMenuItems = [
    "AutoFit",
    "AutoFitAll",
    "SortAscending",
    "SortDescending",
    "Copy",
    "Edit",
    "Delete",
    "Save",
    "Cancel",
    "ExcelExport",
    "FirstPage",
    "PrevPage",
    "LastPage",
    "NextPage",
  ];
  
   //TEST
   const toolbarOptions = ['Add', 'Edit', 'Update', 'Cancel'];
   const editparams = { params: { popupHeight: '300px' } };
   const validationRule = { required: true };
   const customeridRules = { required: true, number: true };
  //  const selectionSettings = { persistSelection: true, type: "Multiple", checkboxOnly: true };
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

  const modifyPillData = (data) => {
    let pillRes = data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    return pillRes;
  };
  //call api get data về
  useEffect(() => {
    isMounted.current = true; // Set the ref to true when the component mounts
    // Create a new CancelToken
    const source = axios.CancelToken.source();
  
    // Make the request, passing the CancelToken
    axiosPrivate.get(GET_ALL_PILLS, { cancelToken: source.token })
      .then(response => {
        if (response.status === 200 && isMounted.current) {
          console.log("danh sách pills: ", response.data);
          const pillData = modifyPillData(response.data);
          // Lưu dữ liệu API vào state
          setPills(pillData);
          setDataLoaded(true);
          console.log("pills :", pills);
        }
      })
      .catch(error => {
        // If the request was cancelled, log a message to the console
        if (axios.isCancel(error)) {
          console.log('Request cancelled:', error.message);
          toast.error("Cannot get the data please refresh or log back in!");
        } else {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
          toast.error("Cannot get the data please refresh or log back in!");
        }
      });
  
    // Cancel the request if the component unmounts
    return () => {
      source.cancel('Component unmounted');
    };
  }, []);
  //HANDLE UPDATE
  const updatePillInState = (oldData, newData) => {
    setPills((prevPill) => {
      return prevPill.map((pill) =>
      pill.pillId === oldData.pillId
          ? { ...oldData, ...newData }
          : pill
      );
    });
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
            await axiosPrivate.post(DATA_OF_PILLS, args.data);
          } else if (args.action === 'edit') {
            // Ensure args.data includes a 'command' field and 'status' is an integer
            const data = {
              pillId: args.data.pillId,
              pillName: args.data.pillName,
              dosagePerDay: args.data.dosagePerDay,
              quantityPerDose: args.data.quantityPerDose,
              quantity: args.data.quantity,
              unit: args.data.unit,
              morning: args.data.morning,
              afternoon: args.data.afternoon,
              evening: args.data.evening,
              pillDescription: args.data.pillDescription,
              dateStart: args.data.dateStart,
              dateEnd: args.data.dateEnd,
              // status: typeof args.data.status === 'string' ? getStatusId(args.data.status) : args.data.status.id,
            };
            console.log("Data: ", data);
            // console.log("Status:", args.data.status);
            // Send a PUT request to update an existing order
  
            try {
              // Before sending the PUT request, find the order in the state that you're about to update
          const pillToUpdate = pills.find(
            (pill) => pill.pillId === args.data.pillId
          );
              await axiosPrivate.put(`${DATA_OF_PILLS}/${args.data.pillId}`, data);
              updatePillInState(pillToUpdate, data)
              toast.success("Update Pill successfully!");
            } catch (error) {
              if (error.response) {
                console.error(error.response.data); // Log the server's error message
                toast.error("Update Pill failed!");
              } else {
                console.error(error.message); // Log the error message
                toast.error("Update Pill failed!");
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
            await axiosPublic.delete(`${DATA_OF_PILLS}/${args.data[0].id}`);
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
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Dialog' };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Pills" />
      {dataLoaded ? (
        //TESTING
        <GridComponent
        id="gridcomp"
        dataSource={pills}
        allowPaging={true}
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        contextMenuItems={contextMenuItems}
        toolbar={toolbarOptions}
        pageSettings={pageSettings}
        ref={(grid) => (gridInstance = grid)}
        actionBegin={actionBegin.bind(this)}
        width="100%"
      >
        <ColumnsDirective>
          <ColumnDirective field='pillId' headerText='pillId' width='120' textAlign='Center' isPrimaryKey={true}></ColumnDirective>
          <ColumnDirective field='pillName' headerText='pillName' width='120' textAlign='Center'></ColumnDirective>
          <ColumnDirective field='dosagePerDay' headerText='dosagePerDay' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='quantityPerDose' headerText='quantityPerDose' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='quantity' headerText='quantity' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='unit' headerText='unit' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='morning' headerText='morning' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='afternoon' headerText='afternoon' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='evening' headerText='evening' textAlign='Center' width='120'></ColumnDirective>
          {/* <ColumnDirective field='status' headerText='status' textAlign='Center' width='120'></ColumnDirective> */}
          <ColumnDirective field='pillDescription' headerText='pillDescription' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='dateStart' headerText='dateStart' textAlign='Center' width='120' editType='datetimepickeredit'></ColumnDirective>
          <ColumnDirective field='dateEnd' headerText='dateEnd' textAlign='Center' width='120' editType='datetimepickeredit'></ColumnDirective>
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
          ]}
        />
      </GridComponent>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Pills;
