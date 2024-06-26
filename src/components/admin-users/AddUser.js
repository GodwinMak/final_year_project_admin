import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { url } from "../../utils/API";

const AddUser = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    role: "",
    area_name: ""
  });
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [areas, setAreas] = useState([]);


  useEffect(() => {
    const fetchData = async ()=>{
      try {
        const response = await axios.get(
          `${url}/api/areas/all`
        );

        setAreas(response.data)

      } catch (error) {
        console.log(error)
      }
      
    }

    fetchData()
  },[])


  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { first_name, last_name, username, password, email, role, area_name } = values;
     const area =  areas.find((a) => a.area_name === area_name);
    try {
     await axios.post(
        `${url}/api/users/register`,
        {
          first_name,
          last_name,
          username,
          password,
          email,
          role,
          area_id: area.area_id
        }
      ).then((res)=>{
        navigate("/admin-dashboard/view_users");
      })


    } catch (error) {
      console.error('Error adding user:', error);
      console.log(error.response.data.message);
      setError(error.response.data.message);
      setModal(true);
    }
  };

  const toggelModal = ()=>{
    setModal(false);
    setError("")
  }
  return (
    <>
      <div className="p-6 mb-6 bg-slate-50  w-full md:container md:mx-auto">
        <h2>User Registration</h2>
        <form className="w-full max-w-lg mx-auto mt-8" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                First Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
                name="first_name"
                onChange={handleChange}
                required
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
                placeholder="Doe"
                name="last_name"
                onChange={handleChange}
                required
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
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-email"
              >
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-email"
                type="email"
                placeholder="Your Email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="password"
                type="password"
                placeholder="******************"
                name="password"
                onChange={handleChange}
                required
              />
              <p className="text-gray-600 text-xs italic">
                Make it as long and as crazy as you'd like
              </p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
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
                onChange={handleChange}
                required
              >
                <option defaultValue>Choose Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                htmlFor="default"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                Choose Area
              </label>
              <select
                id="role"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="area_name"
                onChange={handleChange}
                required
              >
                <option defaultValue>Choose Role</option>
                {areas &&
                  areas.map((area, index) => {
                    return <option key={index}>{area.area_name}</option>;
                  })}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6 px-3">
            <button
              type="submit"
              className="
                w-full text-white bg-orange-600 
                hover:bg-range-100 focus:ring-4 focus:outline-none 
                focus:ring-orange-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center dark:bg-orange-600 
                dark:hover:bg-orange-700 dark:focus:ring-orange-800"
            >
              Add User
            </button>
          </div>
        </form>
        {error && modal && (
          <div
            className="relative z-10 p-6 mb-6 bg-slate-50 min-h-sreen w-full md:container md:mx-auto"
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
                          Error Occured
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={toggelModal}
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddUser;
