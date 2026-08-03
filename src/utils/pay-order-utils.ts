// all pay order related utils will be here

import { GlobalRes } from "@/definitions/global-definition";
import { invoke } from "@tauri-apps/api/core";

export interface ReleasePayorderInput {
  pay_order_id: string;
  participant_id: string;
  released_date: string;
}

// release payorder util
export const releasePayorderUtilCommand = async (
  payload: ReleasePayorderInput,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("release_pay_order_command", {
    input: {
      pay_order_id: payload.pay_order_id,
      participant_id: payload.participant_id,
      released_date: payload.released_date,
    }
  }).catch((err): GlobalRes<null> => {
    return err;
  });
  console.log("released payorder res: ", res);
  return res;
};
