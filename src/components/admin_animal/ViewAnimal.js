import React from 'react'
import { useAnimalContext } from '../../hooks/useAnimalContext'
const ViewAnimal = () => {
  const animalData = useAnimalContext()
  console.log(animalData)
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                <img src="https://randomuser.me/api/portraits/men/94.jpg" alt = "" className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0" />
                <h1 className="text-xl font-bold">{animalData.animalData.animal_name}</h1>
                <p className="text-gray-700">Age: {animalData.animalData.age}</p>
              </div>
              <hr className="my-6 border-t border-gray-300" />
              <div className="flex flex-col">
                <ul>
                  <li className="mb-2">Area: {animalData.animalData.area.area_name}</li>
                  <li className="mb-2">Sex: {animalData.animalData.animal_sex}</li>
                  <li className="mb-2">Day of birth: {formatDate(animalData.animalData.animal_birthDay)}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About {animalData.animalData.animal_name}</h2>
              <p className="text-gray-700">{animalData.animalData.animal_description}
              </p>
              {/* <h2 className="text-xl font-bold mt-6 mb-4">Experience</h2>
              <div className="mb-6">
                <div className="flex justify-between flex-wrap gap-2 w-full">
                  <span className="text-gray-700 font-bold">Web Developer</span>
                  <p>
                    <span className="text-gray-700 mr-2">at ABC Company</span>
                    <span className="text-gray-700">2017 - 2019</span>
                  </p>
                </div>
                <p className="mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                  tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                  suscipit.
                </p>
              </div>
              <div className="mb-6">
                <div className="flex justify-between flex-wrap gap-2 w-full">
                  <span className="text-gray-700 font-bold">Web Developer</span>
                  <p>
                    <span className="text-gray-700 mr-2">at ABC Company</span>
                    <span className="text-gray-700">2017 - 2019</span>
                  </p>
                </div>
                <p className="mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                  tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                  suscipit.
                </p>
              </div>
              <div className="mb-6">
                <div className="flex justify-between flex-wrap gap-2 w-full">
                  <span className="text-gray-700 font-bold">Web Developer</span>
                  <p>
                    <span className="text-gray-700 mr-2">at ABC Company</span>
                    <span className="text-gray-700">2017 - 2019</span>
                  </p>
                </div>
                <p className="mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                  tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                  suscipit.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ViewAnimal
