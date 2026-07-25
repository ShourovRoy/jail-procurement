// all tender related utils will be here

import { GlobalRes } from "@/definitions/global-definition";
import { invoke } from "@tauri-apps/api/core";

// tender creation input interface
export interface TenderCreateInput {
  jail_id: string;
  tender_number: string;
  notice_number?: string;
  estimated_amount: number;
  remarks?: string;
}

// create tender util
export const createTenderCommand = async (
  payload: TenderCreateInput,
): Promise<GlobalRes<null>> => {
  return await invoke<GlobalRes<null>>("create_tender_comamnd", {
    input: payload,
  }).catch((err): GlobalRes<null> => {
    return err;
  });
};
