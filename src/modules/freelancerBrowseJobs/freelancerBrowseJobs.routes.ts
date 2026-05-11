import express from "express";
import { getBrowseJobs } from "./freelancerBrowseJobs.controllers.js";
import { validateBrowseFreelancerJobsQuery } from "./freelancerBrowseJobs.validation.middlewares.js";

const freelancerBrowseJobsRoutes = express.Router();

freelancerBrowseJobsRoutes.get("/", validateBrowseFreelancerJobsQuery, getBrowseJobs);

export default freelancerBrowseJobsRoutes;
