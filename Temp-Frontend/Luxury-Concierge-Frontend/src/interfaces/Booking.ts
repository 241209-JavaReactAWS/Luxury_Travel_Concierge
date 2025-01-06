export interface Booking {
    bookingId?: number;
    userId: number;
    roomId: number;
    dateCheckIn: string;
    dateCheckOut: string;
    totalCost: number;
    bookingStatus: string;
  }