export interface Booking {
    bookingId?: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    capacity: number;
  }