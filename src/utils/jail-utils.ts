// all the jail related utility functions will be here

import { GlobalRes } from "@/definitions/global-definition";
import { JailsDataRes } from "@/definitions/jail-definitions";
import { sleep } from "@/helpers/sleep-helper";
import { invoke } from "@tauri-apps/api/core";

// Create jail input interface
export interface CreateJailInput {
  name: string;
  address: string;
  district: string;
  phone_number: string;
}

// create jail utility function
export const createJailCommand = async (
  payload: CreateJailInput,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("create_new_jail_command", {
    input: payload,
  }).catch((err): GlobalRes<null> => {
    console.error("Error occurred while creating jail: ", err);
    return err;
  });

  return res;
};

// get all jails utils
export const getAllJailCommand = async (): Promise<
  GlobalRes<JailsDataRes<string> | null>
> => {
  const res = await invoke<GlobalRes<JailsDataRes<string>>>(
    "view_all_lists_command",
  ).catch((err): GlobalRes<null> => {
    return err;
  });

  return res;
};
