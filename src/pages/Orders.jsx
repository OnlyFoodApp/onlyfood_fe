import React, { useEffect } from "react";
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
} from "@syncfusion/ej2-react-grids";

import {
  ordersData,
  contextMenuItems,
  ordersGrid,
  ordersSample,
  orderStatus,
} from "../data/dummy";
import { Header } from "../components";
import axios from "axios";

const Orders = () => {
  const modifyOrderData = (data) => {
    let ordersRes = data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
        status: orderStatus[item.status],
        expectedDeliveryTime: new Date(
          item.expectedDeliveryTime
        ).toLocaleDateString(),
      };
    });
    return ordersRes;
  };
  const [orders, setOrders] = React.useState([]);
  const getOrders = () => {
    axios
      .get("https://onlyfood.azurewebsites.net/api/v1/orders")
      .then((response) => {
        const orderData = modifyOrderData(response.data.data);
        setOrders(orderData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getOrders();
  }, []);

  const editing = { allowDeleting: true, allowEditing: true };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />

      <GridComponent
        id="gridcomp"
        dataSource={orders}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject
          services={[
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
