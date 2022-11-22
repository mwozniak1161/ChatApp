import { Avatar, Badge, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { FaCircle, FaQuestion } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface UserListItem {
  type: "offline" | "online" | "pending" | "info"
  login:string
  avatarURL:string
}

const UserListItem = ({type, login, avatarURL}:UserListItem) => {
  const badgeColor = type==="online" ? "success" : (type==="offline" ? "warning" : (type==="pending" ? "error" : "info"))
  
  return (
    <Link to={login}>
    <Box sx={{display:"flex", padding:"8px 0px", gap:1, alignItems:"center", maxWidth:"100%", cursor:"pointer"}}>
        <Badge color={badgeColor} badgeContent={type==="pending" ? <FaQuestion/> : <FaCircle/>} overlap="circular" >
        <Avatar src={avatarURL}/>
        </Badge>
        <Tooltip title={login} placement="top" arrow>
        <Typography variant="h6" textOverflow={"ellipsis"}
        whiteSpace={"nowrap"} overflow={"hidden"} sx={{width: "fit-avabile", display:"flex", position:"relative", "&:hover":{textDecoration:"underline"}}}>
          {login}
          </Typography>
          </Tooltip>
    </Box>
          </Link>
  )
}

export default UserListItem