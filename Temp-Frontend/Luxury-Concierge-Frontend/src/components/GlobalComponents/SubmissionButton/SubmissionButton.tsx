import React, { useState } from 'react'
import "./SubmissionButton.css"
import axios from 'axios'
import EndpointProp from '../../../interfaces/EndpointProp'

function SubmissionButton(props : EndpointProp) {

  const placeholder : string = props.placeholder != null ? props.placeholder : "Submit"

  function submit(){
    if(props.type == "GET"){
      axios.get(props.endpoint,{withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
      .then((data : any) => {props.onSuccess(data)})
      .catch((error : any) => {props.onError(error)})
    }
    else if(props.type == "POST"){
      axios.post(props.endpoint,props.data != null ? props.data : {},{withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
      .then((data : any) => {props.onSuccess(data)})
      .catch((error : any) => {props.onError(error)})
    }
    else if(props.type == "DELETE"){
      axios.delete(props.endpoint,{withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
      .then((data : any) => {props.onSuccess(data)})
      .catch((error : any) => {props.onError(error)})
    }
    else if(props.type == "PUT"){
      axios.put(props.endpoint,props.data != null ? props.data : {},{withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
      .then((data : any) => {props.onSuccess(data)})
      .catch((error : any) => {props.onError(error)})
    }
    else{
      props.statusChanger(-1)
    }
  }
  
  return (
    <button id='SubmitButton' onClick={submit}>{placeholder}</button>
  )
}

export default SubmissionButton