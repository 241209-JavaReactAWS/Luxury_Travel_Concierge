import React, { useState } from 'react'
import UserInterface from '../../interfaces/UserInterface'
import TextInput from '../GlobalComponents/TextInput/TextInput'
import SubmissionButton from '../GlobalComponents/SubmissionButton/SubmissionButton'
import Supplementaries from '../../SupplementaryClass'
import FormTemplate from '../FormTemplate/FormTemplate'
import "./UserRegistration.css"
import onSuccess from '../../interfaces/onSuccessInterface'
import onError from '../../interfaces/onErrorInterface'

const UserRegistration = () => {

    const onSuccess: onSuccess = (data : any) =>{
        setStatus(0);
        setError("");
        window.location.href = "http://localhost:5173/"
    }
    
    const onFailure: onError = (error : any) =>{
        setError("Improper Info")
    }

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [firstname,setFirstname] = useState("")
    const [lastname,setLastname] = useState("")
    const [email,setEmail] = useState("")
    const [status,setStatus] = useState(0)
    const [address,setAddress] = useState("")
    const [error,setError] = useState("")

  let data : any = <>
  
        <h1>User Registration</h1>
        <div id="nameInputs">
            <TextInput id="firstname_input" for="Firstname" onValueChange={setFirstname} width='45%'></TextInput>
            <TextInput id="lastname_input" for="Lastname" onValueChange={setLastname} width='45%'></TextInput>
        </div>
        <TextInput id="username_input" for="Username" onValueChange={setUsername} width='70%'></TextInput>
        <TextInput id="email_input" for="Email" onValueChange={setEmail} width='70%'></TextInput>
        <TextInput id="address_input" for="Address" onValueChange={setAddress} width='70%'></TextInput>
        <TextInput id="password_input" for="Password" onValueChange={setPassword} width='70%'></TextInput>
        <div id='bottomOfForm'>
            <p className='ErrorText'>{error}</p>
            <div id='bottomRightOfForm'>
                <div>
                    <p className='InfoLink'><a href='Google.com'>Register as Admin?</a></p>
                    <p className='InfoLink'><a href='http://localhost:5173/'>Already a User?</a></p>
                </div>
                <SubmissionButton type="POST" onSuccess={onSuccess} onError={onFailure} endpoint='' statusChanger={setStatus} placeholder='Register as User' 
                data={Supplementaries.generateUserJson(NaN,username,password,firstname,lastname,email,address)}></SubmissionButton>
            </div>
        </div>
  </>

  return (
    <FormTemplate data={data}></FormTemplate>
  )
}

export default UserRegistration