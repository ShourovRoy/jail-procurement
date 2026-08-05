// all performance security related definitions will be here

export interface PerformanceSecurity {
  id: string;
  tender_id: string;
  organization_id: string;
  participant_id: string;
  issuer_bank_name: string;
  issuer_bank_branch: string;
  performance_security_number: string;
  amount: string | number;
  issue_date: string;
  expiry_date: string;
  is_released: boolean;
  released_date: string | null;
  released_by: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}
