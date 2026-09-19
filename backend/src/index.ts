import app from "./app";
import { connectDB } from "./configs/db.config";
import { env } from "./configs/env.config";

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
