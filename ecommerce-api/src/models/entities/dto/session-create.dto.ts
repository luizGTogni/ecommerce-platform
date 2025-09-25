export type SessionCreate = {
  user_id: string;
  token_hash: string;
  expires_at: Date;
};
