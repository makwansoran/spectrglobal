export type Profile = {
  id: string;
  full_name: string;
  country: string;
  email: string;
  username?: string;
  product_access?: boolean;
  careers_access?: boolean;
  os_download_granted?: boolean;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name: string;
          country: string;
          email: string;
          username?: string;
          product_access?: boolean;
          careers_access?: boolean;
          os_download_granted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          country?: string;
          email?: string;
          username?: string;
          product_access?: boolean;
          careers_access?: boolean;
          os_download_granted?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_otps: {
        Row: {
          id: string;
          email: string;
          code_hash: string;
          kind: string;
          purpose: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          email: string;
          code_hash: string;
          kind: string;
          purpose: string;
          expires_at: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
