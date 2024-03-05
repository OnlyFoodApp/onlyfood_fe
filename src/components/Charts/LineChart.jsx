import React, { useEffect, useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';

import { lineCustomSeries, LinePrimaryXAxis, LinePrimaryYAxis } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';
import { GET_USERS_PER_MONTHS } from '../../api/apiConstants';
import { axiosPrivate } from '../../api/axiosInstance';
import axios from 'axios';

const LineChart = () => {
  const { currentMode } = useStateContext();

   //call api get data về
   const [userPerMonths, setUserPerMonths] = useState([]); // State để lưu dữ liệu từ API
   const [dataLoaded, setDataLoaded] = useState(false);
 
   useEffect(() => {
     // Create a new CancelToken
     const source = axios.CancelToken.source();
 
     // Make the request, passing the CancelToken
     axiosPrivate
       .get(GET_USERS_PER_MONTHS, { cancelToken: source.token })
       .then((response) => {
         if (response.status === 200) {
           console.log("danh sách userPerMonths : ", response.data);
           // Lưu dữ liệu API vào state
           setUserPerMonths(response.data);
           setDataLoaded(true);
         }
       })
       .catch((error) => {
         // If the request was cancelled, log a message to the console
         if (axios.isCancel(error)) {
           console.log("Request cancelled:", error.message);
         } else {
           console.error("Lỗi khi lấy dữ liệu từ API:", error);
         }
       });
 
     // Cancel the request if the component unmounts
     return () => {
       source.cancel("Component unmounted");
     };
   }, []);
   const lineChartData = userPerMonths;
//FOR TESTING 
  // const lineChartData = [
  //   [
  //     {
  //       x: "2024-01-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-02-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-03-01T00:00:00",
  //       y: 3,
  //     },
  //     {
  //       x: "2024-04-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-05-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-06-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-07-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-08-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-09-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-10-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-11-01T00:00:00",
  //       y: 0,
  //     },
  //     {
  //       x: "2024-12-01T00:00:00",
  //       y: 0,
  //     },
  //   ],
  // ];

  const lineCustomSeries = [
    {
      dataSource: lineChartData,
      xName: "x",
      yName: "y",
      name: "VietNam",
      width: "2",
      marker: { visible: true, width: 10, height: 10 },
      tooltip: {
        enable: true,
        format: "Month: ${point.x}<br/>Amount: ${point.y}",
      },
      type: "Line",
    },
  ];


  return (
    <ChartComponent
      id="line-chart"
      height="420px"
      primaryXAxis={LinePrimaryXAxis}
      primaryYAxis={LinePrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true,  format: 'Month: ${point.x}<br/>Amount: ${point.y}'}}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
      {dataLoaded ? (
        <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {lineCustomSeries.map((item, index) => <SeriesDirective key={index} {...item} />)}
      </SeriesCollectionDirective>
      ) : (
        <p> Loading...</p>
      )}
    </ChartComponent>
  );
};

export default LineChart;