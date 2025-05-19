
// Define type for Lead
export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  isProspect: boolean;
  status: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Define the type for new lead data coming from the form
export interface NewLeadData {
  name: string;
  mobileNumber: string;
  email: string;
  prospect: string;
  status: string;
}

// Define a standalone function type to avoid circular references
export type AddLeadFunction = (data: NewLeadData) => Promise<Lead>;
