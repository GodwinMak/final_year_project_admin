import React, { useState, useEffect } from 'react';
import { Radio } from "@material-tailwind/react";
import { Textarea, Select } from "flowbite-react";
import Datepicker from "flowbite-datepicker/Datepicker";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { url } from '../../utils/API';

const AddAnimal = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        animal_name: "",
        animal_sex: "",
        area_name: "",
        animal_birth_date: "",
        animal_description: ""
    });

    const [areas, setAreas] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${url}/api/areas/all`
                );

                setAreas(response.data)

            } catch (error) {
                console.log(error)
            }

        }

        fetchData()
    }, [])

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const handleDateChange = (date) => {
        try {
            console.log(date.target.value)
            setValues({ ...values, animal_birth_date: date.target.value });
        } catch (error) {
            console.log(error)
        }

    };

    const handleDescriptionChange = (value) => {
        setValues({ ...values, animal_description: value });
    };

    useEffect(() => {
        const datepickerEl = document?.getElementById("datepickerId");
        new Datepicker(datepickerEl, {});
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { area_name, animal_birth_date, animal_description, animal_sex, animal_name } = values;
            if (areas.length === 0) return;
            const area = areas.find((a) => a.area_name === area_name);

            await axios.post(`${url}/api/animals/createAnimal`, {
                animal_name,
                animal_sex,
                animal_description,
                animal_birth_date,
                area_id: area.area_id
            }).then((res) => {
                setValues({
                    animal_name: "",
                    animal_sex: "",
                    area_name: "",
                    animal_birth_date: "",
                    animal_description: ""
                })
                navigate("/admin-dashboard/view_users");
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='p-6 mb-6 bg-slate-50  md:container md:mx-auto'>
                <h2>Add Animal</h2>
                <form className='w-full max-w-lg mx-auto mt-8' onSubmit={handleSubmit}>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-first-name"
                            >
                                Animal Name
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="grid-first-name"
                                type="text"
                                placeholder="Elephant"
                                name="animal_name"
                                value={values.animal_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className="w-full px-3">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-username"
                            >
                                Gender
                            </label>
                            <div className="flex gap-10">
                                <Radio name="animal_sex" label="Male" onChange={handleChange} value="Male" />
                                <Radio name="animal_sex" label="Female" onChange={handleChange} value="Female" />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-username"
                            >
                                Date of Birth
                            </label>
                            <div className="relative w-full">
                                <input
                                    datepicker
                                    datepicker-autohide
                                    type="text"
                                    className='block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm pl-10 rounded-lg'
                                    placeholder="Select date"
                                    onSelect={handleDateChange}
                                    id="datepickerId"
                                />
                                <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                                    <svg
                                        aria-hidden="true"
                                        class="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clip-rule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className='w-full px-3'>
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-username"
                            >
                                Animal Description
                            </label>
                            <Textarea placeholder="Animal description..." required rows={4} onChange={(e) => handleDescriptionChange(e.target.value)} value={values.animal_description} />
                        </div>
                    </div>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                        <div className="w-full px-3">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-username"
                            >
                                Animal Location Area
                            </label>
                            <Select id="Area" required onChange={handleChange} name="area_name">
                                <option defaultValue>Choose Role</option>
                                {areas &&
                                    areas.map((area, index) => {
                                        return <option key={index}>{area.area_name}</option>;
                                    })}
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6 px-3">
                        <button
                            type="submit"
                            className="
                w-full text-white bg-orange-600 
                hover:bg-range-100 focus:ring-4 focus:outline-none 
                focus:ring-orange-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center dark:bg-orange-600 
                dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                        >
                            Add Animal
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddAnimal
