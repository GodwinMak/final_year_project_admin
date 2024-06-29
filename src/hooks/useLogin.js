import { useState } from "react";
import {useAuthContext} from "./useAuthContext";
import axios from 'axios'
import { url } from "../utils/API";

export const useLogin =() =>{
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch: authDispatch} = useAuthContext();

    const login = async (username, password) =>{
        setIsLoading(true);
        setError(null);
        try {
         await axios.post(
              `${url}/api/users/login`,
              { username, password }
            ).then((res)=>{
                console.log(res.data.user.role)
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    user: res.data
                  })
                );
                authDispatch({
                  type: "LOGIN",
                  payload: { user: res.data },
                });
                setIsLoading(false);
                if(res.data.user.role !== "user"){
                  window.location = "/admin-dashboard/welcome";
                }else{
                  window.location = "/admin-dashboard/real_time";
                }
            })
        } catch (error) {
            setIsLoading(false)
            setError(error.message);
        }

        

    }
        return {login, isLoading, error, setError}
}