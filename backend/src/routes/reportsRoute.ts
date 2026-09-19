import express from "express";
import { CreateReport, GetReports, GetReportById, DeleteReport, UpdateReport } from "../controllers/ReportController";

const router = express.Router();

//create
router.post("/", CreateReport);
//get reports
router.get("/", GetReports);

router.delete("/:id", DeleteReport)
router.put("/:id", UpdateReport)
router.get("/:id", GetReportById)

export default router;