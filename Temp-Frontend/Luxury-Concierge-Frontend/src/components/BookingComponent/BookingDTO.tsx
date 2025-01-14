export interface BookingDTO {
    bookingId: number;
    hotelName: string;
    userID: number;
    roomTypeName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuest: number;
    duration: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    totalPrice: number;
  }