import { IconButton, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { useNavigate } from "react-router";

interface TopSection {
  name?: string
  variant?: "conversation" | "profile" | "setting" | "conversations" | "profiles" | "settings"
}

const TopSection = ({ name, variant }: TopSection) => {

  const navigate = useNavigate()
  const isSmallScreen = useMediaQuery("(max-width:1200px)")
  const isNavigation = (variant==='conversations' || variant==='profiles' || variant==='settings')
  const isPage = (variant==='conversation' || variant==='profile' || variant==='setting')

  return (
    <Box
      sx={{
        display: "flex",
        width: "auto", 
        maxWidth: { xs : "100vw", sm : "calc(100vw - 80px)"},
        justifyContent: "center",
        padding: "16px",
        background: "#2c2f33",
        gap: 6,
        alignItems: "center",
        height: "48px",
        borderBottom:"1px solid #23272a",
      }}
    >
      {isSmallScreen && isPage && <IconButton onClick={()=>{navigate(-1)}}>
      <MdOutlineKeyboardReturn size={24} style={{marginRight:"auto", color:"white"}}
      />
      </IconButton>
      }
      <Typography
        variant="h5"
        textOverflow={"ellipsis"}
        overflow="hidden"
        whiteSpace={"nowrap"}
        flex="1"
      >
        {name}
      </Typography>
      {isPage && 
        <HiDotsVertical size={"32px"} style={{marginLeft:"auto", opacity: 0}} className="w1200"/>
      }
    </Box>
  );
};

export default TopSection;
