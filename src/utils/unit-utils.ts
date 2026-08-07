// all unit utils will be here

import { GlobalRes } from "@/definitions/global-definition";
import { UnitsDataRes } from "@/definitions/unit-definitions";
import { invoke } from "@tauri-apps/api/core";

// create new unit input
export interface CreateNewUnitInput {
  name: string;
  short_name: string;
}

// create new unit
export const createNewUnitUtilCommand = async (
  payload: CreateNewUnitInput,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("create_new_unit_command", {
    input: {
      ...payload,
    },
  }).catch((err): GlobalRes<null> => {
    return err;
  });

  return res;
};

// get all units util
export const getAllUnitsCommand = async (): Promise<
  GlobalRes<UnitsDataRes<string> | null>
> => {
  const res = await invoke<GlobalRes<UnitsDataRes<string>>>("get_all_units_command").catch(
    (err): GlobalRes<null> => {
      return err;
    },
  );

  return res;
};
