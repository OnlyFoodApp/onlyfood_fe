import React, { useState, useEffect } from 'react';
import { ColumnDirective, ColumnsDirective, Filter, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Inject, Page, Sort } from '@syncfusion/ej2-react-grids';
import axios from 'axios'; // Import Axios
import { data } from '../data/datasource';
const Customers = () => {
//call api get data về


const [customers, setCustomers] = useState([]); // State để lưu dữ liệu từ API

  useEffect(async () => {
    // Gọi API và cung cấp token trong tiêu đề
    await axios.get('https://onlyfood.azurewebsites.net/api/v1/customers', {
      headers: new Headers({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Request-Method': 'GET, POST, DELETE, PUT, OPTIONS',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }),
    })
      .then(response => {
        setCustomers(response.data); // Lưu dữ liệu API vào state
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      });
  }, []);



  /// table data
  const pageSettings = { pageSize: 6 };
  const sortSettings = { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] };
  const filterSettings = { columns: [{ field: 'EmployeeID', operator: 'greaterthan', value: 2 }] };
        
  return (
    <GridComponent
      dataSource={customers}
      allowPaging={true}
      pageSettings={pageSettings}
      filterSettings={filterSettings}
      allowSorting={true}
      sortSettings={sortSettings}
      allowFiltering={true}
    >
      <ColumnsDirective>
        <ColumnDirective field='OrderID' width='100' textAlign="Right"/>
        <ColumnDirective field='CustomerID' width='100'/>
        <ColumnDirective field='EmployeeID' width='100' textAlign="Right"/>
        <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/>
        <ColumnDirective field='ShipCountry' width='100'/>
      </ColumnsDirective>
      <Inject services={[Page, Sort, Filter, Group]}/>
    </GridComponent>
  );
}

export default Customers;
