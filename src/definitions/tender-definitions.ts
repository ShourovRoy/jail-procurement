// all tender related deifinitions will be here

import { TenderParticipantWithCreatorOrgProprietor } from "./tender-participant-definitions";

// tender status enum
export enum TenderStatus {
  OPEN = "open",
  AWARDED = "awarded",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

// Tender model
export interface Tender {
  id: string;
  jail_id: string;

  tender_number: string;
  notice_number: string;

  estimated_amount: number;
  winner_bid_amount: number;

  dropping_date: string | null;
  opening_date: string | null;

  winner_participant_id: string | null;

  remarks: string;

  status: TenderStatus;

  created_by: String;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

// tender with Jail Winner Org and Creator
export interface TenderWithJailWinnerOrgCreator<J, O, C> {
  tender: Tender;
  creator: C;
  jail: J;
  winner_organization: O | null;
}

// tenders list data res
export interface TendersDataRes<J, O, C> {
  tenders: TenderWithJailWinnerOrgCreator<J, O, C>[];
}

// tender details with bids and winner details
export interface TenderDetailsWithBidsRes<JI, OI, CI, C, O, P> {
  tender: TenderWithJailWinnerOrgCreator<JI, OI, CI>;
  participants: TenderParticipantWithCreatorOrgProprietor<C, O, P>[];
}
