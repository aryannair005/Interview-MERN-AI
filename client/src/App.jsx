import React, { useEffect } from 'react'
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import {Routes , Route} from "react-router-dom"
import axios from "axios"

export const ServerUrl = "http://localhost:8000"

const App = () => {
  useEffect(()=>{
    const getUser = async () => {
      try{
        const response = await axios.get(ServerUrl + "/api/user/current-user",{withCredentials: true})
        console.log(response.data)  
      }catch(error){
        console.log(error)
      }
    }
    getUser()
  },[])
  
  return (
    <div>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/auth' element= {<Auth/>} />
      </Routes>
    </div>
  )
}

export default App
