import React from 'react'

const CardComponent = (props:any) => {
  return (
    <div key={props.hotelId} className="hotel-card">
            <img src={props.imageUrl} alt={props.name} className="hotel-image" />
            <h3>{props.name}</h3>
            <p>{props.description}</p>
            <p>{props.location},</p>
            {props.interactive ? <button onClick={() => props.handle()}>{props.word}</button> : <></> }
          </div>
  )
}

export default CardComponent