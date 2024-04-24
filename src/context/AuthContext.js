import React, {createContext, useReducer}  from 'react';


const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || {}
};

export const AuthContext = createContext();
export const authReducer = (state, action) =>{
    switch (action.type){
        case 'LOGIN':
            return {
                user: action.payload
            }
        case 'LOGOUT': 
            return {user: null}
        default:
            return state
    }
}
export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(authReducer, initialState)

    React.useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user));
    }, [state.user]);
    

    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}