import React, { useContext, useState } from 'react'
import { Context } from "../../context";
import { RealTimeContext } from "../../context/RealTimeContext"

const RealTimeSidebar = () => {
  const { state: animalState, dispatch } = React.useContext(RealTimeContext)
  

  const animalData = animalState.RealTimeData.map((objt) => {
    const data2 = animalState.color.find(objt2 => objt2.id === objt.animal_TagId);

    const date = new Date(objt.animal_birthDay);
    const formattedDate = date.toISOString().split('T')[0];
    const birthDate = new Date(formattedDate);
    const currentDate = new Date();

    // Calculate the difference in milliseconds between the two dates
    const timeDifference = currentDate - birthDate;

    // Convert milliseconds to years
    const ageInMilliseconds = new Date(timeDifference);
    const age = Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);

    return data2 ? { id: objt.animal_TagId, data: objt.animalLocations[0].animal_location, battery: objt.animalLocations[0].device_status, name: objt.animal_name, birthday: formattedDate, animal_sex: objt.animal_sex, age: age, color: `rgb(${data2.color[0]}, ${data2.color[1]}, ${data2.color[2]})` } : null;
  })

  const { state } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  // Function to handle search term change
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered animal data based on search term

  const filteredData = animalData && animalData.filter((animal) => 
    animal.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFlyToLocation = (coordinates) => {
    // flyToLocation(coordinates);
    console.log("object")
    dispatch({ type: "SET_FLYTO", payload: coordinates })
  };

  return (
    <div
      className={`w-[26rem] ${state.toggle ? "block" : "hidden"
        } bg-gray-300 h-full overflow-hidden md:overflow-auto py-6 bg-white border-r border-neutral-200 flex-col justify-start items-start gap-4 inline-flex bg-gray-100 pl-4 pr-2`}
    >
      <div className=' flex flex-col  w-full mb-16'>
        <form className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 
                border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 
                focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder="Search Mockups, Logos..."
              onChange={handleSearchTermChange}
              required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-orange-800">Search</button>
          </div>
        </form>
        <h2 className='text-left  pt-7 font-bold'>Tracked Animals</h2>

        {searchTerm ? (
          // Render filtered animal data if search term exists
         filteredData && filteredData.map((data, index) => (
           <div key={index} className="justify-between items-center w-full p-3.5 bg-gray-100 hover:bg-gray-300 rounded-lg  mt-2 border-2  border-transparent hover:border-orange-500">
             <div className="flex flex-col">
               <div className='flex flex-row gap-2' >
                 <div>
                   <h3 className="text-sm font-semibold">Animal Name: {data.name}</h3>
                   <p className="text-xs text-gray-500">Animal Age: {data.age}</p>
                   <h3 className='text-sm font-semibold'>Animal Sex: {data.animal_sex}</h3>
                 </div>
                 <div className="flex-grow"></div>
                 <div className="w-28 h-12  rounded-none" style={{ background: data.color }}></div>
               </div>
               <hr className="border-t border-gray-500 my-4"></hr>
               <div>
                 <h3 className='text-sm font-semibold'>Date birth: {data.birthday}</h3>
                 <h3 className='text-sm font-semibold'>current Location: {data.data.coordinates[1]} {data.data.coordinates[0]}</h3>
                 <h3 className='text-sm font-semibold'>Battery Status: {data.battery}</h3>
               </div>
               <div className='mt-3'>
                 <button className='cursor-pointer bg-orange-500 rounded-full p-2' 
                 onClick={() => handleFlyToLocation([data.data.coordinates[1] ,data.data.coordinates[0]])}>Fly to Location</button>
               </div>
             </div>
           </div>
          ))
        ) : (
          // Render all dummy data if there's no search term
          animalData.map((data, index) => (
            <div key={index} className="justify-between items-center w-full p-3.5 bg-gray-100 hover:bg-gray-300 rounded-lg  mt-2 border-2  border-transparent hover:border-orange-500">
              <div className="flex flex-col">
                <div className='flex flex-row gap-2' >
                  <div>
                    <h3 className="text-sm font-semibold">Animal Name: {data.name}</h3>
                    <p className="text-xs text-gray-500">Animal Age: {data.age}</p>
                    <h3 className='text-sm font-semibold'>Animal Sex: {data.animal_sex}</h3>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="w-28 h-12  rounded-none" style={{ background: data.color }}></div>
                </div>
                <hr className="border-t border-gray-500 my-4"></hr>
                <div>
                  <h3 className='text-sm font-semibold'>Date birth: {data.birthday}</h3>
                  <h3 className='text-sm font-semibold'>current Location: {data.data.coordinates[1]} {data.data.coordinates[0]}</h3>
                  <h3 className='text-sm font-semibold'>Battery Status: {data.battery}</h3>
                </div>
                <div className='mt-3'>
                  <button className='cursor-pointer bg-orange-500 rounded-full p-2'
                    onClick={() => handleFlyToLocation([data.data.coordinates[1], data.data.coordinates[0]])}
                  >Fly to Location</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RealTimeSidebar
