export interface Booking {
    bookingId?: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    numberOfGuests: number;
    status: 'Pending' | 'Accepted' | 'Denied';
  }