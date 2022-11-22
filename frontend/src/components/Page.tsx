import { Box } from "@mui/system";
import { motion } from "framer-motion";
import React from "react";


const Page = ({ children }: {children: React.ReactNode}) => {
  return (
    <Box
      sx={{
        width:  { xs : "100%", sm : "calc(100vw - 80px)"},
        overflow: "hidden !important",
        height: "100vh",
        background: "#36393f",
        display: "flex",
        color:"white",
        position:"relative",
      }}
      >
      {children} 
    </Box>
  );
};

export const StartPage = ({ children }: {children: React.ReactNode}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll"
      }}
        component={motion.div} initial={{ opacity:.3}}
        animate={{
          opacity:1,
          transition: { duration: .5, ease: "linear" },
        }}
        exit={{ opacity:0 , transition: { duration: .5, delay: .2}}}
    >
      {children} 
    </Box>
  );
};

export default Page;
