import React, {useState, useContext, useEffect} from 'react'
import Navbar from '../../components/admin-navbar/navbar';
import Sidebar from '../../components/admin-sidebar/sidebar';
import ViewUsers from '../../components/admin-users/ViewUsers';
import Areas from '../../components/admin-areas/areas';
import AddArea from '../../components/admin-areas/AddArea';
import AddVirtualFence from '../../components/admin-areas/AddVirtualFence';
import Reports from '../../components/admin-reports/reports';
import { Context } from '../../context';
import {useParams} from 'react-router-dom'; 
// import {Data} from '../../data/jummy'
import AddUser from '../../components/admin-users/AddUser';
import AnimalList from '../../components/admin_animal/Animal_List';
import AreaMap from '../../components/admin-areas/AreaMap';
import Summary from '../../components/admin-summary/Summary';
import ViewProfile from "../../components/admin-settings/ViewProfile"
import ChangePassword from '../../components/admin-settings/ChangePassword';
const AdminDashboard = () => {
  const {category} = useParams();
  console.log(category)
  // let cat = Data.find((categ) => categ.url === parseInt(category) );

  let { state, dispatch } = useContext(Context)
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
          }  w-screen  z-10 mt-[76px]`}
          style={{ height: "calc(100vh - 76px)" }}
        >
          {category === "add_user" && <AddUser />}
          {category === "view_users" && <ViewUsers />}
          {category === "edit_user" && <AddUser />}
          {category === "add_area" && <AddArea />}
          {category === "fence" && <AddVirtualFence />}
          {category === "view_areas" && <Areas />}
          {category === "area_map" && <AreaMap />}
          {category === "view_animlas" && <AnimalList />}
          {category === "events_reports" && <Reports />}
          {category === "summary" && <Summary />}
          {category === "profile" && <ViewProfile />}
          {category === "change_password" && <ChangePassword/>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard
