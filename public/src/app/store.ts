import { configureStore } from "@reduxjs/toolkit"
import chatReducer from '../features/currentChatSlice'

const store = configureStore({
    reducer: {
        currentChat: chatReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store