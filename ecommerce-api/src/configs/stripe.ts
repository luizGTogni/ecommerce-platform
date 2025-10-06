import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});
