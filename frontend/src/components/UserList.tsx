import { Box } from '@mui/material'
import React from 'react'

interface UserList{
  children: React.ReactNode
}
const UserList = ({children}: UserList) => {
  return (
    <Box sx={{overflowY:"overlay", maxWidth:"100%", height:"calc(100vh - 146px)"}} >{children}</Box>
  )
}

export default UserList