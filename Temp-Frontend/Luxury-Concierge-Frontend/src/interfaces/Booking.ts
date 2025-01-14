export interface Booking {
    bookingId?: number;
    roomId: number;
    hotelId?: number;
    userId: number;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    numberOfGuests: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  }