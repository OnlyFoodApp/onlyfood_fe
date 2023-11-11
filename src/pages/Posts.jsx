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
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { Header } from "../components";
import axios from "axios";
import { GET_ALL_POST } from "../api/apiConstants";
import { axiosPublic } from "../api/axiosInstance";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Define the columns for the Posts grid
  const columns = [
    {
      field: "id",
      headerText: "Post ID",
      width: "140",
      textAlign: "Right",
      isPrimaryKey: true,
    },
    { field: "title", headerText: "Title", width: "200" },
    { field: "content", headerText: "Content", width: "300" },
    { field: "mediaURLs", headerText: "Media URLs", width: "200" },
    {
      field: "isDeleted",
      headerText: "Is Deleted",
      width: "140",
      textAlign: "Right",
      editType: "numericedit",
    },
    {
      field: "isEdited",
      headerText: "Is Edited",
      width: "140",
      textAlign: "Right",
      editType: "numericedit",
    },
    {
      field: "account.id",
      headerText: "Account ID",
      width: "140",
      textAlign: "Right",
      editType: "numericedit",
    },
    { field: "account.username", headerText: "Account Username", width: "150" },
  ];

  useEffect(() => {
    const getPosts = async () => {
      try {
        // Replace with your API endpoint to fetch posts
        const response = await axiosPublic.get(GET_ALL_POST);
        console.log("response", response);
        if (response.status === 200) {
          // Modify the response data as needed
          const postsData = modifyPostsData(response.data.data);
          console.log("postsData", postsData);
          setPosts(postsData);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data from API: ", error);
      }
    };

    getPosts();
  }, []);

  const modifyPostsData = (data) => {
    // Modify the data format as needed
    return data.map((item, index) => ({
      ...item,
      index: index + 1,
      isDeleted: item.isDeleted ? "Yes" : "No",
      isEdited: item.isEdited ? "Yes" : "No",
    }));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Posts" />

      <GridComponent
        dataSource={posts}
        allowPaging={true}
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={{
          allowDeleting: true,
          allowEditing: true,
          allowAdding: true,
        }}
        toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
        pageSettings={{ pageCount: 5 }}
      >
        <ColumnsDirective>
          {columns.map((column, index) => (
            <ColumnDirective key={index} {...column} />
          ))}
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

export default Posts;
