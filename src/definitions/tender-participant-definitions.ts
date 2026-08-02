// all tender participant related deifinitions will be here

import { User } from "./auth-definitions";
import { Jail } from "./jail-definitions";
import { Organization } from "./org-definitions";
import { PayOrder } from "./pay-order-definitions";
import { Tender } from "./tender-definitions";

// tender participant
export interface TenderParticipant {
  created_at: string;
  created_by: string;
  id: string;
  organization_id: string;
  quoted_amount: number;
  remarks: string;
  tender_id: string;
  updated_at: string;
}

// tender participant with creator, org and proprietor
export interface TenderParticipantWithCreatorOrgProprietor<C, O, P> {
  tender_participant: TenderParticipant;
  creator: C;
  organization: O;
  proprietor: P;
  pay_order_id: string;
  pay_order_number: string;
  pay_order_is_released: boolean;
}

// pay order participant details
export interface TenderParticipantDetails {
  tender_participant: TenderParticipant;
  tender: Tender;
  jail: Jail;
  organization: Organization;
  creator: User;
  pay_order: PayOrder;
}
