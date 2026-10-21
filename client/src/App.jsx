import React from 'react'
import {Routes, Navigate, Route } from "react-router-dom"
import Auth from './pages/Auth'
import {AuthLayout, GuestLayout} from './pages/Layout'
import Home from './pages/Home'
import Builder from './pages/Builder'
import Preview from './pages/Preview'

const App = () => {
  return (
    <div>
      <Routes>
      {/* Login Routes */}
        <Route element={<GuestLayout/>}>
            <Route path='/login' element={<Auth mode="login"/>}/>
            <Route path='/register' element={<Auth mode="register" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthLayout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/builder/:id' element={<Builder />}/>
            <Route path='/preview/:id' element={<Preview />}/>
        </Route>

        {/* Catch All */}
        <Route path='*'  element={<Navigate to="/" replace />}/>
      </Routes>
    </div>
  )
}

export default App
