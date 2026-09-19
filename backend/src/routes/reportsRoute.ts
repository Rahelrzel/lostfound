import express from "express";
import { CreateReport, GetReports, GetReportById, DeleteReport, UpdateReport } from "../controllers/ReportController";
import { authenticateUser } from "../middleware/auth.moddleware";

const router = express.Router();

//create
router.post("/" ,authenticateUser,CreateReport);
//get reports
router.get("/", GetReports);

router.delete("/:id",authenticateUser, DeleteReport)
router.put("/:id",authenticateUser, UpdateReport)
router.get("/:id", GetReportById)

export default router;