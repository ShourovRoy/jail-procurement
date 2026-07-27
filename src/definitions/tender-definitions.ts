// all tender related deifinitions will be here

// tender status enum
export enum TenderStatus {
  OPEN = "open",
  AWARDED = "awarded",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

// Tender model
export interface Tender<J, W, C> {
  id: string;
  jail_id: J;

  tender_number: string;
  notice_number: string;

  estimated_amount: number;
  winner_bid_amount: number;

  dropping_date: string | null;
  opening_date: string | null;

  winner_participant_id: W;

  remarks: string;

  status: TenderStatus;

  created_by: C;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

// tenders list data res
export interface TendersDataRes<J, W, C> {
  tenders: Tender<J, W, C>[];
}
