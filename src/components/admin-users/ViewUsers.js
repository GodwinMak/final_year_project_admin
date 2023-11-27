import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DownloadBtn from "../../utils/DownloadBtn";
import DebouncedInput from "../../utils/DebouncedInput";
import { SearchIcon } from "../../utils/Icons";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const ViewUsers = () => {
 const userData = JSON.parse(
   localStorage.getItem("user")
 );

 console.log(userData.username);
  const columnHelper = createColumnHelper();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [areaNames, setAreaNames] = useState([]);
  useEffect(() => {
    const fetchAreaNames = async () => {
      try {
        const response = await axios.get(
          "https://apiv2.at.patrickmamsery.co.tz/api/areas/all"
        );
        const data = response.data;
        setAreaNames(data);
      } catch (error) {
        console.error("Error fetching area names:", error);
      }
    };

    fetchAreaNames();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts.
  console.log(areaNames)
  const handleEditUser = async (user) => {
    // Implement your logic to handle the edit action
    setUserToEdit(user);
    setIsEditModalVisible(true);
  };

  const [isFormModified, setIsFormModified] = useState(true);

  const handleSaveEdit = async () => {
    // Implement your logic to save the edited user data
    console.log("Saving edited user:", userToEdit);

    const selectedArea = areaNames.find(
      (area) => area.name === userToEdit.area
    );
    const areaId = selectedArea ? selectedArea.id : null;

    // Prepare the updated user data with the area ID
    const updatedUserData = {
      ...userToEdit,
      area_id: areaId,
    };
    try {
      // Update the user data using the endpoint http://localhost/api/users/:id
      await axios.put(
        `https://apiv2.at.patrickmamsery.co.tz/api/users/${userToEdit.user_id}`,
        updatedUserData
      );

      // Close the edit modal
      setIsEditModalVisible(false);
      setIsFormModified(true);

    } catch (error) {
      console.error("Error updating user data:", error);
    }

  };

  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };

  const handleHideDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalVisible(false);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await axios.delete(
          `https://apiv2.at.patrickmamsery.co.tz/api/users/${userToDelete.user_id}`
        );
        // Update the tableData state by removing the deleted user
        setTableData((prevTableData) =>
          prevTableData.filter((row) => row.user_id !== userToDelete.user_id)
        );
        // Close the delete confirmation modal
        handleHideDeleteModal();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const columns = [
    columnHelper.accessor("", {
      id: "S.No",
      cell: (info) => (
        <span>
          {info.row.index + 1 + (meta.currentPage - 1) * meta.pageSize}
        </span>
      ),
      header: "S.No",
    }),
    columnHelper.accessor("first_name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "First Name",
    }),
    columnHelper.accessor("last_name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Last Name",
    }),
    columnHelper.accessor("username", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "User Name",
    }),
    columnHelper.accessor("email", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Email",
    }),
    columnHelper.accessor("role", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Role",
    }),
    columnHelper.accessor("area", {
      cell: (info) => <span>{info.getValue() || "Not Available"}</span>,
      header: "Area",
    }),
    columnHelper.accessor("", {
      id: "actions",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditUser(info.row.original)}
            title="Edit"
          >
            <AiFillEdit />
          </button>
          <button
            onClick={() => handleShowDeleteModal(info.row.original)}
            title="Delete"
          >
            <MdDelete />
          </button>
        </div>
      ),
      header: "Actions",
    }),
  ];

  const [globalFilter, setGlobalFilter] = useState("");
  const [tableData, setTableData] = useState([]);
  const [meta, setMeta] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 15,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://apiv2.at.patrickmamsery.co.tz/api/users/all?page=${meta.currentPage}&pageSize=${meta.pageSize}`
        );
        const { users, meta: responseMeta } = response.data;
        const filteredUsers = users.filter(
          (user) => user.username !== userData.username
        );
        setTableData(filteredUsers);
        setMeta(responseMeta);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [meta.currentPage, meta.pageSize, userData.username]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 mb-6 bg-slate-50 min-h-sreen w-full md:container md:mx-auto relative overflow-x-auto  shadow-md sm-rounded-lg">
      <div className="p-2 max-w-5xl mx-auto   fill-gray-400">
        <div className="flex justify-between mb-2 w-full">
          <div className="w-full flex items-center gap-1">
            <SearchIcon />
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-orange-500"
              placeholder="Search all columns..."
            />
          </div>
          <DownloadBtn data={tableData} fileName={"Users"} />
        </div>
        <table className="rtl:text-right border border-gray-700 w-full text-left">
          <thead className="bg-orange-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="capitalize px-3.5 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-white">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`
                ${i % 2 === 0 ? "bg-orange-900" : "bg-orange-800"}
                `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className=" py-2 px-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="text-center h-32">
                <td colSpan={12}>No Record Found!</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* pagination */}
        <div className="flex items-center justify-end mt-2 gap-2">
          <button
            onClick={() => {
              setMeta((prevMeta) => ({
                ...prevMeta,
                currentPage: Math.max(1, prevMeta.currentPage - 1),
              }));
            }}
            disabled={meta.currentPage === 1}
            className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setMeta((prevMeta) => ({
                ...prevMeta,
                currentPage: Math.min(
                  prevMeta.totalPages,
                  prevMeta.currentPage + 1
                ),
              }));
            }}
            disabled={meta.currentPage === meta.totalPages}
            className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          >
            {">"}
          </button>

          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {meta.currentPage} of {meta.totalPages}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              value={meta.currentPage}
              onChange={(e) => {
                const page = e.target.value
                  ? Math.max(
                      1,
                      Math.min(meta.totalPages, Number(e.target.value))
                    )
                  : 1;
                setMeta((prevMeta) => ({
                  ...prevMeta,
                  currentPage: page,
                }));
              }}
              className="border p-1 rounded w-16 bg-transparent"
            />
          </span>
        </div>
      </div>
      {isDeleteModalVisible && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Deactivate account
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete{" "}
                          <strong>
                            {userToDelete.first_name} {userToDelete.last_name}{" "}
                          </strong>
                          ? All of your data will be permanently removed. This
                          action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleHideDeleteModal}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalVisible && (
        <div
          className="relative z-20 w-full md:container md:mx-auto"
          aria-modal="true"
          role="dialog"
          aria-labelledby="user-edit-form"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg top-9">
                  <div className=" flex items-center justify-center p-6 ">
                    <form className="w-full max-w-lg" onSubmit={handleSaveEdit}>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            First Name
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name"
                            type="text"
                            value={userToEdit.first_name}
                            onChange={(e) => {
                              setUserToEdit((prevUser) => ({
                                ...prevUser,
                                first_name: e.target.value,
                              }));
                              setIsFormModified(false); // Mark the form as modified
                            }}
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-last-name"
                          >
                            Last Name
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-last-name"
                            type="text"
                            value={userToEdit.last_name}
                            onChange={(e) => {
                              setUserToEdit((prevUser) => ({
                                ...prevUser,
                                last_name: e.target.value,
                              }));
                              setIsFormModified(false); // Mark the form as modified
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-username"
                          >
                            Username
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-username"
                            type="text"
                            placeholder="JaneDoe"
                            name="username"
                            value={userToEdit.username}
                            onChange={(e) => {
                              setUserToEdit((prevUser) => ({
                                ...prevUser,
                                username: e.target.value,
                              }));
                              setIsFormModified(false); // Mark the form as modified
                            }}
                            // onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-email"
                          >
                            email
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-email"
                            type="email"
                            value={userToEdit.email}
                            onChange={(e) => {
                              setUserToEdit((prevUser) => ({
                                ...prevUser,
                                email: e.target.value,
                              }));
                              setIsFormModified(false); // Mark the form as modified
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            htmlFor="default"
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          >
                            Choose Role
                          </label>
                          <select
                            id="role"
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="role"
                            value={userToEdit.role || ""}
                            onChange={(e) => {
                              setUserToEdit((prevUser) => ({
                                ...prevUser,
                                role: e.target.value,
                              }));
                              setIsFormModified(false); // Mark the form as modified
                            }}
                          >
                            <option disable value="">
                              Choose Role
                            </option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            htmlFor="default"
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          >
                            Assign Area
                          </label>
                          <select
                            id="role"
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="role"
                            value={userToEdit.role || ""}
                            onChange={(e) => {
                              setUserToEdit((prevUser) => ({
                                ...prevUser,
                                area_name: e.target.value,
                              }));
                              setIsFormModified(false); // Mark the form as modified
                            }}
                          >
                            <option disable value="">
                              Choose Role
                            </option>
                            {areaNames.length > 0 &&
                              areaNames.map((area) => (
                                <option key={area.id} value={area.name}>
                                  {area.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3">
                          <button
                            type="submit"
                            disabled={isFormModified}
                            className={`w-full bg-orange-500 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                              isFormModified ? "cursor-not-allowed" : ""
                            }`}
                          >
                            save
                          </button>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <button
                            type="button"
                            onClick={() => setIsEditModalVisible(false)}
                            className=" w-full bg-orange-100 hover:bg-orange-700  font-bold py-2 px-4 rounded  focus:shadow-outline"
                          >
                            cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
