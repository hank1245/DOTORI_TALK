import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../pages/Chat'

interface InitialState {
    currentChat: IUser | undefined
}

const initialState:InitialState = {
    currentChat: undefined
}

export const currentChatSlice = createSlice({
    name:'currentChat',
    initialState,
    reducers: {
        setCurrentChat: (state,action:PayloadAction<IUser | undefined>) => {
            state.currentChat = action.payload
        }
    }
})

export const {setCurrentChat} = currentChatSlice.actions

export default currentChatSlice.reducer
