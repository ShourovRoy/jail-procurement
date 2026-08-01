// all jail related definition will be here

export interface Jail {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface JailWithCreator<T> {
  jail: Jail;
  creator: T;
}

export interface JailsDataRes<T> {
  jails: JailWithCreator<T>[];
}
