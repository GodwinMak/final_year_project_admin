import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAreaContext } from "../../hooks/useAreaContext";
import axios from 'axios'
import { url } from "../../utils/API";

const AddArea = () => {
  const navigate = useNavigate();

  const handleAddLocation = () => {
    // Navigate to the specified URL
    navigate("/admin-dashboard/area_map");
  };

  const areaLocation = useAreaContext();
  const { dispatch: areaDispatch } = useAreaContext();



  const [values, setValues] = useState({
    area_name: "",
    area_area: 0.0,
  })

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async(event)=>{
    event.preventDefault();
    const {area_name} = values;
    console.log(area_name)
    const area_location = {
      type: "Point",
      coordinates: [
        areaLocation.locationCoordinates.longitude,
        areaLocation.locationCoordinates.latitude,
      ],
    };
    const area_polygon = {
      type: "Polygon",
      coordinates: areaLocation.polygonCoordinates.geometry.coordinates,
    };
    try {
       await axios
         .post(`${url}/api/areas/create`, {
           area_name,
           area_area: areaLocation.locationArea,
           area_location,
           area_polygon,
         })
         .then(() => {
           areaDispatch({ type: "GET_LOCATION_AREA", payload: 0 });
           areaDispatch({
             type: "SET_LOCATION_COORDINATES",
             payload: {},
           });
           areaDispatch({
             type: "SET_POLYGON_COORDINATES",
             payload: {},
           });
         });
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className="p-6 mb-6 bg-slate-50 min-h-sreen">
      <h2>Area Registration</h2>
      <form className="w-full w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Area Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-area-name"
              type="text"
              placeholder="Serengeti"
              name="area_name"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6 px-3">
          <button
            onClick={handleAddLocation}
            type="button"
            className=" w-full text-white bg-orange-600 
                hover:bg-range-100 focus:ring-4 focus:outline-none 
                focus:ring-orange-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center dark:bg-orange-600 
                dark:hover:bg-orange-700 dark:focus:ring-orange-800"
          >
            <i className="fa-solid fa-map-location-dot" />

            <span className="mx-2">Add Location On Map</span>
          </button>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-longitude"
            >
              Longitude
            </label>
            <input
              readOnly
              value={areaLocation.locationCoordinates.longitude}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="longitude"
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-latitude"
            >
              Latitude
            </label>
            <input
              value={areaLocation.locationCoordinates.latitude}
              readOnly
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="latitude"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-area"
            >
              Area Square meters
            </label>
            <input
              value={areaLocation.locationArea}
              readOnly
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="area_area"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <button
              type="submit"
              className="
                w-full text-white bg-orange-600 
                hover:bg-range-100 focus:ring-4 focus:outline-none 
                focus:ring-orange-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center dark:bg-orange-600 
                dark:hover:bg-orange-700 dark:focus:ring-orange-800"
            >
              Save Area
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddArea;
