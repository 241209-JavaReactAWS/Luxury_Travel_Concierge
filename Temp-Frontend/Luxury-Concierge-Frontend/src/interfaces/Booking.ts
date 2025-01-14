import { Room } from './Room';

export interface Booking {
    totalPrice: ReactNode;
    hotelName: ReactNode;
    roomTypeName: ReactNode;
    bookingId?: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    price: Room["price"];
    numberOfGuests: number;
    status: 'Pending' | 'Accepted' | 'Denied';
  }