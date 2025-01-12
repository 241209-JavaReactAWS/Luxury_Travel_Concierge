import React from 'react'
import "./TextInput.css"
import TextInputInterface from '../../../interfaces/TextInputInterface'

/*
  This class is for a standard text input
  props.width is to define the width of textbox
  props.onValueChange is the external useState changer function to
  props.for is what the placeholder says
  props.id is the id of the item
*/


function TextInput(props : TextInputInterface) {

  const widthValue : string = props.width != null ? props.width : '80%'

  const handleChange = (event: any) => {
    props.onValueChange(event.target.value);
  };

  let type : string;
  if(props.type == "email"){
    type = "email"
  } else if(props.type == "password"){
    type = "password"
  }
  else{ type = "text" }

  return (
    <>
    <input id={props.id} className='TextInputBox' type={type} placeholder={props.for} 
    style={{width:widthValue}} onChange={handleChange}></input>
    </>
  )
}

export default TextInput