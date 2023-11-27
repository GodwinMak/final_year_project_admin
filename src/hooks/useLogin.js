import { useState } from "react";
import {useAuthContext} from "./useAuthContext";
import axios from 'axios'

export const useLogin =() =>{
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch: authDispatch} = useAuthContext();

    const login = async (username, password) =>{
        setIsLoading(true);
        setError(null);
        try {
         await axios.post(
              "https://apiv2.at.patrickmamsery.co.tz/api/users/login",
              { username, password }
            ).then((res)=>{
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    username: res.data.username,
                    role: res.data.role,
                  })
                );
                authDispatch({
                  type: "LOGIN",
                  payload: { username: res.data.username, role: res.data.role },
                });
                setIsLoading(false);
                window.location = "/admin-dashboard/view_users";
            })
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data);
        }

        

    }
        return {login, isLoading, error, setError}
}