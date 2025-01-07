//import { Owner } from "./Owner";

import { Room } from "./Room";

export interface Hotel {
    hotelId: number;
    hotelName: string;
    location: string;

    // hotelStreet: string; 
    // hotelCity: string;
    // hotelState: string;
    // hotelZipcode: number;
    // hotelPhoneNumber: string;
    // hotelEmail: string;
    imageUrl: string;
    rooms: Room;
    //owner: Owner;
}