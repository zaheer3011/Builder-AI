import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Loading from '../Components/Loading';

export const AuthLayout = () => {

  const {user, isLoading} = useAppContext();

  if(isLoading) return <Loading/>
  if(!user) return <Navigate to='/login' replace />

  return <Outlet />
}

export const GuestLayout = () => {

    const {user, isLoading} = useAppContext();

    if(isLoading) return <Loading />
    if(user) return <Navigate to='/' replace />

    return <Outlet />
}