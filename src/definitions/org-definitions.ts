// all org related definitions will be here

// Organization Definition

export interface Organization {
  id: string;
  address: string;
  created_at: string; // ISO 8601 timestamp string
  created_by: string;
  district: string;
  email: string;
  name: string;
  phone_number: string;
  proprietor_name: string;
  updated_at: string; // ISO 8601 timestamp string
}

export interface OrganizationWithCreator<T> {
  organization: Organization;
  creator: T;
}

// organiztion list query res
export interface OrganizationListRes<T> {
  organizations: OrganizationWithCreator<T>[];
}
