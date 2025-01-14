import { Room } from "./Room";

export interface Hotel {
    hotelId: number;
    name: string;
    location: string;
    imageUrl: string;
    rooms?: Room[];
    //owner: Owner;
}