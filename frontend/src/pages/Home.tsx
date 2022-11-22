import { Button, Card, Divider, FormControl, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import {StartPage} from "../components/Page";
import BackgroundVideo from "../assets/start.mp4"
import { Box } from "@mui/system";
import { MdSend } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { TbMessages } from "react-icons/tb"
import { JoinCard, LoginCard, PasswordCard, SuccessCard } from "../components/StartCards";
import { AnimatePresence } from "framer-motion";

export type AvabileCard = "Join" | "Password" | "Success" | "Account"

const Home = () => {
  const [CardVisible, setCardVisible] = useState<AvabileCard>("Join")
  const [AccountCredentials, setAccountCredentials] = useState({
    login: "",
    password:""
  })

  return (
    <StartPage>
      <Box sx={{height:"100vh", display:"flex", flexDirection:"column"}}> 
      <Typography variant="h1" fontSize={60} pt={"50px"} color="white" sx={{textShadow:"0 0 4px black"}}>
      Chat app
      </Typography>
      <Typography variant="h2" fontSize={20} color="white" sx={{textShadow:"0 0 3px white"}}>
     Text chat application
      </Typography>
      <video  id="background-video" autoPlay loop muted>
      <source src={BackgroundVideo} type="video/mp4"></source>
      </video>
<AnimatePresence mode="wait">
    {CardVisible==="Join" && (<JoinCard key={CardVisible} setCardVisible={setCardVisible} AccountCredentials={AccountCredentials} setAccountCredentials={setAccountCredentials}/>)}
    {CardVisible==="Password" && <PasswordCard key={CardVisible} setCardVisible={setCardVisible} AccountCredentials={AccountCredentials} setAccountCredentials={setAccountCredentials}/>}
    {CardVisible==="Account" && <LoginCard key={CardVisible} setCardVisible={setCardVisible} AccountCredentials={AccountCredentials} setAccountCredentials={setAccountCredentials}/>}
    {CardVisible==="Success" && <SuccessCard key={CardVisible}  />}
</AnimatePresence>
    
    </Box>

     <Box sx={{display:"flex", flexDirection:"column", alignContent:"center", position:"relative", top:"1px", minHeight:"100vh", background:"white", borderTop:"1px solid black", padding:"120px 12px"}}>
            <Typography variant="h2" fontSize={44} color="black" sx={{textShadow:"0 0 2px black", pb:"48px"}}>
      Main Features
      </Typography>


      <Stack
  direction={{ xs: "column", sm: "row"}}
  spacing={2}
  sx={{margin:"auto"}}
>
  <Card elevation={0} variant="outlined" sx={{padding:"30px 12px", display:"flex", flexDirection:"column", alignItems:"center"}}> <AiOutlineUserAdd size="64px"/> Connecting with friends </Card>
  <Card elevation={0} variant="outlined" sx={{padding:"30px 12px", display:"flex", flexDirection:"column", alignItems:"center"}}><TbMessages size="64px"/> Realtime text messaging</Card>
</Stack>
      </Box>
    </StartPage>
  );
};

export default Home;
