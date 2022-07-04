import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { allUsersRoute,host } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'



interface IPros {}

export interface IUser {
  _id: string,
  name: string,
  email: string,
  avatarImage: string
  isAvatarImageSet?: boolean 
}

const Chat:React.FC<IPros> = ():JSX.Element => {
  const socket = useRef<any>()

  const [contacts, setContacts] = useState<IUser[]>([])
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined)
  const [currentChat, setCurrentChat] = useState<IUser | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    if(!localStorage.getItem('chat-app-user')) {
      navigate('/login')
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user') || ""))
      setIsLoaded(true)
    }
  },[])
  useEffect(() => {
    if(currentUser) {
      socket.current = io(host)
      socket.current.emit('add-user', currentUser._id)
    }
  })
  useEffect(() => {
    const getUsers = async() => {
      if(currentUser) {
        if(currentUser.isAvatarImageSet) {
          const {data} = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data)
        } else {
          navigate('/setAvatar')
        }
      }
    }
    getUsers()
  },[currentUser])

  const handleChatChange = (chat:IUser) => {
    setCurrentChat(chat)
}
  return(
    <Container>
      <div className='container'>
        <Contacts contacts={contacts} currentUser = {currentUser} changeChat ={handleChatChange} />
      </div>
    </Container> 
  )
}

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
    .container {
        width:80%;
        height: 80%;
    }
}
`

export default Chat