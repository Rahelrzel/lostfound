import { Request, Response } from "express";
import Report from "../models/Report";

export const CreateReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      image,
      category,
      location,
      latitude,
      longitude,
      lostDate,
      type,
      userID,   
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !image ||
      !category ||
      !location ||
      latitude === undefined ||
      longitude === undefined ||
      !lostDate ||
      !type
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Validate report type
    if (!["lost", "found"].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Type must be either 'lost' or 'found'",
      });
      return;
    }

    // Validate coordinates
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      res.status(400).json({
        success: false,
        message: "Latitude and longitude must be numbers",
      });
      return;
    }

    // Validate date
    const parsedDate = new Date(lostDate);

    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid lost date",
      });
      return;
    }

    // Create report
    const report = await Report.create({
      title: title.trim(),
      description: description.trim(),
      image,
      category: category.trim(),
      location: location.trim(),
      latitude,
      longitude,
      lostDate: parsedDate,
      type,
      createdBy: userID,
    });

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    console.error("CreateReport Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};