import React, { useEffect, useState } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";

import { stackedPrimaryXAxis, stackedPrimaryYAxis } from "../../data/dummy";
import {
  GET_ALL_EXPENSES_PER_MONTHS,
  GET_ALL_REVENUE_PER_MONTHS,
} from "../../api/apiConstants";
import { axiosPrivate } from "../../api/axiosInstance";
import { useStateContext } from "../../contexts/ContextProvider";
import axios from "axios";

const Stacked = ({ width, height }) => {
  const { currentMode } = useStateContext();
  //call api get data về
  const [expensePerMonths, setExpensePerMonths] = useState([]); // State để lưu dữ liệu từ API
  const [revenuePerMonths, setRevenuePerMonths] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Create a new CancelToken
    const source = axios.CancelToken.source();

    // Make the request, passing the CancelToken
    axiosPrivate
      .get(GET_ALL_EXPENSES_PER_MONTHS, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("danh sách expensePerMonths : ", response.data);
          // Lưu dữ liệu API vào state
          setExpensePerMonths(response.data);
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
    axiosPrivate
      .get(GET_ALL_REVENUE_PER_MONTHS, { cancelToken: source.token })
      .then((response) => {
        if (response.status === 200) {
          console.log("danh sách revenuePerMonths : ", response.data);
          setRevenuePerMonths(response.data);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error fetching data from API:", error);
        }
      });

    // Cancel the request if the component unmounts
    return () => {
      source.cancel("Component unmounted");
    };
  }, []);
  const stackedChartDataRevenue = revenuePerMonths;
  const stackedChartDataExpense = expensePerMonths;
  // JUST FOR TESTING
  // const stackedChartDataRevenue = [
  //   // Revenue
  //   [
  //     {
  //       x: "Jan",
  //       y: 0,
  //     },
  //     {
  //       x: "Feb",
  //       y: 0,
  //     },
  //     {
  //       x: "Mar",
  //       y: 4,
  //     },
  //     {
  //       x: "Apr",
  //       y: 0,
  //     },
  //     {
  //       x: "May",
  //       y: 0,
  //     },
  //     {
  //       x: "Jun",
  //       y: 0,
  //     },
  //     {
  //       x: "Jul",
  //       y: 0,
  //     },
  //     {
  //       x: "Aug",
  //       y: 0,
  //     },
  //     {
  //       x: "Sep",
  //       y: 0,
  //     },
  //     {
  //       x: "Oct",
  //       y: 0,
  //     },
  //     {
  //       x: "Nov",
  //       y: 0,
  //     },
  //     {
  //       x: "Dec",
  //       y: 0,
  //     },
  //   ],
  // ];
  // const stackedChartDataExpense = [
  //   // Expense
  //   [
  //     {
  //       x: "Jan",
  //       y: 205.07,
  //     },
  //     {
  //       x: "Feb",
  //       y: 180.14,
  //     },
  //     {
  //       x: "Mar",
  //       y: 199.5,
  //     },
  //     {
  //       x: "Apr",
  //       y: 209.45,
  //     },
  //     {
  //       x: "May",
  //       y: 182,
  //     },
  //     {
  //       x: "Jun",
  //       y: 204.12,
  //     },
  //     {
  //       x: "Jul",
  //       y: 190.67,
  //     },
  //     {
  //       x: "Aug",
  //       y: 193.04,
  //     },
  //     {
  //       x: "Sep",
  //       y: 190.5,
  //     },
  //     {
  //       x: "Oct",
  //       y: 191.94,
  //     },
  //     {
  //       x: "Nov",
  //       y: 180.49,
  //     },
  //     {
  //       x: "Dec",
  //       y: 185.87,
  //     },
  //   ],
  // ];
 
  const stackedCustomSeries = [
    {
      dataSource: stackedChartDataRevenue,
      xName: "x",
      yName: "y",
      name: "Revenue",
      type: "StackingColumn",
      background: "blue",
    },

    {
      dataSource: stackedChartDataExpense,
      xName: "x",
      yName: "y",
      name: "Expense",
      type: "StackingColumn",
      background: "red",
    },
  ];

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === "Dark" ? "#33373E" : "#fff"}
      legendSettings={{ background: "white" }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      {dataLoaded ? (
        <SeriesCollectionDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {stackedCustomSeries.map((item, index) => (
            <SeriesDirective key={index} {...item} />
          ))}
        </SeriesCollectionDirective>
      ) : (
        <p> Loading...</p>
      )}
    </ChartComponent>
  );
};

export default Stacked;
