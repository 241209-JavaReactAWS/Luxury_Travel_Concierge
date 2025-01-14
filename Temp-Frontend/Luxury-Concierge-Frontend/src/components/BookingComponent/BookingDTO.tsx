
export interface BookingDTO {

    bookingId: number;
    hotelName: string;
    userID: number;
    roomTypeName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    duration: string;
    status: 'PENDING' | 'CONFIRMED' | 'CONCELLED';
    totalPrice: number;
  }