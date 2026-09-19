import express from "express";
import { CreateReport } from "../controllers/ReportController";

const router = express.Router();

router.post("/", CreateReport);

export default router;