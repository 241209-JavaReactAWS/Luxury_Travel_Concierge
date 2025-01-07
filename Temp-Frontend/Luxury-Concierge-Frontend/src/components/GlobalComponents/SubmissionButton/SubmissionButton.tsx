import React, { useState } from 'react'
import "./SubmissionButton.css"
import axios from 'axios'
import EndpointProp from '../../../interfaces/EndpointProp'

function SubmissionButton(props : EndpointProp) {

  const placeholder : string = props.placeholder != null ? props.placeholder : "Submit"

  function submit(){
    if(props.type == "GET"){
      axios.get(props.endpoint,{withCredentials:true})
      .then((data : any) => {props.onSuccess(data);props.statusChanger(0)})
      .catch((error : any) => {props.onError(error);props.statusChanger(1)})
    }
    else if(props.type == "POST"){
      axios.post(props.endpoint,props.data == null ? props.data : {},{withCredentials:true})
      .then((data : any) => {props.onSuccess(data);props.statusChanger(0)})
      .catch((error : any) => {props.onError(error);props.statusChanger(1)})
    }
    else if(props.type == "DELETE"){
      axios.delete(props.endpoint,{withCredentials:true})
      .then((data : any) => {props.onSuccess(data);props.statusChanger(0)})
      .catch((error : any) => {props.onError(error);props.statusChanger(1)})
    }
    else if(props.type == "PUT"){
      axios.put(props.endpoint,props.data == null ? props.data : {},{withCredentials:true})
      .then((data : any) => {props.onSuccess(data);props.statusChanger(0)})
      .catch((error : any) => {props.onError(error);props.statusChanger(1)})
    }
    else{
      props.statusChanger(-1)
    }
  }
  
  return (
    <button id='SubmitButton' onClick={props.statusChanger(0)}>{placeholder}</button>
  )
}

export default SubmissionButton