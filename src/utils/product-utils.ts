import { GlobalRes } from "@/definitions/global-definition";
import { invoke } from "@tauri-apps/api/core";

export interface CreateProductInput {
  name: string;
  unit_id: string;
  description: string;
}

export const createNewProductUtilCommand = async (
  payload: CreateProductInput,
): Promise<GlobalRes<null>> => {
  const res = await invoke<GlobalRes<null>>("create_new_product_command", {
    input: payload,
  }).catch((err): GlobalRes<null> => {
    return err;
  });

  return res;
};
