import React from 'react'
import {Route, Routes} from 'react-router-dom';

import AdminDashoard from './pages/admin-dashboard/adminDashboard';
import Login from './pages/Login/Login';

const App = () => {

  return (
    <div className='h-screen w-full'>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/admin-dashboard/:category' element={<AdminDashoard />} />
      </Routes>
      
    </div>
  )
}

export default App
