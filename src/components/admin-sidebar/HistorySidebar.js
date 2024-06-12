/* eslint-disable no-unused-vars */
import React,{useEffect, useState, useContext} from 'react'
import { Context } from "../../context";
import { RealTimeContext } from "../../context/RealTimeContext"


const HistorySidebar = () => {
    const { state } = useContext(Context);
    const { state: animalState, dispatch } = React.useContext(RealTimeContext)

    console.log(animalState.color)
  return (
      <div
          className={`w-[18rem] ${state.toggle ? "block" : "hidden"
              } bg-gray-300 h-full overflow-hidden md:overflow-auto py-6 bg-white border-r border-neutral-200 flex-col justify-start items-start gap-4 inline-flex bg-gray-100 pl-4 pr-2`}
      >
          <h4 className="uppercase px-3.5 text-sm font-bold">Animal List</h4>
          <div className="flex px-3.5">
              <input
                  type="checkbox"
                  className="shrink-0 mt-0.5 border-gray-200 rounded text-orange-600 focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  id="hs-checked-checkbox"
                //   checked={state.selectedAll}
                //   onChange={handleSelectAllAnimals}
              />
              <label
                  htmlFor="hs-checked-checkbox"
                  className="text-sm text-gray-500 ms-3 "
              >
                  Select All
              </label>
          </div>
          {
            animalState.color && animalState.color.map((data, index)=>{
                return (
                    <div
                        key={index}
                        className="self-stretch duration-300 cursor-pointer px-[18px] py-3.5 justify-start items-center gap-3 inline-flex"
                    >
                        <div className="flex items-center ">
                            <input
                                type="checkbox"
                                id="hs-xs-switch"
                                className="relative w-[28px] h-[17px] bg-gray-500 
                      border-transparent text-transparent rounded-full cursor-pointer 
                      transition-colors ease-in-out duration-200 focus:ring-transparent disabled:opacity-50
                       disabled:pointer-events-none checked:bg-none checked:text-orange-600 checked:border-orange-600 
                       focus:checked:border-orange-600 
                      before:inline-block before:w-3 before:h-3 before:bg-white 
                      checked:before:bg-blue-200 before:translate-x-[2px] before:-translate-y-1 checked:before:translate-x-full 
                      before:rounded-full before:shadow before:transform before:ring-0 before:transition 
                      before:ease-in-out before:duration-200"
                                // checked={animalState.color.includes(data.id)}
                                // onChange={() => handleToggleAnimalSelection(data.id)}
                            />
                            <label
                                htmlFor="hs-xs-switch"
                                className="text-sm text-gray-500 ms-3 dark:text-gray-400"
                            >
                                {data.name}
                            </label>
                            <span
                                className="w-3 h-3 rounded-full ms-2"
                                style={{
                                    background: `rgb(${data.color})`,
                                }}
                            ></span>
                        </div>
                    </div>
                )
            })
          }
      </div>
  )
}

export default HistorySidebar
