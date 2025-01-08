import { useEffect, useState } from "react"
import { Room } from "../../../interfaces/Room";
import axios from "axios";


function AddRoom() {
    interface RoomProps {
        room: Room[];
    }

    const [newRoom, setNewRoom] = useState({RoomProps.room});

    // const response = async() =>{
    //     await axios.post("/rooms/add" )
    // }
    // if(response.status == 201){
    //     return true;
    // }
    // else{
    //     return false;
    // }
    useEffect(() => {
        const fetchHotels = async () => {
          try {
            const response = await axios.post("http://localhost:8080/rooms/add");
            if(response.status== 201){

            }
            
          } catch (error) {
            console.error("Error fetching hotels:", error);
          }
        };
    
        fetchHotels();
      }, []);
  return (
    <div>
      
    </div>
  )
}

export default AddRoom
