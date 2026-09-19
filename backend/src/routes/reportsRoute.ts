import express from "express";
import { CreateReport , GetReports} from "../controllers/ReportController";

const router = express.Router();
//get reports
router.get("/", GetReports);

//create
router.post("/", CreateReport);

export default router;