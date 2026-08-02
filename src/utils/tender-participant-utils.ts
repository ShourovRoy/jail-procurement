// all tender participants related utils here (bid)

import { GlobalRes } from "@/definitions/global-definition";
import { TenderParticipantDetails } from "@/definitions/tender-participant-definitions";
import { invoke } from "@tauri-apps/api/core";

// new tender participant interface
export interface CreateTenderParticipant {
  tender_id: string;
  organization_id: string;
  quoted_amount: number;
  bid_submission_date: string;
  remarks: string;
  issuer_bank_name: string;
  issuer_bank_branch: string;
  pay_order_number: string;
  pay_order_expiry_date: string;
  pay_order_issue_date: string;
  pay_order_amount: number;
}

// add new participand to a tender util
export const addTenderParticipant = async (
  payload: CreateTenderParticipant,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("add_participant_command", {
    input: payload,
  }).catch((err): GlobalRes<null> => {
    return err;
  });

  return res;
};

// get tender participant details util
export const getTenderParticipantDetails = async (
  tender_participant_id: string,
): Promise<GlobalRes<TenderParticipantDetails>> => {
  
  const res = await invoke<GlobalRes<TenderParticipantDetails>>(
    "tender_participant_details_command",
    {
      input: {
        tender_participant_id,
      },
    },
  ).catch((err): GlobalRes<TenderParticipantDetails> => {
    return err;
  });

  return res;
};
