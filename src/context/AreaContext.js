import React, { createContext, useReducer } from "react";

const initialState = {
  polygonCoordinates: {},
  locationCoordinates: {},
  locationArea: 0,
  area_name: ''
};

export const AreaContext = createContext();

export const areaReducer = (state, action) => {
  switch (action.type) {
    case "SET_POLYGON_COORDINATES":
      return {
        ...state,
        polygonCoordinates: action.payload,
      };
    case "SET_LOCATION_COORDINATES":
      return {
        ...state,
        locationCoordinates: action.payload,
      };
      case "GET_LOCATION_AREA":
        return {
            ...state,
            locationArea: action.payload,
        };
        case "SET_AREA_NAME":
          return{
            ...state,
            area_name: action.payload
          }
    default:
      return state;
  }
};

export const AreaContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(areaReducer, initialState);

  return (
    <AreaContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AreaContext.Provider>
  );
};
