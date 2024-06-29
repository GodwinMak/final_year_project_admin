import React from "react";
import { RealTimeContext } from "../../../context/RealTimeContext";
import DefaultMap from "./DefaultMap";
import LineMap from "./LineMap"
import ConvexHull from "./ConvexHull";
import ConcaveHull from "./ConcaveHull";


const Analysis = () => {
  const { state: animalState, dispatch } = React.useContext(RealTimeContext);
  const [layer, setLayer] = React.useState("")
  console.log(animalState.layer)

  const handleClick = () => {
    dispatch({
      type: "MODAL",
      payload: false,
    });
    setLayer(animalState.layer)
  };

  return (
    <>
      <div className="">
        {layer === "" && <DefaultMap />}
        {layer === "Line Time Map" && !animalState.modal && <LineMap />}
        {layer === "Minimum Convex Hull" && !animalState.modal && (
          <ConvexHull />
        )}
        {layer === "Alpha Hull" && !animalState.modal && <ConcaveHull />}
      </div>
      {animalState.modal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50"
          id="my-modal"
        >
          <div className=" border w-96 shadow-lg rounded-md bg-white relative inset-x-56">
            <div className="flex items-center justify-between p-1 md:p-2 border-b rounded-t dark:border-gray-600 bg-orange-500">
              <h3 className="text-xl font-semibold text-white dark:text-white">
                Complete Selection
              </h3>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Continue Selecting the animals or slide the time slider and
                click Done when finish
              </p>
            </div>
            <div className="flex items-center p-2 md:p-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="py-2 px-2  text-sm font-medium text-white focus:outline-none bg-orange-500 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={handleClick}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Analysis;
