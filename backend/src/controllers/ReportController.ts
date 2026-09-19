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


// GET all reports with search, filters, and sorting
export const GetReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      category,
      type,
      location,
      sort = "desc",
    } = req.query;

    // Build filter object
    const filter: Record<string, any> = {};

    // Search by title or description
    if (search && typeof search === "string") {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by category
    if (category && typeof category === "string") {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    // Filter by Lost / Found
    if (type && typeof type === "string") {
      if (!["lost", "found"].includes(type.toLowerCase())) {
        res.status(400).json({
          success: false,
          message: "Type must be either 'lost' or 'found'",
        });
        return;
      }

      filter.type = type.toLowerCase();
    }

    // Filter by location
    if (location && typeof location === "string") {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Validate sort option
    if (sort !== "asc" && sort !== "desc") {
      res.status(400).json({
        success: false,
        message: "Sort must be either 'asc' or 'desc'",
      });
      return;
    }

    // Sort by created date
    const sortOrder = sort === "asc" ? 1 : -1;

    const reports = await Report.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: sortOrder });

    res.status(200).json({
      success: true,
      count: reports.length,
      filters: {
        search: search || null,
        category: category || null,
        type: type || null,
        location: location || null,
        sort,
      },
      data: reports,
    });
  } catch (error) {
    console.error("GetReports Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

// GET report by ID
export const GetReportById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("createdBy", "name email");

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Report not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("GetReportById Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};