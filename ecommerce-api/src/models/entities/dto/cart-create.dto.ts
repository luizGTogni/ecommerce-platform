import { CartStatus } from "../cart.entity.js";

export type CartCreate = {
  user_id: string;
  status: CartStatus;
};
