import type { Timestamp } from 'firebase/firestore';

export type FlightAlert = {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  dates: string;
  targetPrice: number;
  createdAt: Timestamp;
};
