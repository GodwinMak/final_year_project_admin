/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { Context } from "../../context";
import { useLogout } from "../../hooks/useLogOut";

const Navbar = () => {
  const {logout} = useLogout();

  const handleLogout =()=>{
    logout()
  }
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!isNotificationDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const closeDropdowns = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileDropdownOpen(false);
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdowns);

    return () => {
      document.removeEventListener("click", closeDropdowns);
    };
  }, []);
  const { state, dispatch } = React.useContext(Context);
  const toogle = () => {
    dispatch({ type: "SET_TOGGLE_NAVBAR", payload: !state.toggleNavbar });
  };
  return (
    <div ref={notificationRef}>
      <div
        className="z-50 fixed left-0 right-0 top-0 h-[76px] px-6 py-4 bg-white border-b border-neutral-200 justify-between item-center gap-5 inline-flex"
        ref={profileRef}
      >
        <div className="flex gap-6 items-center">
          <div className="border-r pr-6 border-[#e4e4e4]">
            <img src="/images/logo.svg" alt="" width={100} />
          </div>
          <div
            onClick={toogle}
            className="text-xl font-semibold leading-8 text-[#19191c] cursor-pointer "
          >
            <i className="fa fa-bars"/>
          </div>
        </div>
        <div className="justify-start items-center gap-8 flex">
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div>
              <button
                onClick={toggleNotificationDropdown}
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900" />
              </button>
              {/* Dropdown menu */}
              {isNotificationDropdownOpen && (
                <div
                  id="dropdownNotification"
                  className="absolute right-1.5 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 ring-1 ring-black ring-opacity-5 focus:otline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                    Notifications
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    <a
                      href="#"
                      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="rounded-full w-11 h-11"
                          src="/docs/images/people/profile-picture-1.jpg"
                          alt="Jese image"
                        />
                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                          <svg
                            className="w-2 h-2 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 18"
                          >
                            <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                            <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-full ps-3">
                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                          New message from{" "}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Jese Leos
                          </span>
                          : "Hey, what's up? All set for the presentation?"
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-500">
                          a few moments ago
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="rounded-full w-11 h-11"
                          src="/docs/images/people/profile-picture-2.jpg"
                          alt="Joseph image"
                        />
                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
                          <svg
                            className="w-2 h-2 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-full ps-3">
                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Joseph Mcfall
                          </span>{" "}
                          and{" "}
                          <span className="font-medium text-gray-900 dark:text-white">
                            5 others
                          </span>{" "}
                          started following you.
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-500">
                          10 minutes ago
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="rounded-full w-11 h-11"
                          src="/docs/images/people/profile-picture-3.jpg"
                          alt="Bonnie image"
                        />
                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-red-600 border border-white rounded-full dark:border-gray-800">
                          <svg
                            className="w-2 h-2 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-full ps-3">
                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Bonnie Green
                          </span>{" "}
                          and{" "}
                          <span className="font-medium text-gray-900 dark:text-white">
                            141 others
                          </span>{" "}
                          love your story. See it and view more stories.
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-500">
                          44 minutes ago
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="rounded-full w-11 h-11"
                          src="/docs/images/people/profile-picture-4.jpg"
                          alt="Leslie image"
                        />
                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800">
                          <svg
                            className="w-2 h-2 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-full ps-3">
                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Leslie Livingston
                          </span>{" "}
                          mentioned you in a comment:{" "}
                          <span className="font-medium text-blue-500" href="#">
                            @bonnie.green
                          </span>{" "}
                          what do you say?
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-500">
                          1 hour ago
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="rounded-full w-11 h-11"
                          src="/docs/images/people/profile-picture-5.jpg"
                          alt="Robert image"
                        />
                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
                          <svg
                            className="w-2 h-2 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 14"
                          >
                            <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-full ps-3">
                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Robert Brown
                          </span>{" "}
                          posted a new video: Glassmorphism - learn how to
                          implement the new design trend.
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-500">
                          3 hours ago
                        </div>
                      </div>
                    </a>
                  </div>
                  <a
                    href="#"
                    className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <div className="inline-flex items-center ">
                      <svg
                        className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 14"
                      >
                        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                      </svg>
                      View all
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleProfileDropdown}
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  {/* Active: "bg-gray-100", Not Active: "" */}
                  <a
                    href="/admin-dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </a>
                  <span
                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                    onClick={handleLogout}
                  >
                    Sign out
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
