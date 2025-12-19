export enum DeliveryStatus {
  PENDING = 'Pending',
  PICKED_UP = 'Picked Up',
  ON_DELIVERY = 'On Delivery',
  DELIVERED = 'Terkirim',
  CANCELLED = 'Dibatalkan' // Ini status sementara saat kurir klik cancel
}

export interface Package {
  id: string;
  trackingNumber: string;
  sender: string;
  recipient: string;
  address: string;
  status: DeliveryStatus;
  timestamp: string;
  deliveryTime?: string;
  recipientName?: string;
  proofImage?: string;
  isCod: boolean;
  codAmount?: number;
  cancelReason?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  avatar: string;
  totalDeliveries: number;
  rating: number;
  balance: number;
}

export interface AppState {
  isClockedIn: boolean;
  isShiftStarted: boolean;
  currentStep: 'ATTENDANCE' | 'SETUP_TOTAL' | 'LOADING_SCAN' | 'DELIVERING' | 'HANDOVER' | 'COMPLETED';
  expectedCod: number;
  expectedNonCod: number;
  handoverPhoto?: string;
  handoverLeader?: string;
}