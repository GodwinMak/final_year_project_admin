import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAreaContext } from "../../hooks/useAreaContext";
import axios from "axios";
import { url } from "../../utils/API";

const AddArea = () => {
  // const navigate = useNavigate();
  const [geojson, setGeojson] = useState(null)

  const { dispatch: areaDispatch } = useAreaContext();

  const [values, setValues] = useState({
    area_name: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event) => {
    setGeojson(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("area_name", values.area_name);
    if (geojson) {
      formData.append("geojson", geojson);
    }
    try {
      await axios
        .post(`${url}/api/areas/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
          setValues({
            area_name: "",
          })
          setGeojson(null)
        });
    } catch (error) {
      console.log(error);
    }
  };
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
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="file_input"
            >
              Upload geo.json File
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <button
              type="submit"
              className="
                w-full text-white bg-gray-800 
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
