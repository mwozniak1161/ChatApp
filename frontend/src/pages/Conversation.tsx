import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import TopSection from "../components/TopSection";
import TextField from "@mui/material/TextField";
import { Avatar, Button, FormControl, Input, Typography } from "@mui/material";
import { MdSend } from "react-icons/md";
import Message, { MessageType } from "../components/Message";
import PersonHeader from "../components/PersonHeader";
import { useParams } from "react-router";
import axios from "axios";
import { useUser } from "../contexts/User";
import getCookie from "../utils/getCookie";
import { useSocket } from "../contexts/Socket";
import { v4 as uuidv4 } from 'uuid';


interface MessageSocket{
  id?:string
  sender:string
  senderURL:string
  text:string
  date:string
}

const Conversation = () => {
  const { login } = useParams()
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState<(MessageType | MessageSocket)[]>(null as unknown as MessageType[])
  const [ReceiverProfile, setReceiverProfile] = useState({avatarURL:""})
  const { User, dispatchUser } = useUser()
  const {current: socket}= useSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)

  useEffect(() => {
    axios({
      method:"GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_BACKEND}/messages/${login}/all`,
    }).then((res)=>{
      setAllMessages(res.data.AllMessages)
    })
    axios({
      method: 'GET',
      url:`${process.env.REACT_APP_BACKEND}/profiles/${login}`,
      withCredentials:true,
    }).then((res)=>{
      setReceiverProfile(res.data)
    })
    
    return () => {
    }
  }, [login])

useEffect(() => {
  messagesEndRef.current.scrollIntoView({block:"end", behavior:"smooth"})
}, [allMessages])


  const sendMessage = () =>{
    let id = uuidv4()
    let isFirst
        if(newMessage!==""){
          axios({
            method:"POST",
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND}/messages/${login}/add`,
            data: { newMessage, id }
          }).then((res)=>{
            if(res.data==="First message sent!") {
              socket?.emit("createConversation", login)
            }
          })
          setAllMessages((prev)=>{return [...prev, {id ,sender: getCookie("login"), senderURL:User.avatarURL, text:newMessage, date: new Date(Date.now()).toISOString()}]})
          socket?.emit("sendMsg", {id, sender: getCookie("login"), senderURL:User.avatarURL, text:newMessage, date: new Date(Date.now()).toISOString()}, login)
          setNewMessage("")
        }
  }

  useEffect(() => {
    socket?.on("receiveMsg", (msg:MessageSocket)=>{
    setAllMessages((prev:any)=>{
      return [...prev, {id:msg.id, sender: login, senderURL:msg.senderURL, text:msg.text, date: new Date(Date.now()).toISOString()}]
    })
  })

  socket?.on("messageDeleted", (msg:MessageType)=>{
    setAllMessages((prev:any)=> prev.filter((message: MessageSocket)=>{
        return message.id !== msg.id
      })
    )
  })
  }, [socket])
  

  


  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <TopSection name={`Conversation with ${login}`} variant="conversation" />

      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 48px)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 108px)", overflowY:"scroll"
            }} 
          >
            <PersonHeader login={login} avatarURL={ReceiverProfile?.avatarURL}/>
            {allMessages?.map((message)=>{
              if("date" in message){
                return <Message key={message?.id} id={message?.id} senderLogin={message?.sender} senderAvatarURL={message?.sender===login ? ReceiverProfile?.avatarURL : User?.avatarURL} text={message?.text} timestamp={message?.date}/>
              }
            })}

        <div ref={messagesEndRef}/>
          </Box>

        <FormControl onSubmit={sendMessage}
          sx={{
            marginTop: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Input
            id="message"
            placeholder="Type message"
            value={newMessage}
            maxRows={2}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                sendMessage()
              }
            }}
            sx={{ color: "white", width: "calc(100% - 24px)", padding:1, paddingRight:2, border: "1px solid rgb(35, 39, 42)", margin:"0 auto 12px", borderRadius: "8px"}}
            endAdornment={<MdSend size={24} style={{cursor:"pointer"}} onClick={sendMessage}/>}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default Conversation;
