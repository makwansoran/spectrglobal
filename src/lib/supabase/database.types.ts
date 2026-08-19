export type Profile = {
  id: string;
  full_name: string;
  country: string;
  email: string;
  username?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          country?: string;
          email?: string;
          username?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
