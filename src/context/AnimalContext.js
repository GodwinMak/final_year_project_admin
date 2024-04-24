import React, {createContext, useReducer} from 'react';

const initialState = {
    animalData: JSON.parse(localStorage.getItem('animalData')) || {}
};


export const AnimalContext = createContext();

export const animalReducer = (state, action) => {
    switch(action.type){
        case 'SET_ANIMAL_DATA':
            return {
                ...state,
                animalData: action.payload
            }
        default:
            return state;
    }
}

export const AnimalContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(animalReducer, initialState);

    // Effect to store state in localStorage whenever state changes
    React.useEffect(() => {
        localStorage.setItem('animalData', JSON.stringify(state.animalData));
    }, [state.animalData]);

    return (
        <AnimalContext.Provider
            value={{
                ...state,
                dispatch
            }}
        >
            {children}
        </AnimalContext.Provider>   
    )
}