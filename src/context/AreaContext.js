import React, { createContext, useReducer } from "react";
import { url } from "../utils/API";
import axios from "axios"
const initialState = {
  polygonCoordinates: {},
  locationCoordinates: {},
  locationArea: 0,
  area_name: '',
  zone_geojson: {}
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
      return{
      ...state,
      zone_geojson: action.payload
      }
    case "SET_AREA_NAME":
      return{
        ...state,
        area_name: action.payload
      };
        
    default:
      return state;
  }
};

const convertToGeoJSON = (apiData) => {
  const features = apiData
    .map((item) => {
      const pointFeature = {
        type: "Feature",
        properties: { ...item, createdAt: undefined, updatedAt: undefined },
        geometry: item.area_polygon
      };

      return pointFeature;
    })
    .flat();

  return {
    type: "FeatureCollection",
    features: features,
  };
}
export const AreaContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(areaReducer, initialState);

  React.useEffect(()=>{
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`${url}/api/areas/all`)
        dispatch({
          type: "ZONE_GEOJSON",
          payload: convertToGeoJSON(response.data),
        });
      } catch (error) {
        console.log(error)
      }
    }
    fetchAreas();
  },[])

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
