// all tender participants related utils here (bid)

import { invoke } from "@tauri-apps/api/core";

// new tender participant interface
export interface CreateTenderParticipant {
  tenderId: string;
  organizationId: string;
  quotedAmount: number;
  bidSubmissionDate: string;
  remarks: string;
}

// add new participand to a tender util
export const addTenderParticipant = async (
  payload: CreateTenderParticipant,
) => {
  invoke("add_participant_command", {
    input: payload,
  });
};
