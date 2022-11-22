import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { MdPerson, MdChatBubble, MdSettings, MdMenu } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";

const Navbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const handleNavigationOpening = () => {
    setIsNavbarOpen(!isNavbarOpen)
  }
  const { login, settingType } = useParams()
  return (<>
  <Box onClick={handleNavigationOpening} sx={{position:"absolute", left:"0", zIndex:9, display: {xs : (isNavbarOpen || (login || settingType)) ? "none" : "block", sm: "none"}}}>
  <IconButton>
    <MdMenu size={44} color="white"/>
  </IconButton>
    </Box>
    <Box onClick={handleNavigationOpening} sx={{width:{ xs : "100vw", sm : "80px"}, background:"#23272a", display:"flex", flexDirection:"column", gap:"5vh" ,paddingTop:"10vh", height:"100vh", position: { xs : "absolute", sm : "static"}, zIndex: "3", transform: {xs: isNavbarOpen ? "translate(0,0)" : "translate(100%,0)", sm: "none"}}}>
      <NavLink to={"conversations"} >
        <MdChatBubble size={48}/>
      </NavLink>
      <NavLink to={"profiles"} >
        <MdPerson size={48}/>
      </NavLink>
      <NavLink to={"settings"} style={{marginTop:"auto", marginBottom:"10vh"}}>
        <MdSettings size={48}/>
      </NavLink>
    </Box>
  </>
  );
};

export default Navbar;
