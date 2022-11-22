import { Box } from '@mui/material'
import React from 'react'

interface NavigationSection {
  children: React.ReactNode
  isNavSectionOpen: boolean
}

const NavigationSection = ({children, isNavSectionOpen}:NavigationSection) => {
  return (
    <Box sx={{zIndex:2 ,background:"#2c2f33", width:{ lg: "288px", xs:"100%"}, minWidth:"288px", height:"100vh", borderRight:"1px solid #23272a", display: { xs: isNavSectionOpen ? "none" : "block", lg: "block"}}}>
        {children}
    </Box>
  )
}

export default NavigationSection