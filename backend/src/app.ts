import express from "express";
import cors from "cors";
import router from "./routes/routes.index";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "lost found API is running 🚀" });
});

app.use("/api", router);

export default app;
