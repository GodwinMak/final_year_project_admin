import { useContext } from "react";
import { AnimalContext } from "../context/AnimalContext";

export const useAnimalContext = () => {
    const context = useContext(AnimalContext)
    if(!context){
        throw new Error('useAnimalContext must be used inside an AnimalContextProvider')
    }

    return context;
}