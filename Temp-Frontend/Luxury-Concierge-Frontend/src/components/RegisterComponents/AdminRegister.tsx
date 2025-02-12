import { useState } from "react"
import Supplementaries from "../../SupplementaryClass"
import SubmissionButton from "../GlobalComponents/SubmissionButton/SubmissionButton"
import TextInput from "../GlobalComponents/TextInput/TextInput"
import "./AdminRegister.css" 
import FormTemplate from "../FormTemplate/FormTemplate"
import onSuccess from "../../interfaces/onSuccessInterface"
import onError from "../../interfaces/onErrorInterface"


function AdminRegister() {

  const onSuccess: onSuccess = (data : any) =>{
    setStatus(0)
    window.location.href = Supplementaries.clientLink
}

const onFailure: onError = (error : any) =>{
    console.log(error.response.data)
    console.log(Supplementaries.generateUserJson(NaN,username,password,firstname,lastname,email,address))
    setStatus(1)
}

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [firstname,setFirstname] = useState("")
  const [lastname,setLastname] = useState("")
  const [email,setEmail] = useState("")
  const [status,setStatus] = useState(0)
  const [address,setAddress] = useState("")
  const [error,setError] = useState("")
  const [key, setKey] = useState("")

  let data2 = {
    firstName: firstname,
    lastName: lastname,
    username: username,
    email: email,
    address: address,
    password: password,
  }

  let data : any = <>
  
    <h1>Hotel Owner Registration</h1>
      <div id="nameInputs">
        <TextInput id="firstname_input" for="First Name" onValueChange={setFirstname} width='45%'></TextInput>
        <TextInput id="lastname_input" for="Last Name" onValueChange={setLastname} width='45%'></TextInput>
      </div>
        <TextInput id="username_input" for="Username" onValueChange={setUsername} width='70%'></TextInput>
        <TextInput id="email_input" for="Email" type='email' onValueChange={setEmail} width='70%'></TextInput>
        <TextInput id="address_input" for="Address" onValueChange={setAddress} width='70%'></TextInput>
        <TextInput id="password_input" for="Password" type='password' onValueChange={setPassword} width='70%'></TextInput>
        <TextInput id="key_input" for="Unique Key" onValueChange={setKey} width="70%"></TextInput>
      <div id='bottomOfForm'>
            <p className='ErrorText'>{status == 0 ? "" : "Invalid Data"}</p>
            <div id="bottomRightOfForm">
              <div>
                    <p className='InfoLink'><a href={Supplementaries.clientLink + "UserRegistration"}>Register as User?</a></p>
                    <p className='InfoLink'><a href={Supplementaries.clientLink}>Already a User?</a></p>
              </div>
                  <SubmissionButton type="POST" onError={onFailure} onSuccess={onSuccess} endpoint={`${Supplementaries.serverLink}admin/register`} 
                  statusChanger={setStatus} placeholder='Register as Owner' data={data2}></SubmissionButton>
              </div>
            </div>
  </>
  return (
    <div> 
      <FormTemplate data={data}></FormTemplate>
    </div>
  )
}

export default AdminRegister


