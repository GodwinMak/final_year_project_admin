/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../context";
import { RealTimeContext } from "../../context/RealTimeContext";

const AnalysisSidebar = () => {
  const { state } = useContext(Context);
  const { state: animalState, dispatch } = React.useContext(RealTimeContext);
  const [rangeValue, setRangeValue] = useState(1);
  const [allSelected, setAllSelected] = useState(true);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState("");

  useEffect(() => {
    setSelectedAnimals(animalState.color.map((data) => data.id));
    dispatch({
      type: "SELECTED_ANIMALS",
      payload: animalState.color.map((data) => data.id),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalState.color]);

  const handleRangeChange = (event) => {
    setRangeValue(event.target.value);
    dispatch({
      type: "NUMBER_OF_DAYS",
      payload: event.target.value,
    });
    dispatch({
      type: "MODAL",
      payload: true,
    });
  };

  const handleSelectAllAnimals = () => {
    if (allSelected) {
      setSelectedAnimals([]);
    } else {
      setSelectedAnimals(animalState.color.map((data) => data.id));
      dispatch({
        type: "SELECTED_ANIMALS",
        payload: animalState.color.map((data) => data.id),
      });
    }
    setAllSelected(!allSelected);
  };

  const handleToggleAnimalSelection = (id) => {
    let newSelectedAnimals = [...selectedAnimals];
    if (newSelectedAnimals.includes(id)) {
      newSelectedAnimals = newSelectedAnimals.filter(
        (animalId) => animalId !== id
      );
      setAllSelected(false);
    } else {
      newSelectedAnimals.push(id);
      if (newSelectedAnimals.length === animalState.color.length) {
        setAllSelected(true);
      }
    }
    setSelectedAnimals(newSelectedAnimals);
    dispatch({
      type: "SELECTED_ANIMALS",
      payload: newSelectedAnimals,
    });
    dispatch({
      type: "MODAL",
      payload: true,
    });
  };

  const handleLayerSelection = (layer) => {
    setSelectedLayer(layer);
    dispatch({
      type: "MODAL",
      payload: true,
    });
    dispatch({
      type: "LAYER",
      payload: layer,
    });
  };

  useEffect(() => {
    const rangeInput = document.getElementById("steps-range");
    const percentage =
      ((rangeValue - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
    rangeInput.style.background = `linear-gradient(to right, orange ${percentage}%, gray ${percentage}%)`;
  }, [rangeValue]);

  return (
    <div
      className={`w-[18rem] ${
        state.toggle ? "block" : "hidden"
      } bg-gray-300 h-full overflow-hidden md:overflow-auto py-6 bg-white border-r border-neutral-200 flex-col justify-start items-start gap-4 inline-flex bg-gray-100 pl-4 pr-2`}
    >
      <div className="w-full">
        <div>
          <label
            htmlFor="steps-range"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Number of Days Viewed
          </label>
          <input
            id="steps-range"
            type="range"
            min={1}
            max={365}
            value={rangeValue}
            step="1"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 "
            onChange={handleRangeChange}
          />
          <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Days: {rangeValue}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col ">
        <div>
          <h5 className="uppercase">Analysis layers</h5>
        </div>
        <div className="pl-2 flex flex-col flex-wrap gap-2">
          {[
            "Line Time Map",
            "Minimum Convex Hull",
            "Alpha Hull",
          ].map((layer, index) => (
            <div className="items-center flex flex-row gap-1" key={index}>
              <input
                type="checkbox"
                className="shrink-0 mt-0.5 border-gray-200 text-orange-600 focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                checked={selectedLayer === layer}
                onChange={() => handleLayerSelection(layer)}
              />
              <label>{layer}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <input
          type="checkbox"
          className="shrink-0 mt-0.5 border-gray-200  text-orange-600 focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
          id="hs-checked-checkbox"
          checked={allSelected}
          onChange={handleSelectAllAnimals}
        />
        <label
          htmlFor="hs-checked-checkbox"
          className="text-dark-800 ms-3 uppercase"
        >
          Select All
        </label>
      </div>
      {animalState.color &&
        animalState.color.map((data, index) => {
          return (
            <div
              key={index}
              className="self-stretch duration-300 cursor-pointer px-1 py-1 justify-start items-center inline-flex"
            >
              <div className="flex items-center ">
                <input
                  type="checkbox"
                  id={`animal-checkbox-${data.id}`}
                  className="shrink-0 mt-0.5 border-gray-200   text-orange-600 focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  checked={selectedAnimals.includes(data.id)}
                  onChange={() => handleToggleAnimalSelection(data.id)}
                />
                <span
                  className="w-3 h-3 rounded-none ms-2"
                  style={{
                    background: `rgb(${data.color})`,
                  }}
                ></span>
                <label
                  htmlFor={`animal-checkbox-${data.id}`}
                  className=" text-dark-800 ms-3 dark:text-gray-400"
                >
                  {data.name}
                </label>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default AnalysisSidebar;
