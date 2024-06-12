/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useEffect, useReducer} from "react";
import io from "socket.io-client";
import axios from "axios"

const initialState = {
    RealTimeData: [],
    listOfAnimal:[],
    color:[],
    location: null
}

export const RealTimeContext = createContext();

export const realTimeReducer = (state, action) =>{
    switch (action.type) {
        case 'SET_REAL_TIME_DATA':
            return {
                ...state,
                RealTimeData: action.payload
            };
        case 'NEW_DATA':
            const newData = action.payload;
            // Update animal location for the corresponding animal
            const updatedRealTimeData = state.RealTimeData.map(animal => {
                if (animal.animal_TagId === newData.animal_TagId) {
                    return {
                        ...animal,
                        animalLocations: [...animal.animalLocations, newData]
                    };
                }
                return animal;
            });
            return {
                ...state,
                RealTimeData: updatedRealTimeData
            };
        case 'LIST_ANIMAL':
            return {
                ...state,
                listOfAnimal: action.payload
            };
        case "SET_COLOR":
            return{
                ...state,
                color: action.payload
            }
        case "SET_FLYTO":
            return{
                ...state,
                location: action.payload
            }
        default:
            return state;
    }
}


export const RealTimeContextProvider = ({children}) =>{
    const socket = io.connect(`https://apiv2.at.patrickmamsery.co.tz/api/socket`)

    const [state, dispatch] = useReducer(realTimeReducer, initialState);

    useEffect(() => {
        // Fetch list of animal data from the database
        const fetchAnimalData = async () => {
            try {
                const response = await axios.get(`https://apiv2.at.patrickmamsery.co.tz/api/animals/`);
                const animalTagIds = response.data.animals.map(animal => animal.animal_TagId);
                dispatch({ type: "LIST_ANIMAL", payload: animalTagIds });
            } catch (error) {
                console.error('Error fetching animal data:', error);
            }
        };

        fetchAnimalData();
    }, []);

    useEffect(() => {
        // Fetch real-time data based on the available animal IDs
        if (state.listOfAnimal.length <= 1) return;
        const fetchRealTimeData = async () => {
            try {
                const response = await axios.get(`https://apiv2.at.patrickmamsery.co.tz/api/animals/realtime`, {
                    params: {
                        animalTagIds: state.listOfAnimal.join(',')
                    }
                });
                dispatch({ type: "SET_REAL_TIME_DATA", payload: response.data });
            } catch (error) {
                console.error('Error fetching real-time data:', error);
            }
        };

        fetchRealTimeData();
    }, [state.listOfAnimal]);

    useEffect (() =>{
        const fetchData = async ()=>{
            try {
                const response = await axios.get(`https://apiv2.at.patrickmamsery.co.tz/api/animals/getColour`)  
                dispatch({ type: "SET_COLOR", payload: response.data})
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    },[])

    useEffect(()=> {
        socket.on("newAnimalData", (newData) => {
            dispatch({type:"NEW_DATA", payload: newData} )
        });

        return () => socket.disconnect();
    },[])


    return (
        <RealTimeContext.Provider value={{state, dispatch }}>
            {children}
        </RealTimeContext.Provider>
    )

}