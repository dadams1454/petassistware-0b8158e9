
import { Customer } from "@/components/customers/types/customer";
import { Puppy } from "./litter";

export type ReservationStatus = 
  | 'Pending'
  | 'Approved'
  | 'Deposit Paid'
  | 'Contract Signed'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Cancelled';

export interface Reservation {
  id: string;
  puppy_id?: string;
  customer_id?: string;
  reservation_date: string; // ISO format date
  status: ReservationStatus;
  notes?: string;
  deposit_amount?: number;
  deposit_paid: boolean;
  deposit_date?: string; // ISO format date
  contract_signed: boolean;
  contract_date?: string; // ISO format date
  pickup_date?: string; // ISO format date
  status_updated_at?: string; // ISO format date
  created_at?: string; // ISO format date
  
  // Related entities
  puppy?: Puppy;
  customer?: Customer;
}

export interface ReservationStatusHistory {
  id: string;
  reservation_id: string;
  previous_status?: ReservationStatus;
  new_status: ReservationStatus;
  changed_at: string; // ISO format date
  changed_by?: string;
  notes?: string;
}

export interface Deposit {
  id: string;
  reservation_id: string;
  customer_id?: string;
  puppy_id?: string;
  amount: number;
  payment_date: string; // ISO format date
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  notes?: string;
  receipt_url?: string;
  created_at: string; // ISO format date
  created_by?: string;
}

export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'paypal' | 'venmo' | 'zelle' | 'check' | 'other';
