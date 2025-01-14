export interface Booking {
    bookingId: number;
    hotelName: string;
    roomTypeName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    duration: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    totalPrice: number;
  }