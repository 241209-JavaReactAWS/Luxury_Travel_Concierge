import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookingDataChart from '../BookingDataChart/BookingDataChart';
import "./HotelSettings.css"
import Supplementaries from '../../SupplementaryClass';
import TextInput from '../GlobalComponents/TextInput/TextInput';
import SubmissionButton from '../GlobalComponents/SubmissionButton/SubmissionButton';
import Popup from '../GlobalComponents/Popup/Popup';
import RoomManagement from '../RoomComponent/RoomManagement';

const HotelSettings = () => {
    const { hotelId } = useParams();
    const [name, setName] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [originalName, setOriginalName] = React.useState("");
    const [originalLocation, setOriginalLocation] = React.useState("");
    const [originalDescription, setOriginalDescription] = React.useState("");
    const [originalImageUrl, setOriginalImageUrl] = React.useState("");

    if( hotelId == null) {
        window.location.href = Supplementaries.clientLink + "HotelManagement";
    }


    const data = {
        hotelId: hotelId,
        name: name,
        location: location,
        description: description,
        imageUrl: imageUrl
    }
    useEffect(() => {
        axios.get(Supplementaries.serverLink + `hotel/${hotelId}`, { withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                } })
        .then((response) => {
            let hotel = response.data;
            setName(hotel.name);
            setLocation(hotel.location);
            setDescription(hotel.description);
            setImageUrl(hotel.imageUrl);
            setOriginalName(hotel.name);
            setOriginalLocation(hotel.location);
            setOriginalDescription(hotel.description);
            setOriginalImageUrl(hotel.imageUrl);
        })
    },[])
    

    
    const onSuccess = () => {
        window.location.reload()
    }

    const onFailure = () => {
        alert("Failed to update hotel information");
    }


    const onClose = () => {
        setIsModalOpen(false);
    }

    const children = <>
        <h1>Are you sure you want to delete this hotel?</h1>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <button onClick={() => setIsModalOpen(false)} 
            style={{backgroundColor:'#db9d17', color:'white', padding:'10px', borderRadius:'5px', border:'none'}}>
            No</button>
            
            <button onClick={() => {
                axios.delete(Supplementaries.serverLink + "hotel/" + hotelId, { withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                },data:data })
                .then(() => {
                    alert("Hotel deleted successfully");
                    window.location.href = Supplementaries.clientLink + "HotelManagement";
                })
                .catch(() => {
                    alert("Failed to delete hotel");
                })
                window.location.href = Supplementaries.clientLink + "HotelManagement";
            }} 
            style={{backgroundColor:'red', color:'white', padding:'10px', borderRadius:'5px', border:'none'}}>Yes</button></div>
            </>


  return (
    <>
    <Popup isOpen={isModalOpen} onClose={onClose} children={children}/>
    <img src={originalImageUrl} style={{width:'100%', height:'300px', objectFit:'cover'}}/>
    <div id='HotelValues' style={{width:'70%', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1>{originalName}</h1>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <button onClick={() => window.location.href = Supplementaries.clientLink + "HotelManagement"} 
                style={{backgroundColor:'#db9d17', color:'white', padding:'10px', borderRadius:'5px', border:'none'}}>Back</button>
                <button onClick={() => setIsModalOpen(true)} 
                style={{backgroundColor:'red', marginLeft: '5px', color:'white', padding:'10px', borderRadius:'5px', border:'none'}}>Delete</button>
            </div>
        </div>
        <div style={{backgroundColor:'#f5f5f5', padding:'20px', borderRadius:'10px', border:'1px solid #db9d17'}}>
            <h2>{originalLocation}</h2>
            <p>{originalDescription}</p>
        </div>
    </div>
    <div id='HotelSettings' style={{width:'70%', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
        <h1>Update Information</h1>
        <div style={{backgroundColor:'#f5f5f5', padding:'20px', borderRadius:'10px', border:'1px solid #db9d17'}}>
            <TextInput id="hotel_name" for={"Name"} onValueChange={setName} width='99%'/>
            <TextInput id="hotel_location" for={"Location"} onValueChange={setLocation} width='99%'/>
            <TextInput id="hotel_description" for={"Description"} onValueChange={setDescription} width='99%'/>
            <TextInput id="hotel_imageUrl" for={"ImageUrl"} onValueChange={setImageUrl} width='99%'/>
            <SubmissionButton endpoint={Supplementaries.serverLink + "hotel/" + hotelId} type={"PUT"} data={data} onSuccess={onSuccess} onError={onFailure}/>
        </div>
    </div>
    <div id="room-container" style={{width:'70%', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
        <h1>Update Rooms</h1>
        <div style={{backgroundColor:'#f5f5f5', padding:'20px', borderRadius:'10px', border:'1px solid #db9d17'}}>
            <RoomManagement hotelId={parseInt(hotelId!)}/>
        </div>
    </div>
    <div id="data-contaienr" style={{width:'70%', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
        <h1>Booking Information</h1>
        <div id="chart-container" style={{marginLeft:'auto', marginRight:'auto', marginBottom:'50px', backgroundColor:'#f5f5f5', padding:'20px', borderRadius:'10px', border:'1px solid #db9d17'}}>
            <BookingDataChart hotelId={hotelId}/>
        </div>
    </div>
    </>
  )
}

export default HotelSettings