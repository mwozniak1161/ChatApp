import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField, Theme, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdAddComment, MdChatBubble, MdExpandMore, } from 'react-icons/md'
import Conversation from './Conversation'
import NavigationSection from '../components/NavigationSection'
import Page from '../components/Page'
import Search from '../components/Search'
import TopSection from '../components/TopSection'
import UserListItem from '../components/UserListItem'
import UserList from '../components/UserList'
import { Outlet, useParams } from 'react-router'
import axios from 'axios'
import getCookie from '../utils/getCookie'
import { useSocket } from '../contexts/Socket'
import { ProfileType } from './Profiles'

const Conversations = () => {
    const { login } = useParams()
    const [isSearchingAll, setIsSearchingAll] = useState(false)
    const [Conversations, setConversations] = useState([])
    const [ filterFriends, setFilterFriends ] = useState("") 
    const [filterProfiles, setFilterProfiles] = useState("")
    const [profilesList, setProfilesList] = useState([])
    const { current: socket } = useSocket()

    const getConversations = () =>{
              axios({
      method:"GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_BACKEND}/messages/conversations`,
    }).then((res)=>{
      setConversations(res.data.data)
    })
    }

  useEffect(() => {
    getConversations()
  }, [])

  const changeMode = () => {
    setIsSearchingAll(prev=> !prev)
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
    socket?.on("conversationCreated",()=>{
      getConversations()
    })
  }, [socket])
  
  
    return (
    <Page >
        <NavigationSection isNavSectionOpen={login!==undefined}>
            <TopSection variant="conversations" name="Messages" />
            { !isSearchingAll ? (<>
      <TextField onChange={(e)=>{setFilterFriends(e.target.value)}} variant="filled" label="Search Conversations..." sx={{width:"100%"}} />
                <Button variant='contained' sx={{display:"flex", width:1, gap: 1, alignItems:"center", padding:1, borderRadius:0}} onClick={changeMode} > Add new <MdAddComment  size={24}/></Button>
            </>) : (<>
      <TextField onChange={(e)=>{searchProfiles(e.target.value)}}  variant="filled" label="Start chatting with..." sx={{width:"100%"}} />
                <Button variant='contained' sx={{display:"flex", width:1, gap: 1, alignItems:"center", padding:1, borderRadius:0}} onClick={changeMode} > Conversations <MdChatBubble size={24} style={{transform:"scaleX(-1)"}} /></Button>
            </>)}
              {!isSearchingAll ? (<Accordion sx={{background:"#36393f", margin:"0 !important"}} defaultExpanded>
                    <AccordionSummary expandIcon={<MdExpandMore />}>
                      <Typography variant="h5">Conversations</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {Conversations?.map((profile:ProfileType)=>{
                        if(new RegExp(filterFriends).test(profile.login)){
                          return (<UserListItem type="info" key={profile.login} login={profile?.login} avatarURL={profile?.avatarURL}/>)
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>
              ): ( <Accordion sx={{background:"#36393f", margin:"0 !important"}} defaultExpanded>
                    <AccordionSummary expandIcon={<MdExpandMore />}>
                      <Typography variant="h5">Profiles</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {profilesList?.map((i:ProfileType)=>{
                        if(i.login !== getCookie("login")){
                          return (<UserListItem key={i.login} type="info" avatarURL={i.avatarURL} login={i.login}/>)
                        }
                      })}
                    </AccordionDetails>
                  </Accordion>
              )}
                <UserList>

            </UserList>
        </NavigationSection>
        <Outlet/>
    </Page>
  )
}

export default Conversations