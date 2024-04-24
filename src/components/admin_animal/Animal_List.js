import React, {useState, useEffect} from "react";
import { SearchIcon } from "../../utils/Icons";
import DebouncedInput from "../../utils/DebouncedInput";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import DownloadBtn from "../../utils/DownloadBtn";
import axios from "axios";
import { Radio } from "@material-tailwind/react";
import Datepicker from "flowbite-datepicker/Datepicker";
import { useNavigate } from "react-router-dom";
import {useAnimalContext} from "../../hooks/useAnimalContext"


const Animal_List = () => {

  const navigate = useNavigate()
  const columnHelper = createColumnHelper();
  const [animalToEdit, setAnimalToEdit] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [areaNames, setAreaNames] = useState([]);

  const {dispatch} = useAnimalContext()
  

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
  }, []);

  const calculateAge = (birthdayString) =>{
    const birthday = new Date(birthdayString);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const handleEditUser = async (animal) => {
    // Implement your logic to handle the edit action
    setAnimalToEdit(animal);
    setIsEditModalVisible(true);
  };

  const [isFormModified, setIsFormModified] = useState(true);
  const handleSaveEdit = async (event) => {
    event.preventDefault()
    // Implement your logic to save the edited user data
    const selectedArea = areaNames.find(
      (area) => area.area_name === animalToEdit.area_name
    );
    const areaId = selectedArea ? selectedArea.area_id : null;

    // Prepare the updated user data with the area ID
    const updatedUserData = {
      ...animalToEdit,
      area_id: areaId,
    };
    try {
      // Update the user data using the endpoint http://localhost/api/users/:id
      await axios.put(
        `https://apiv2.at.patrickmamsery.co.tz/api/animals/${animalToEdit.user_id}`,
        updatedUserData
      );


      // Close the edit modal
      setIsEditModalVisible(false);
      setIsFormModified(true);

      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const handleShowDeleteModal = (animal) => {
    setAnimalToDelete(animal);
    setIsDeleteModalVisible(true);
  };
  const handleHideDeleteModal = () => {
    setAnimalToEdit(null);
    setIsDeleteModalVisible(false);
  };
  const handleDeleteAnimal = async () => {
    if (animalToDelete) {
      console.log(animalToDelete)
      try {
        await axios.delete(
          `https://apiv2.at.patrickmamsery.co.tz/api/animals/deleteAnimal/${animalToDelete.animal_TagId}`
        );
        // Update the tableData state by removing the deleted user
        setTableData((prevTableData) =>
          prevTableData.filter((row) => row.user_id !== animalToDelete.user_id)
        );
        // Close the delete confirmation modal
        handleHideDeleteModal();
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };
   const handleViewAnimal = (animal) =>{
    console.log(animal)
     dispatch({type: "SET_ANIMAL_DATA", payload: animal})
     navigate("/admin-dashboard/view_animal")
   }

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
    columnHelper.accessor("animal_name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Animal Name",
    }),
    columnHelper.accessor("animal_sex", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Animal Sex",
    }),
    columnHelper.accessor("age", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Animal Age",
    }),
    columnHelper.accessor("area.area_name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Location",
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
          <button
            onClick={() => handleViewAnimal(info.row.original)}
            title="view"
          >
            <FaEye />
          </button>
        </div>
      ),
      header: "Actions",
    }),
  ];

  const [globalFilter, setGlobalFilter] = useState("");
  const [meta, setMeta] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 15,
  });

  
  const [tableData, setTableData] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://apiv2.at.patrickmamsery.co.tz/api/animals/?page=${meta.currentPage}&pageSize=${meta.pageSize}`);
        const { animals, meta: responseMeta } = response.data;
        const animalsWithAge = animals.map(animal => ({
          ...animal,
          age: calculateAge(animal.animal_birthDay)
        }));
        setTableData(animalsWithAge);
        setMeta(responseMeta);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData()
  }, [meta.currentPage, meta.pageSize])

  useEffect(() => {
    if (isEditModalVisible){
      const datepickerEl = document.getElementById("editdatepickerId");
        new Datepicker(datepickerEl, {});
    }
  }, [isEditModalVisible]);

  return (
    <div className="mt-8  p-6 mb-6 bg-slate-50 min-h-sreen w-full md:container md:mx-auto relative overflow-x-auto  shadow-md sm-rounded-lg">
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
            {table && table.getHeaderGroups().map((headerGroup) => (
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
              <tr className="text-center h-32 text-black">
                <td colSpan={12}>No Record Found!</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-end mt-2 gap-2">
          <button
            onClick={() => {
              setMeta((prevMeta) =>({
                ...prevMeta,
                currentPage: Math.max(1, prevMeta.currentPage -1),
              }));
            }}
            disabled={meta.currentPage === 1}
            className="p-1 border border-gray-300 px-2 disabled: opacity-30"
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
                        Delete Animal
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete{" "}
                          <strong>
                            {animalToDelete.animal_name}
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
                    onClick={handleDeleteAnimal}
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
          className="absolute  z-90 w-screen md:container md:mx-auto"
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
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            Animal Name
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name"
                            type="text"
                            value={animalToEdit.animal_name}
                            onChange={(e) => {
                              setAnimalToEdit((prevUser) => ({
                                ...prevUser,
                                amimal_name: e.target.value,
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
                            Gender
                          </label>
                          <div className="flex gap-10">
                            <Radio 
                              name="animal_sex" 
                              label="Male" 
                              value="Male"
                              checked={animalToEdit.animal_sex === 'male'}
                              onChange={(e) => {
                                setAnimalToEdit((prevUser) => ({
                                  ...prevUser,
                                  animal_sex: e.target.value,
                                }));
                                setIsFormModified(false); // Mark the form as modified
                              }} 
                            />
                            <Radio 
                              name="animal_sex" 
                              label="Female" 
                              value= "Female"
                              checked={animalToEdit.animal_sex === 'female'}
                              onChange={(e) => {
                                setAnimalToEdit((prevUser) => ({
                                  ...prevUser,
                                  animal_sex: e.target.value,
                                }));
                                setIsFormModified(false); // Mark the form as modified
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-username"
                          >
                            Date of Birth
                          </label>
                          <div className="relative w-full">
                            <input
                              datepicker
                              datepicker-autohide
                              type="text"
                              className='block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm pl-10 rounded-lg'
                              placeholder="Select date"
                              defaultValue={formatDate(animalToEdit.animal_birthDay)}
                              // onSelect={(e) => {
                              //   setAnimalToEdit((prevUser) => ({
                              //     ...prevUser,
                              //     animal_birthDay: e.target.value,
                              //   }));
                              //   setIsFormModified(false); // Mark the form as modified
                              // }}
                              id="editdatepickerId"
                            />
                            <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                              <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
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
                            onChange={(e) => {
                              setAnimalToEdit((prevUser) => ({
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
                                <option
                                  key={area.area_id}
                                  value={area.area_name}
                                >
                                  {area.area_name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3">
                          <button
                            type="submit"
                            // disabled={isFormModified}
                            className={`w-full bg-orange-500 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isFormModified ? "cursor-not-allowed" : ""
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

export default Animal_List;
