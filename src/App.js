import React from 'react'
import {Route, Routes} from 'react-router-dom';
import io from "socket.io-client";   
import AdminDashoard from './pages/admin-dashboard/adminDashboard';
import Login from './pages/Login/Login';
import { url } from './utils/API';
import { useRealTimeContext } from './hooks/useRealTimeContext';

// io.connect(`${url}`);
const App = () => {
  const { dispatch } = useRealTimeContext();
  const socket = io.connect(`${url}`);

  React.useEffect(()=> {
      socket.on("newAnimalData", (newData) => {
          dispatch({type:"NEW_DATA", payload: newData} )
      });

      // return () => socket.disconnect();
  },[dispatch, socket])

  return (
    <div className="h-screen w-full">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard/:category" element={<AdminDashoard />} />
      </Routes>
    </div>
  );
}

export default App
