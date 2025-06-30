import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Performance from './pages/Performance'

const App = () => {
  return (
    <>
      <Toaster/>
      <Navbar />
      <Routes>
        <Route path='/' element = {<Home />} />
        <Route path='/tasks/:username' element = {<Tasks/>} />
        <Route path='/performance/:username' element = {<Performance/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App