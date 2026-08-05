// add all performance security related utils here

import { GlobalRes } from "@/definitions/global-definition";
import { invoke } from "@tauri-apps/api/core";

// performance security input interface
export interface AddPerformanceSecurityInput {
  tender_id: string;
  organization_id: string;
  participant_id: string;
  performance_security_number: string;
  amount: number;
  issue_date: string;
  expiry_date: string;
  remarks: string;
}

// add performance security util command
export const addPerformanceSecurityUtilCommand = async (
  payload: AddPerformanceSecurityInput,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>(
    "add_performance_security_command",
    {
      input: {
        ...payload,
      },
    },
  ).catch((err): GlobalRes<null> => {
    return err;
  });

  return res;
};
