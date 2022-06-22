import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import SetAvatar from './pages/SetAvatar'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/setAvatar' element={<SetAvatar/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
