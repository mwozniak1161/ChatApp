import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

interface PersonHeader {
  login?:string
  avatarURL?:string
}

const PersonHeader = ({ login, avatarURL }:PersonHeader) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        mb: 2,

      }}
    >
      <Avatar sx={{ width: 100, height: 100 }} src={avatarURL}/>
      <Typography variant="h3" sx={{
          paddingTop: "10px",
  fontSize: "clamp(20px, 5vw, 36px)",
  maxWidth: "calc(100vw - 108px)"}} >{login}</Typography>
    </Box>
  );
};

export default PersonHeader;
