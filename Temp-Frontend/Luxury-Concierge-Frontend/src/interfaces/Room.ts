export interface Room {
    roomId: number;
    roomName: string;
    roomType: string;
    maxOccupancy: number;
    availability: boolean;
    imageUrl: string;
    status: String;
    pricePerNight: number;
}