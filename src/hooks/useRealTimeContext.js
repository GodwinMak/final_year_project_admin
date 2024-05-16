import { useContext } from "react";
import { RealTimeContext } from "../context/RealTimeContext";

export const useRealTimeContext = () => {
    const context = useContext(RealTimeContext)
    if(!context){
        throw new Error('useRealTimeContext must be used inside an RealTimeContextProvider')
    }

    return context;
}