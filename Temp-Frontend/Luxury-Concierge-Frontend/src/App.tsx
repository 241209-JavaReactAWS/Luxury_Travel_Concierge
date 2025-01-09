import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AllHotels from './components/HotelComponent/AllHotels'
import Rooms from './components/RoomComponent/Rooms'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav/nav'
import LoginPage from './components/LoginComponents/LoginPage'
import BookingPage from './components/BookingComponent/BookingPage'
import FormTemplate from './components/FormTemplate/FormTemplate'
import UserRegistration from './components/UserRegistrationComponent/UserRegistration'
import AdminRegister from './components/RegisterComponents/AdminRegister'
import BookingDataChart from './components/BookingDataChart/BookingDataChart'
import BookingAdmin from './components/BookingComponent/BookingAdmin'

function App() {

  return (
    <>
      <BrowserRouter>
        <Nav></Nav>
          <Routes>
            <Route path="/" element={<LoginPage></LoginPage>}></Route>
            <Route path="/OwnerRegistration" element={<AdminRegister></AdminRegister>}></Route>
            <Route path='/Hotels' element={<AllHotels></AllHotels>}></Route>
            <Route path="/hotels/:hotelId" element={<Rooms />} />
            <Route path="/UserRegistration" element={<UserRegistration></UserRegistration>}></Route>
            <Route path="/test" element={<BookingDataChart></BookingDataChart>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
