import React from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ProjectDetails from './components/ProjectDetails'
import Nav from './components/Nav'
import Progress from './components/Progress'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div className='w-screen h-screen'>
      <Nav/>
      <Routes>
         <Route path='/' element={<Login/>}/>
         <Route path='/dashboard' element={<Dashboard/>}/>
         <Route path='/projects/:id' element={<ProjectDetails/>}/>
         <Route path='/progress' element={<Progress/>}/>
               
     </Routes>
    </div>
  )
}


export default App