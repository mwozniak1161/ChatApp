import {  Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdExpandMore, MdPerson, MdPersonAdd, MdPersonSearch } from "react-icons/md";
import NavigationSection from "../components/NavigationSection";
import Page from "../components/Page";
import Profile from "./Profile";
import Search from "../components/Search";
import TopSection from "../components/TopSection";
import UserListItem from "../components/UserListItem";
import UserList from "../components/UserList";
import { Outlet, useParams } from "react-router";
import axios from "axios";
import { useUser } from "../contexts/User";
import getCookie from "../utils/getCookie";
import { useSocket } from "../contexts/Socket";

export interface ProfileType{
  login:string
  avatarURL:string
}

const Profiles = () => {
    const { login } = useParams()
    const [isSearchingAll, setIsSearchingAll] = useState(true)
    const [friendsLists, setFriendsLists] = useState({
      pending: [],
      online: [],
      offline: []
    })
    const [profilesList, setProfilesList] = useState([])
    const [filterFriends, setFilterFriends] = useState("")
    const [filterProfiles, setFilterProfiles] = useState("")

    const { User, dispatchUser } = useUser()
    const { current: socket } = useSocket()

    const changeMode = () => {
      setIsSearchingAll(prev=> !prev)
    }

    const getFriends = () =>{
      axios({
        method:"GET",
        url:`${process.env.REACT_APP_BACKEND}/profiles/${getCookie("login")}/friends`
      }).then((res) =>{
        setFriendsLists(res.data)
      })
    }

    const searchProfiles = (value: string) =>{
    setFilterProfiles(value)
    axios({
      method:"GET",
      url:`${process.env.REACT_APP_BACKEND}/profiles/all/${value}`
    }).then((res)=>{
      setProfilesList(res.data.Profiles)
    })
    }

    useEffect(() => {
      getFriends()
    }, [])
    
    useEffect(() => {
      socket?.on("profileChanged", ()=>{
        getFriends()
      })  
    }, [socket])
  


  return (
    <Page >
      <NavigationSection isNavSectionOpen={login!==undefined}>
        <TopSection name="Friends" variant="profiles" />
        {isSearchingAll ? (
          <>
            <TextField variant="filled" label="Search Friend" sx={{width:"100%"}} onChange={(e)=>{setFilterFriends(e.target.value)}}/>
            <Button variant='contained' sx={{display:"flex", width:1, gap: 1, alignItems:"center", padding:1, borderRadius:0}} onClick={changeMode}>Search <MdPersonSearch size={24} style={{transform:"scaleX(-1)"}} /></Button>
          </>
        ) : (
          <>
           <TextField  variant="filled" label="Search Profiles..." sx={{width:"100%"}} onChange={(e)=>{
            searchProfiles(e.target.value)
           }}/>
            <Button variant='contained' sx={{display:"flex", width:1, gap: 1, alignItems:"center", padding:1, borderRadius:0}} onClick={changeMode}>Friends<MdPerson size={24}/></Button>
          </>
        )}
       
        <UserList>
          {isSearchingAll ? (
            <>
              <Accordion  defaultExpanded sx={{background:"#36393f"}} >
                    <AccordionSummary expandIcon={<MdExpandMore />} >
                      <Typography variant="h5">Pending</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {friendsLists.pending?.map((i:ProfileType)=>{
                        if(new RegExp(filterFriends).test(i.login)){
                          return (<UserListItem key={i.login} type="pending" avatarURL={i.avatarURL} login={i.login}/>)
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>
                            <Accordion defaultExpanded sx={{background:"#36393f"}}>
                    <AccordionSummary expandIcon={<MdExpandMore />}>
                      <Typography variant="h5">Online</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {friendsLists.online?.map((i:ProfileType)=>{
                        if(new RegExp(filterFriends).test(i.login)){
                          return (<UserListItem key={i.login} type="online" avatarURL={i.avatarURL} login={i.login}/>)
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>
                            <Accordion defaultExpanded sx={{background:"#36393f"}}>
                    <AccordionSummary expandIcon={<MdExpandMore />}>
                      <Typography variant="h5">Offline</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {friendsLists.offline?.map((i:ProfileType)=>{
                        if(new RegExp(filterFriends).test(i.login)){
                          return (<UserListItem key={i.login} type="offline" avatarURL={i.avatarURL} login={i.login}/>)
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>
            </>
          ) : (
            <>
                   <Accordion defaultExpanded sx={{background:"#36393f"}}>
                    <AccordionSummary expandIcon={<MdExpandMore />}>
                      <Typography variant="h5">All</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {profilesList?.map((i:ProfileType)=>{
                        if(i.login !== getCookie("login")){
                          return (<UserListItem key={i.login} type="info" avatarURL={i.avatarURL} login={i.login}/>)
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>

            </>
          )}
        
        </UserList>
      </NavigationSection>
      <Outlet/>
    </Page>
  );
};

export default Profiles;
