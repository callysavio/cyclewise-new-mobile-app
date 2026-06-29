export type TicketOrder = {
  id: string;
  orderId: string;
  fullName: string;
  phone?: string;
  email?: string;
  quantity: number;
  ticketId?: string;
  eventId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  event: Event;
  ticket?: Ticket;
  individualTickets: IndividualTicket[];
  paymentHistory?: PaymentHistory;
};

export type IndividualTicket = {
  id: string;
  uniqueTicketId: string;
  ticketNumber: number;
  status: TicketStatus;
  checkedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  ticketOrderId: string;
  ticketId?: string;
  eventId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  ticketOrder: TicketOrder;
  ticket?: Ticket;
  event: Event;
};

export type Ticket = {
  id: string;
  name: string;
  description?: string;
  qtyAvailable: number;
  totalSold: number;
  price: number;
  isFree: boolean;
  whoIsPaying: WhoIsPaying;
  maxPerUser?: number;
  isActive: boolean;
  salesStart: string;
  salesEnd: string;
  eventId?: string;
  userId?: string;
  anonymousEventId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaymentHistory = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  ticketOrderId: string;
  createdAt: string;
  updatedAt: string;
};

export type TicketStatus = 'ACTIVE' | 'CANCELLED' | 'REFUNDED' | 'EXPIRED' | 'TRANSFERRED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export type WhoIsPaying = 'ATTENDEE' | 'ORGANIZER';
