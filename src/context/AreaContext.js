import React, { createContext, useReducer } from "react";
import { url } from "../utils/API";
import axios from "axios"
import { useAuthContext } from "../hooks/useAuthContext";

const initialState = {
  polygonCoordinates: {},
  locationCoordinates: {},
  locationArea: 0,
  area_name: '',
  zone_geojson: {},
  Area:{},
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
    case "ZONE_GEOJSON":
      return {
        ...state,
        zone_geojson: action.payload,
      };
    case "AREA":
      return {
        ...state,
        Area: action.payload,
      };
    case "SET_AREA_NAME":
      return {
        ...state,
        area_name: action.payload,
      };

    default:
      return state;
  }
};

const convertToGeoJSON = (apiData) => {
  // Helper function to convert a single item to GeoJSON format
  const convertItemToGeoJSON = (item) => ({
    type: "Feature",
    properties: { ...item, createdAt: undefined, updatedAt: undefined },
    geometry: item.area_polygon,
  });

  // Check if apiData is an array
  const features = Array.isArray(apiData)
    ? apiData.map(convertItemToGeoJSON).flat()
    : [convertItemToGeoJSON(apiData)];

  return {
    type: "FeatureCollection",
    features: features,
  };
};

export const AreaContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(areaReducer, initialState);

const user = useAuthContext();

  React.useEffect(()=>{
    const fetchAreas = async () => {
      try {
        if(user){
          if (user.user.user.user.area_id === null) {
            console.log("no area")
            const response = await axios.get(`${url}/api/areas/all`);
            dispatch({
              type: "ZONE_GEOJSON",
              payload: convertToGeoJSON(response.data),
            });
            dispatch({
              type: "AREA",
              payload: response.data,
            });
          } else {
            console.log('area');
            const response = await axios.get(
              `${url}/api/areas/${user.user.user.user.area_id}`
            );
            dispatch({
              type: "ZONE_GEOJSON",
              payload: convertToGeoJSON(response.data),
            });
            dispatch({
              type: "AREA",
              payload: response.data,
            });
          }
        }
        
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchAreas();
  },[user])

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
