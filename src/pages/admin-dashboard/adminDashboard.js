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
import Profile from "../../components/admin-settings/Profile"
import Welcome from '../Welcome';
import AddAnimal from '../../components/admin_animal/AddAnimal';
import ViewAnimal from '../../components/admin_animal/ViewAnimal';
import { useAuthContext } from '../../hooks/useAuthContext';
import RealTimeMap from '../../components/Map/RealTimeMap';
import History from '../../components/Map/History';

const AdminDashboard = () => {
  let { state, dispatch } = useContext(Context);
  const {category} = useParams();
  const user = useAuthContext()

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
              ? ` ${
                  state.toggleNavbar
                    ? category === "welcome"
                      ? "md:ml-[90px]"
                      : "md:ml-[310px]"
                    : "ml-0 "
                }`
              : ` ${state.toggleNavbar ? "md:ml-[90px]" : "ml-0"}`
          }  w-full  z-10 mt-[76px]`}
        >
          {user && user.user.user.user.role === "admin" && (
            <>
              {category === "welcome" && <Welcome />}
              {category === "add_user" && <AddUser />}
              {category === "view_users" && <ViewUsers />}
              {category === "edit_user" && <AddUser />}
              {category === "add_area" && <AddArea />}
              {category === "view_areas" && <Areas />}
              {category === "area_map" && <AreaMap />}
              {category === "add_animal" && <AddAnimal />}
              {category === "view_animals" && <AnimalList />}
              {category === "events_reports" && <Reports />}
              {category === "view_animal" && <ViewAnimal />}
            </>
          )}
          {category === "change_password" && <ChangePassword />}
          {category === "real_time" && <RealTimeMap />}
          {category === "profile" && <Profile />}
          {user && user.user.user.user.role === "user" && (
            <>{category === "history" && <History />}</>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard
