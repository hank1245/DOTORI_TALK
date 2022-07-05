import React, {useState,useEffect,useRef} from 'react'
import { IUser } from '../pages/Chat'
import styled from 'styled-components'
import Logout from './Logout' 
import ChatInput from './ChatInput'
import Messages from './Messages'
import axios from 'axios'
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes'
import {v4 as uuidv4} from 'uuid'


interface Props {
    currentChat: IUser | undefined
    currentUser: IUser | undefined
    socket: any
}

interface IMessage {
  fromSelf: boolean
  message: string
}

const ChatContainer = ({currentChat,currentUser, socket}:Props) => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [arrivalMessage, setArrivalMessage] = useState<IMessage | null>(null)
    const scrollRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
      const updateChat = async () => {
        const {data} = await axios.post(getAllMessagesRoute, {
          from: currentUser?._id,
          to: currentChat?._id,
        })
        setMessages(data)
        console.log(data)
      }
      if(currentChat) {
        updateChat()
      }
    },[currentChat])
    
    const handleSendMessage = async (msg:string) => {
         await axios.post(sendMessageRoute, {
          from: currentUser?._id,
          to: currentChat?._id,
          message: msg, 
         })
         socket.current.emit('send-msg',{
          to: currentChat?._id,
          from: currentUser?._id,
          message: msg
         })
         const msgs = [...messages]
         msgs.push({fromSelf: true, message:msg})
         setMessages(msgs)
    }
    
    useEffect(() => {
      if(socket.current) {
        socket.current.on('msg-received',(msg: any) => {
          setArrivalMessage({fromSelf: false, message: msg})
        })
      }
    },[])

    useEffect(() => {
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    },[arrivalMessage])

    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages])

    return (
        <Container>
          <div>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img
                      src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
                      alt=""/>
                </div>
                <div className="username">
                  <h3>{currentChat?.name}</h3>
                </div>
              </div>
              <Logout/>
            </div>
            <div className='chat-messages'>
            {
              messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                      <div className="content">
                        <p>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
            </div>
         </div>
          <ChatInput handleSendMessage = {handleSendMessage}/>
        </Container>
      );
}

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  display:flex;
  flex-direction:column;
  justify-content: space-between;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
export default ChatContainer