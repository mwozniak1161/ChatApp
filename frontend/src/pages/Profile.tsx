import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import PersonHeader from '../components/PersonHeader'
import TopSection from '../components/TopSection'
import { useSocket } from '../contexts/Socket'
import getCookie from '../utils/getCookie'

const Profile = () => {
  const initialState = {
    login:"",
    avatarURL:"",
    isFriend:false,
    isPendingFriend:false,
    isPendingInvitation:false,
    isOnline:false,
    memberSince:"string"
  }
  const [profileData, setProfileData] = useState(initialState)
  const { login } = useParams()
  const { current: socket } = useSocket()

  const getProfileData = () =>{
    axios({
      method: 'GET',
      url:`${process.env.REACT_APP_BACKEND}/profiles/${login}`,
      withCredentials:true,
    }).then((res)=>{
      setProfileData(res.data)
    })
  }

  useEffect(() => {
  getProfileData()
    return () => {
      setProfileData(initialState)
    }
  }, [login])
  
  const addFriend = () => {
    axios({
      method:"POST",
      url:`${process.env.REACT_APP_BACKEND}/profiles/${login}/add`,
      withCredentials:true,
    })
    socket?.emit("changeProfile", login)
  }

  const removeFriend = () =>{
    axios({
      method:"POST",
      url:`${process.env.REACT_APP_BACKEND}/profiles/${login}/remove`,
      withCredentials:true,
    })
    socket?.emit("changeProfile", login)
  }

  const acceptFriend = () => {
    axios({
      method:"POST",
      url:`${process.env.REACT_APP_BACKEND}/profiles/${login}/accept`,
      withCredentials:true,
    }).then((res)=>{
    })
    socket?.emit("changeProfile", login)
  }

useEffect(() => {
  
  socket?.on("profileChanged", ()=>{
    getProfileData()
  })

}, [socket])


  const isYou = getCookie("login")===login

  return (
    <Box sx={{width:"100%", height:"100%"}}>
        <TopSection name={login} variant="profile"/>
        <PersonHeader login={profileData?.login} avatarURL={profileData?.avatarURL}/>
        <Box sx={{display:"flex", flexDirection:"column", textAlign:"left", padding:5, overflowY:"scroll", height:"calc(100vh - 248px)"}}>
        {!isYou && <>
        <Typography variant="h4" fontWeight={600}>
        Manage 
        </Typography>
        <Box sx={{display:"flex", flexWrap:"wrap", gap:4, pt:2}}>
        <Link to={`/app/conversations/${login}`}>
        <Button variant='contained'>
        Go to conversation
        </Button>
        </Link>
        {profileData?.isFriend && 
        <Button variant='contained' color='error' onClick={removeFriend}>
        Delete Friend
        </Button>
        }
        {(!profileData?.isFriend && !profileData?.isPendingFriend && !profileData?.isPendingInvitation) &&
        <Button variant='contained' color='success' onClick={addFriend}>
        Add Friend
        </Button>
        }
        {profileData?.isPendingFriend && 
        <Button variant='contained' color='success' onClick={acceptFriend}>
        Accept Friend
        </Button>
        }
        {profileData?.isPendingInvitation && 
        <Button variant='contained' color='primary'>
        Pending invitation...
        </Button>
        }
        </Box>
        </>}
        

        <Typography variant="h4" fontWeight={600} mt={4}>
          Info
        </Typography>
          <Typography variant="h6">
        <b>
        Status:
        </b> {profileData?.isOnline ? "Online" : "Offline" }
        </Typography>
<Typography variant="h6">
        <b>
        Member since:
        </b> { profileData?.memberSince }
        </Typography>
        </Box>
    </Box>
  )
}

export default Profile