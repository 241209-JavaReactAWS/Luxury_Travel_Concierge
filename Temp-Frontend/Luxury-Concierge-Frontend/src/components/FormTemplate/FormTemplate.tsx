import React from 'react'
import "./FormTemplate.css"

const FormTemplate = (props:any) => {
  return (
    <div id='formTemplate'>
        <div id='formInnerData'>
            {props.data}
        </div>
    </div>
  )
}

export default FormTemplate