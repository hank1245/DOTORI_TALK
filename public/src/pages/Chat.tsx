import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { allUsersRoute } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'

interface IPros {}

export interface IUser {
  _id: string,
  name: string,
  email: string,
  avatarImage: string
  isAvatarImageSet?: boolean 
}

const Chat:React.FC<IPros> = ():JSX.Element => {
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
        {/*currentUser에서 전하는것은 내 정보, currentChat에서 전하는것은 내가 클릭한 유저의 정보 */}
        {isLoaded && currentChat === undefined ? (<Welcome currentUser={currentUser}/>) : (<ChatContainer currentChat ={currentChat}/>)}
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
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }
}
`

export default Chat