export interface Room {
    roomId: number;
    roomNumber: number;
    roomType: string;
    hotelId: number;
    maxOccupancy: number;
    isAvailable: boolean;
    imageUrl: string;
    status: String;
    price: number;
}