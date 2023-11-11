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
import { DATA_OF_POST, GET_ALL_POST } from "../api/apiConstants";
import { axiosPublic } from "../api/axiosInstance";
import { contextMenuItems } from "../data/dummy";

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
    },
    {
      field: "isEdited",
      headerText: "Is Edited",
      width: "140",
      textAlign: "Right",
    },
    {
      field: "displayIndex",
      headerText: "Display Index",
      width: "140",
      textAlign: "Right",
    },
    {
      field: "account.id",
      headerText: "Account ID",
      width: "140",
      textAlign: "Right",
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
  const actionBegin = async (args) => {
    if (args.data) {
      // console.log("DATA: \n", args.data);
      // console.log("ROW DATA: \n", args.rowData);
    }

    if (args.requestType === "save") {
      if (args.action === "add") {
        // Send a POST request to add a new order
        await axiosPublic.post(DATA_OF_POST, args.data);
      } else if (args.action === "edit") {
        // Ensure args.data includes a 'command' field and 'status' is an integer
        const data = {
          id: args.data.id,
          title: args.data.title,
          content: args.data.content,
          mediaURLs: args.data.mediaURLs,
          isDeleted: args.data.isDeleted == "Yes" ? true : false,
          isEdited: args.data.isEdited == "Yes" ? true : false,
          accountID: args.data.account.id,
          displayIndex: args.data.displayIndex,
        };
        console.log("Data NEEEEEEE: ", data);
        // Send a PUT request to update an existing order

        try {
          await axiosPublic.put(`${DATA_OF_POST}/${args.data.id}`, data);
        } catch (error) {
          if (error.response) {
            console.error(error.response.data); // Log the server's error message
          } else {
            console.error(error.message); // Log the error message
          }
        }
      }
      args.cancel = true; // Cancel the grid update because we've already updated the data source
    } else if (args.requestType === "delete") {
      console.log(args.data[0].id);
      const data = {
        id: args.data[0].id,
      };
      console.log("DELETE Order id: ", data);
      // Send a DELETE request to delete an order
      // await axiosPublic.delete(`${DATA_OF_ORDERS}/${args.data[0].id}`, data);
      try {
        await axiosPublic.delete(`${DATA_OF_POST}/${args.data[0].id}`);
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
  // const actionBegin = async (args) => {
  //   if (args.data) {
  //     console.log("DATA: \n", args.data);
  //     console.log("ROW DATA: \n", args.rowData);
  //   }

  //   if (args.requestType === "save") {
  //     if (args.action === "add") {
  //       // Send a POST request to add a new post'          await axiosPublic.post(DATA_OF_ORDERS, args.data);
  //       try {
  //         const response = await axiosPublic.post(DATA_OF_POST, args.data);
  //         if (response.status === 200) {
  //           // Update the local data with the newly created post
  //           const newPost = response.data;
  //           setPosts([...posts, newPost]);
  //         } else {
  //           console.error("Error adding a new post: ", response.data);
  //         }
  //       } catch (error) {
  //         console.error("Error adding a new post: ", error);
  //       }
  //     } else if (args.action === "edit") {
  //       // Ensure args.data includes a 'command' field and 'status' is an integer
  //       const data = {
  //         id: args.data.id,
  //         title: args.data.title,
  //         content: args.data.content,
  //         mediaURLs: args.data.mediaURLs,
  //         isDeleted: args.data.isDeleted,
  //         isEdited: args.data.isEdited,
  //         accountID: args.data.account.id,
  //         displayIndex: args.data.displayIndex,
  //       };
  //       console.log("Data: ", data);

  //       // Send a PUT request to update an existing post
  //       try {
  //         const response = await axiosPublic.put(
  //           `${DATA_OF_POST}/${args.data.id}`,
  //           data
  //         );

  //         if (response.status === 200) {
  //           // Update the local data with the edited post
  //           const updatedPost = response.data;
  //           const updatedPosts = posts.map((post) =>
  //             post.id === updatedPost.id ? updatedPost : post
  //           );
  //           setPosts(updatedPosts);
  //         } else {
  //           console.error("Error updating the post: ", response.data);
  //         }
  //       } catch (error) {
  //         console.error("Error updating the post: ", error);
  //       }
  //     }
  //     args.cancel = true; // Cancel the grid update because we've already updated the data source
  //   } else if (args.requestType === "delete") {
  //     const postId = args.data[0].id;
  //     console.log("DELETE Post id: ", postId);

  //     // Send a DELETE request to delete a post
  //     try {
  //       const response = await axiosPublic.delete(`${DATA_OF_POST}/${postId}`);
  //       if (response.status === 204) {
  //         // Remove the deleted post from the local data
  //         const updatedPosts = posts.filter((post) => post.id !== postId);
  //         setPosts(updatedPosts);
  //       } else {
  //         console.error("Error deleting the post: ", response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error deleting the post: ", error);
  //     }

  //     args.cancel = true; // Cancel the grid update because we've already updated the data source
  //   }
  // };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Posts" />

      <GridComponent
        id="gridcomp"
        dataSource={posts}
        allowPaging={true}
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={{
          allowDeleting: true,
          allowEditing: true,
          allowAdding: true,
        }}
        toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
        pageSettings={{ pageCount: 5 }}
        actionBegin={actionBegin.bind(this)}
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
