import { Button } from '@mui/material'
import { Box } from '@mui/system'
import PersonHeader from '../components/PersonHeader'
import TopSection from '../components/TopSection'
import { useNavigate, useParams } from 'react-router'
import { useState } from 'react'
import { AvatarDialog } from '../components/Dialogs/Settings/Avatar'
import { PasswordDialog } from '../components/Dialogs/Settings/Password'
import { DeleteDialog } from '../components/Dialogs/Settings/Delete'
import { useUser } from '../contexts/User'
import axios from 'axios'

const Setting = () => {
  const {settingType } = useParams()
  const navigate = useNavigate()
  const [AvatarDialogOpen, setAvatarDialogOpen] = useState(false)
  const [PasswordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const {User, dispatchUser } = useUser()

  return (
    <Box sx={{width:"100%", height:"100%"}}>
      {settingType === "account" && 
        (
          <>
        <TopSection name="Account" variant="setting"/>
        <PersonHeader login={User.login} avatarURL={User.avatarURL}/>
        <Box sx={{display:"flex", gap:2, padding: 2, justifyContent:"center", flexWrap:"wrap"}}>
        <Button variant="contained" onClick={() => { setAvatarDialogOpen(true) }}>
        Change Avatar
        </Button>
        <Button variant="contained" onClick={() => { setPasswordDialogOpen(true) }}>
        Change Password
        </Button>
        <Button variant="contained" color="error" onClick={()=>{
          navigate("/")
                axios({
                  method:"POST",
                  url:`${process.env.REACT_APP_BACKEND}/account/logout`,
                  withCredentials:true,
                  data:{ id: User._id }
      }).then(res=>{})
        }}>
          Logout
        </Button>
                  <Button variant="outlined" color="error" onClick={() => { setDeleteDialogOpen(true) }}>
                  Delete account
                  </Button>
        </Box>
        {AvatarDialogOpen && <AvatarDialog AvatarDialogOpen={AvatarDialogOpen} setAvatarDialogOpen={setAvatarDialogOpen}/>}
        {PasswordDialogOpen && <PasswordDialog PasswordDialogOpen={PasswordDialogOpen} setPasswordDialogOpen={setPasswordDialogOpen}/>}
        {DeleteDialogOpen && <DeleteDialog DeleteDialogOpen={DeleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen}/>}
    </>  
      )
    }
    </Box>
  )
}

export default Setting