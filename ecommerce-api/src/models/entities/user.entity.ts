export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  session_hash: string | null;
  created_at: Date;
};
