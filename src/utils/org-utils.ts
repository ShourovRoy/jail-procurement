// all organization related utils will be here

import { GlobalRes } from "@/definitions/global-definition";
import { invoke } from "@tauri-apps/api/core";

// Create org input interface
export interface CreateOrganizationInput {
  name: string;
  proprietor_name: string;
  address: string;
  district: string;
  phone_number: string;
  email: string;
}

// create org util func
export const createOrgCommand = async (
  payload: CreateOrganizationInput,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("create_organization_command", {
    input: payload,
  }).catch((err): GlobalRes<null> => {
    return err;
  });

  return res;
};
