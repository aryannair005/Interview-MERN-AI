import React, { useEffect } from 'react'
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import InterviewPage from './pages/InterviewPage'
import {Routes , Route} from "react-router-dom"
import axios from "axios"
import {useDispatch} from "react-redux"
import { setUserData } from './redux/userSlice'

export const ServerUrl = "http://localhost:8000"

const App = () => {

  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async () => {
      try{
        const response = await axios.get(ServerUrl + "/api/user/current-user",{withCredentials: true})
        dispatch(setUserData(response.data))  
      }catch(error){
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  },[dispatch])
  
  return (
    <div>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/auth' element= {<Auth/>} />
        <Route path= "/interview" element={<InterviewPage/>} />
      </Routes>
    </div>
  )
}

export default App
