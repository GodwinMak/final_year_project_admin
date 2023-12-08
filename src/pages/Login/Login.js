import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./login.css";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const { login, error, isLoading, setError } = useLogin();
  const toastOptions = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    userName: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...values, [input.name]: input.value });
  };

  const handleValidation = () => {
    const { password, userName } = values;
    if (userName.length === "") {
      toast.error("user name is required", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required", toastOptions);
      return false;
    }
    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { userName, password } = values;
      await login(userName, password);
    }
  };

  if (error) {
    toast.error(error.message, toastOptions);
    setError(null);
  }

  return (
    <div className="form__container">
      <div className="loginbox">
        <img src="/images/Avatar.png" alt="" className="avatar" />
        <h1 className="title">Sign in here</h1>
        <form onSubmit={(event) => handleLogin(event)}>
          <div>
            <label>User Name</label>
            <input
              type="text"
              name="userName"
              value={values.userName}
              placeholder="Enter user name"
              onChange={handleChange}
              className="text-white bg-transparent border-0"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              placeholder="Enter password"
              onChange={handleChange}
              className="text-white bg-transparent border-0"
            />
          </div>
          <div>
            <input type="submit" value={isLoading ? "Login in..." : "Login"} />
            {/* <input type='submit' value={'Login'} /> */}
          </div>
          <div>
            {/* <p className="">
                            I Don't have an account ? <Link to="/sign">Sign in</Link>
                        </p> */}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
