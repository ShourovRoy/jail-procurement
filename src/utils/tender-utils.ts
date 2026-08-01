// all tender related utils will be here

import { GlobalRes } from "@/definitions/global-definition";
import {
  TenderDetailsWithBidsRes,
  TendersDataRes,
} from "@/definitions/tender-definitions";
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

// query tender list
export const queryTenderListCommand = async (): Promise<
  GlobalRes<TendersDataRes<string, string, string>>
> => {
  const res = invoke<GlobalRes<TendersDataRes<string, string, string>>>(
    "tender_list_comamnd",
  ).catch((err): GlobalRes<TendersDataRes<string, string, string>> => {
    return err;
  });

  return res;
};

// query tender details with bids and winner details
export const queryTenderDetailsCommand = async (
  tender_id: string,
): Promise<
  GlobalRes<
    TenderDetailsWithBidsRes<string, string, string, string, string, string>
  >
> => {
  const res = await invoke<
    GlobalRes<
      TenderDetailsWithBidsRes<string, string, string, string, string, string>
    >
  >("tender_details_with_bids_command", {
    input: {
      tender_id,
    },
  }).catch(
    (
      err,
    ): GlobalRes<
      TenderDetailsWithBidsRes<string, string, string, string, string, string>
    > => {
      return err;
    },
  );

  return res;
};
