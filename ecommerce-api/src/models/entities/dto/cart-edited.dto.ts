import { CartStatus } from "../cart.entity.js";

export type CartEdited = {
  id: string;
  user_id: string;
  status: CartStatus;
  finished_at: Date | null;
  created_at: Date;
};
