import { createContext, useState } from 'react'
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
import HotelManagementPage from './components/HotelComponent/HotelManagement'
import HotelReviews from './components/ReviewComponent/Reviews'
import StripePaymentForm from './components/PaymentComponent/Payment'
import HotelSettings from './components/HotelSettings/HotelSettings'


export interface AuthContextType{
  userName: string,
  setUsername: (userName: string) => void,
  role: "nonuser" | "CUSTOMER" | "ADMIN",
  setRole: (role: "nonuser" | "CUSTOMER" | "ADMIN") => void
}

export const authContext = createContext<AuthContextType | null>(null);


function App() {


  return (
    <>
      <BrowserRouter>
        <Nav></Nav>
          <Routes>
            <Route path="/" element={<LoginPage></LoginPage>}></Route>
            <Route path="/BookingPage" element={<BookingPage></BookingPage>}></Route>
            <Route path="/OwnerRegistration" element={<AdminRegister></AdminRegister>}></Route>
            <Route path='/Hotels' element={<AllHotels></AllHotels>}></Route>
            <Route path="/HotelManagement" element={<HotelManagementPage></HotelManagementPage>}></Route>
            <Route path="/HotelManagement/:hotelId" element={<HotelSettings></HotelSettings>}></Route>
            <Route path="/hotels/:hotelId" element={<Rooms />} />
            <Route path="/UserRegistration" element={<UserRegistration></UserRegistration>}></Route>
            <Route path="/test" element={<BookingDataChart></BookingDataChart>}></Route>
            <Route path="/bookingAdmin" element={<BookingAdmin/>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
