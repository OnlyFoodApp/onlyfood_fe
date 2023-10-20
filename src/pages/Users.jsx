import React, { useState, useEffect } from 'react';
import { ColumnDirective, ColumnsDirective, Filter, GridComponent } from '@syncfusion/ej2-react-grids';
import { Group, Inject, Page, Sort } from '@syncfusion/ej2-react-grids';
import axios from 'axios'; // Import Axios
import { data } from '../data/datasource';
import callApi from "../utils/APICaller";
const Users = () => {
//call api get data về


 const [users, setUsers] = useState([]); // State để lưu dữ liệu từ API
 const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(async () => {
    // Gọi API và cung cấp token trong tiêu đề
    await axios.get('https://onlyfood.azurewebsites.net/api/v1/customers', {
      headers:{
        'Authorization': 'Bearer ' + localStorage.getItem('token')  
      }
    })
      .then(response => {
        console.log('danh sách : ' , response.data.data);
        // Lưu dữ liệu API vào state
         setUsers(response.data.data);
         setDataLoaded(true);
        console.log('users :',users );
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      });
  }, []);




  //  useEffect( async  () =>  {
  //   await callApi("api/v1/users", "GET", null).then((res) => {
  //     console.log('Du lieu tu api ' , res.data.data);
  //     setUsers(res.data.data);
  //     // console.log('User trong await' , users);
  //     setDataLoaded(true);
  //   });
  //   // console.log('User sau await' , users);
  // }, []);



    return (<div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr  >
                    <th scope="col" class="p-4">
                        <div class="flex items-center">
                            <input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="checkbox-all-search" class="sr-only">checkbox</label>
                        </div>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Username
                    </th>
                    <th scope="col" class="px-6 py-3">
                    Email
                    </th>
                  
                    <th scope="col" class="px-6 py-3">
                    FirstName
                    </th>
                    <th scope="col" class="px-6 py-3">
                    LastName
                    </th>
                    <th scope="col" class="px-6 py-3">
                    DateOfBirth
                    </th>
                    <th scope="col" class="px-6 py-3">
                    Gender
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            
        </table>
    </div>
    
    {dataLoaded ? (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {users.map((user, index) => (
              <tr key={`users-${index}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover-bg-gray-600">
                 <td class="w-4 p-4">
                        <div class="flex items-center">
                            <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                        </div>
                    </td>
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.account.username}
                    </th>

                    <td>
                      
                    </td>
                    <td class="px-6 py-4">
                    {user.account.email}
                    </td>
                   
                    <td class="px-6 py-4">
                    {user.account.firstName}
                    </td>
                    <td class="px-6 py-4">
                    {user.account.lastName}
                    </td>
                    <td class="px-6 py-4">
                    {user.account.dateOfBirth}
                    </td>
                    <td class="px-6 py-4">
                    {user.account.gender}
                    </td>
                    <td class="flex items-center px-6 py-4 space-x-3">
                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}



    
      </div>) ;

  




  
}

export default Users;
