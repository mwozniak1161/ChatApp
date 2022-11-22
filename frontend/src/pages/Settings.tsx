import { Button } from '@mui/material'
import React, { useState } from 'react'
import NavigationSection from '../components/NavigationSection'
import Page from '../components/Page'
import Search from '../components/Search'
import Setting from './Setting'
import TopSection from '../components/TopSection'
import User from '../components/UserListItem'
import UserList from '../components/UserList'
import { Outlet, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'


const Settings = () => {
  const { settingType } = useParams() 
  return (
    <Page >
        <NavigationSection  isNavSectionOpen={settingType!==undefined}>
        <TopSection name="Settings" variant="settings"/>
        <NavLink to="account">
        <Button variant='contained' sx={{display:"flex", width:1, gap: 1, alignItems:"center", padding:1, borderRadius:0}}>
        Account
        </Button>
        </NavLink>
      </NavigationSection>
      <Outlet/>
    </Page>

  )
}

export default Settings