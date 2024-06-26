/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ToastContainer, toast } from "react-toastify";
import { url } from '../../utils/API';


const ChangePassword = () => {
  const { user } = useAuthContext();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...values, [input.name]: input.value });
  };

  const handleSubmit = async (event) =>{
    event.preventDefault();
    try {
      const {oldPassword, newPassword} = values;
      await axios.put(`${url}/api/users/changePassword/${user.user.user.user_id}`, { oldPassword, newPassword })
          .then((res) => {
            toast.success(res.data.message, toastOptions)
            setValues({oldPassword: "", newPassword: ""})
          })
    } catch (error) {
      console.log(error.response)
      toast.error(error.response.data.message, toastOptions);
    }
  }
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 mt-8">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-10 h-10 mr-2" src="/images/logo.svg" alt="logo" />
            AnimalWatch
          </a>
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
                <input 
                  type="password" 
                  name="oldPassword" 
                  placeholder="••••••••"
                  value={values.oldPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  placeholder="••••••••"
                  value={values.newPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500" 
                  required 
                />
              </div>
              <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">Reset passwod</button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  )
}

export default ChangePassword
