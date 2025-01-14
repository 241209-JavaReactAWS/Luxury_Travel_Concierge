import React, { useEffect, useState } from 'react'
import TextInput from '../GlobalComponents/TextInput/TextInput'
import SubmissionButton from '../GlobalComponents/SubmissionButton/SubmissionButton'
import UserInterface from '../../interfaces/UserInterface'
import "./LoginPage.css"
import Supplementaries from '../../SupplementaryClass'
import onSuccess from '../../interfaces/onSuccessInterface'
import onError from '../../interfaces/onErrorInterface'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function LoginPage() {

    const navigate = useNavigate()

    let images = ["https://digital.ihg.com/is/image/ihg/exp-crowne-plaza-tamuning-8691101738-16x5?ts=1735586660671&dpr=off",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5nQoXkVHv-OqR4aFog04K9iOAJ9wKSeiqQ&s",
        "https://img.freepik.com/free-photo/beautiful-luxury-outdoor-swimming-pool-hotel-resort_74190-7433.jpg?semt=ais_hybrid",
        "https://www.travelandleisure.com/thmb/QONX7Ovws-5JgiGJr92OX3Iu8T8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mashpi-lodge-RAINFRSTHOTEL0122-829d1175038041489e191521d3d727d7.jpg"
    ]


    // TODO: When Homepage per user is done, connect to homepage
    useEffect(() => {
        axios.get(Supplementaries.serverLink + "users/user", {withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
        .then((data)=>{
            window.location.href = Supplementaries.clientLink + "Hotels";
        })

    },[])

    const onSuccess: onSuccess = (data : any) =>{
        setStatus(0);
        localStorage.setItem("token",data.data.token)
        //window.location.href = Supplementaries.clientLink + "Hotels"
        navigate("/Hotels")
    }
    
    const onFailure: onError = (error : any) =>{
        if(error.response.status == 404){
            setError("Server is closed")
        }
        else{
            setError("Improper Username or Password")
        }
    }

    function getNewImage(){
        if(image == images.length){
            setImage(0) 
        }
        setImage(image + 1)
    }

    const [image,setImage] = useState(0)

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [status,setStatus] = useState(0)
    const [error,setError] = useState("")

    return (
        <div id='LoginPage'>
            <div id='LoginGraphic'>
                <img id='HomeImage' src={images[image]} onAnimationEnd={getNewImage}/> 
            </div>
            <div id='LoginForm'>
                <div id='textInfo'>
                    <h1>Luxury Travel Concierge</h1>
                    <p>Enjoy your stay</p>
                </div>
                <div>
                    <TextInput id="username_input" for="Username" onValueChange={setUsername} width='90%'></TextInput>
                    <TextInput id="password_input" for="Password" type='password' onValueChange={setPassword} width='90%'></TextInput>
                </div>
                <div id='bottomOfLoginForm'>
                    <p className='ErrorText'>{error}</p>
                    <div id='bottomRightOfLoginForm'> 
                        <SubmissionButton type="POST" onSuccess={onSuccess} onError={onFailure} endpoint={Supplementaries.serverLink + 'users/login'} statusChanger={setStatus} placeholder='User Log In!' 
                        data={Supplementaries.generateUserJson(NaN,username,password)}></SubmissionButton>
                        <SubmissionButton type="POST" onSuccess={onSuccess} onError={onFailure} endpoint={Supplementaries.serverLink + 'admin/login'} statusChanger={setStatus} placeholder='Admin Log In!' 
                        data={Supplementaries.generateUserJson(NaN,username,password)}></SubmissionButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage