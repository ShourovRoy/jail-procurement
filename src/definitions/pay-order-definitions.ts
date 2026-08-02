// all pay order related models are defined here

// pay order model
export interface PayOrder {
  id: string;
  participant_id: string;
  issuer_bank_name: string;
  issuer_bank_branch: string;
  pay_order_number: string;
  amount: number;
  issue_date: Date;
  expiry_date: Date;
  is_released: boolean;
  released_date: null;
  released_by: null;
  remarks: string;
  created_at: Date;
  updated_at: Date;
}
