import React, { useState } from 'react'
import TextInput from '../GlobalComponents/TextInput/TextInput'
import SubmissionButton from '../GlobalComponents/SubmissionButton/SubmissionButton'
import UserInterface from '../../interfaces/UserInterface'
import "./LoginPage.css"
import Supplementaries from '../../SupplementaryClass'

function LoginPage() {

    let images = ["https://digital.ihg.com/is/image/ihg/exp-crowne-plaza-tamuning-8691101738-16x5?ts=1735586660671&dpr=off",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5nQoXkVHv-OqR4aFog04K9iOAJ9wKSeiqQ&s",
        "https://img.freepik.com/free-photo/beautiful-luxury-outdoor-swimming-pool-hotel-resort_74190-7433.jpg?semt=ais_hybrid",
        "https://www.travelandleisure.com/thmb/QONX7Ovws-5JgiGJr92OX3Iu8T8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mashpi-lodge-RAINFRSTHOTEL0122-829d1175038041489e191521d3d727d7.jpg"
    ]

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
                    <TextInput id="password_input" for="Password" onValueChange={setPassword} width='90%'></TextInput>
                </div>
                <div id='bottomOfLoginForm'>
                    <p className='ErrorText'>{status == 0 ? "" : "Invalid Username or Password"}</p>
                    <SubmissionButton endpoint='test' statusChanger={setStatus} placeholder='Log In!' data={Supplementaries.generateUserJson(NaN,username,password)}></SubmissionButton>
                </div>
            </div>
        </div>
    )
}

export default LoginPage