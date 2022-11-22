import { Avatar, ClickAwayListener, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useParams } from 'react-router'
import { useSocket } from '../contexts/Socket'

export interface MessageType{
  id?:string
  senderLogin: string
  senderAvatarURL:string
  text:string
  timestamp?:string
}

const Message = ({id, senderLogin, senderAvatarURL, text, timestamp}:MessageType) => {
  const {login} = useParams()
  const [IsManaging, setIsManaging] = useState(false)
  const {current: socket} = useSocket()

  const deleteMessage = () =>{
     axios({
            method:"POST",
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND}/messages/${login}/delete`,
            data: { id, senderLogin }
          }).then((res)=>{
            socket?.emit("deleteMessage", {id, senderLogin}, login)
            if(res.data==="Message deleted and conversation updated!") {
              socket?.emit("createConversation", login)
            }
          })
  }

  return (
<ClickAwayListener onClickAway={() => { setIsManaging(false) }}>
  <Box sx={{position:"relative",display:"flex", gap:1, padding:"12px", background: IsManaging? "#2c2f33" : "#36393f"}} onClick={() => { setIsManaging(true)}} onMouseOver={() => { setIsManaging(true) }} onMouseOut={() => { setIsManaging(false) }}>
        {IsManaging && senderLogin!==login && <Box sx={{position:"absolute", right:4}}><FaTrash onClick={deleteMessage} style={{cursor:"pointer", height:20}}/></Box>}
        <Avatar sx={{width:50, height:50}} src={senderAvatarURL}/>
        <Box sx={{ padding:0.5,
            display: 'flex',flexDirection: 'column', alignItems: 'flex-start'
          }}>
                <Typography variant="h6" sx={{pb:0, mb:0, lineHeight:"1rem", display:"flex", alignItems:"center", justifySelf:'flex-start', flexWrap:"wrap", width:1}}>
                  <b style={{wordBreak:"break-all"}}>
                    {senderLogin}
                    </b>
                    {IsManaging && 
                    <i style={{paddingLeft:8, fontSize:12}}>
                   {timestamp} 
                    </i>
                    }
                </Typography>
                <Typography variant="subtitle1" sx={{textAlign:"left", wordWrap:"unset", wordBreak:"break-all", lineHeight:1.4}}>
                    {text} 
                </Typography>
            </Box>
    </Box>
              </ClickAwayListener>
  )
}

export default Message