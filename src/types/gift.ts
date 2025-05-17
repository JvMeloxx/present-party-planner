
export type GiftList = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_public: boolean;
  event_date?: string | null; // Suporta presença ou ausência do campo
};

export type Gift = {
  id: string;
  list_id: string;
  name: string;
  description: string | null;
  reserver_name: string | null;
  reserved_at: string | null;
  created_at: string;
};
