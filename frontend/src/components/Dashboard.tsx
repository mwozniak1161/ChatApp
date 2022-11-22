import { Box } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { SocketProvider } from '../contexts/Socket'
import { useUser } from '../contexts/User'
import getCookie from '../utils/getCookie'
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
  const location = useLocation();
  const { User, dispatchUser } = useUser()

  let cookie = getCookie("login")

  
  useEffect(() => {
    axios({
      method:"GET",
      url:`${process.env.REACT_APP_BACKEND}/account/users/${getCookie("login")}`
    }).then((res)=>{
      dispatchUser({type:"load", payload: res.data})
    })


    return () => {
      dispatchUser({type:"reset"})
    }
  }, [])
  
  useEffect(() => {
    cookie = getCookie("login")
  }, [location])
  


  return (
    <>
    {cookie ?
      <SocketProvider>
      <Box sx={{display:"flex", width:"100vw", height:"100vh", position:"relative", overflow:"hidden !important"}}>
      <Navbar/>
      <Outlet/>
      </Box>
      </SocketProvider>
      :
      <Navigate to="/" replace/>}
      </>
  )
}

export default Dashboard