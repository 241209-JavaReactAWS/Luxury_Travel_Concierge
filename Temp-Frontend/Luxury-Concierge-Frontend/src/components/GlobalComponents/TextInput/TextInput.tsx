import React from 'react'
import "./TextInput.css"
import TextInputInterface from '../../../interfaces/TextInputInterface'



function TextInput(props : TextInputInterface) {

  const widthValue : string = props.width != null ? props.width : '80%'

  const handleChange = (event: any) => {
    props.onValueChange(event.target.value);
  };

  const type : string = props.id == "password_input" ? "password" : "text";

  return (
    <>
    <input id={props.id} className='TextInputBox' type={type} placeholder={props.for} 
    style={{width:widthValue}} onChange={handleChange}></input>
    </>
  )
}

export default TextInput