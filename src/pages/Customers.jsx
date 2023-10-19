import React from 'react';
import { ColumnDirective, ColumnsDirective, Filter, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Inject, Page, Sort } from '@syncfusion/ej2-react-grids';
import { data } from '../data/datasource';

const Customers = () => {
  const pageSettings = { pageSize: 6 };
  const sortSettings = { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] };
  const filterSettings = { columns: [{ field: 'EmployeeID', operator: 'greaterthan', value: 2 }] };
        
  return (
    <GridComponent
      dataSource={data}
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
