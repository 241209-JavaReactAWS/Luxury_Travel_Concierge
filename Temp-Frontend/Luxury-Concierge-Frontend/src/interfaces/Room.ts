export interface Room {
    roomId: number;
    roomNumber: number;
    roomType: string;
    hotel: number;
    maxOccupancy: number;
    isAvailable: boolean;
    imageUrl: string;
    status: String;
    price: number;
}