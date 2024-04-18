import React, {useState, useContext, useEffect} from 'react'
import Navbar from '../../components/admin-navbar/navbar';
import Sidebar from '../../components/admin-sidebar/sidebar';
import ViewUsers from '../../components/admin-users/ViewUsers';
import Areas from '../../components/admin-areas/areas';
import AddArea from '../../components/admin-areas/AddArea';
import Reports from '../../components/admin-reports/reports';
import { Context } from '../../context';
import {useParams} from 'react-router-dom'; 
import AddUser from '../../components/admin-users/AddUser';
import AnimalList from '../../components/admin_animal/Animal_List';
import AreaMap from '../../components/admin-areas/AreaMap';
import ChangePassword from '../../components/admin-settings/ChangePassword';
import Welcome from '../Welcome';
import AddAnimal from '../../components/admin_animal/AddAnimal';

const AdminDashboard = () => {
  let { state, dispatch } = useContext(Context);
  const {category} = useParams();

  let [size, setSize] = useState(1000)
  window.addEventListener('resize', (e) => {
    setSize(e.currentTarget.innerWidth)
  })

   useEffect(() => {
    size < 768 ? dispatch({ type: 'SET_TOGGLE_NAVBAR', payload: false }) : dispatch({ type: 'SET_TOGGLE_NAVBAR', payload: true })
  }, [dispatch, size])

  return (
    <div className="bg-slate-50">
      <div>
        <Navbar />
      </div>
      <div className="main max-w-full flex flex-1 justify-between">
        <Sidebar />
        <div
          className={` ${
            state.toggle
              ? ` ${state.toggleNavbar ? "md:ml-[310px]" : "ml-0 "}`
              : ` ${state.toggleNavbar ? "md:ml-[90px]" : "ml-0"}`
          }  w-full  z-10 mt-[76px]`}
        >
          {category  === "welcome" && <Welcome/>}
          {category === "add_user" && <AddUser />}
          {category === "view_users" && <ViewUsers />}
          {category === "edit_user" && <AddUser />}
          {category === "add_area" && <AddArea />}
          {category === "view_areas" && <Areas />}
          {category === "area_map" && <AreaMap />}
          {category === "add_animal" && <AddAnimal/>}
          {category === "view_animals" && <AnimalList />}
          {category === "events_reports" && <Reports />}
          {category === "change_password" && <ChangePassword/>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard
