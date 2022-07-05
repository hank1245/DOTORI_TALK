import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { allUsersRoute,host } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '../app/store'



interface IPros {}

export interface IUser {
  _id: string,
  name: string,
  email: string,
  avatarImage: string
  isAvatarImageSet?: boolean 
}

const Chat:React.FC<IPros> = ():JSX.Element => {
  //useRef() hook 으로 만든 변수는 컴포넌트의 생애주기를 통해 유지되지만, .current 프로퍼티의 값이 변경되도 컴포넌트 리렌더링을 발생 시키지 않는다.
  const socket = useRef<any>()

  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const {currentChat} = useSelector((state:RootState) =>state.currentChat)

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
      console.log(socket)
    }
  })

  return(
    <Container>
      <div className='container'>
        {/*currentUser에서 전하는것은 내 정보, currentChat에서 전하는것은 내가 클릭한 유저의 정보 */}
        {isLoaded && currentChat === undefined ? (<Welcome currentUser={currentUser}/>) : (<ChatContainer currentChat ={currentChat} currentUser={currentUser} socket={socket}/>)}
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
}
`

export default Chat