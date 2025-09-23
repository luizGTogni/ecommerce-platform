import { env } from "@/configs/env.js";
import { app } from "./app.js";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("Server is running...");
    console.log(`https://localhost:${env.PORT}`);
  });
