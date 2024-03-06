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
import { GET_ALL_PILLS } from "../api/apiConstants";
import { data } from "../data/datasource";
import { Header } from "../components";
import { contextMenuItems } from "../data/dummy";
const Pills = () => {
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
          <ColumnDirective field='status' headerText='status' textAlign='Center' width='120'></ColumnDirective>
          <ColumnDirective field='pillDescription' headerText='pillDescription' textAlign='Center' width='120'></ColumnDirective>
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

export default Pills;
