import express from "express";
import { 
  createSkill, 
  getSkills, 
  getSkillById, 
  updateSkill, 
  deleteSkill 
} from "./skill.controllers.js";
import { 
  validateCreateSkillJson, 
  validateUpdateSkillJson, 
  validateSkillId,
  validateGetSkillsQuery 
} from "./skill.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";

const skillRoutes = express.Router();

// Create a new skill
skillRoutes.post("/", authenticate, requireAdmin, validateCreateSkillJson, createSkill);

// Get all skills with pagination and search
skillRoutes.get("/", validateGetSkillsQuery, getSkills);

// Get a single skill by ID
skillRoutes.get("/:id", validateSkillId, getSkillById);

// Update a skill
skillRoutes.put("/:id", authenticate, requireAdmin, validateSkillId, validateUpdateSkillJson, updateSkill);

// Delete a skill
skillRoutes.delete("/:id", authenticate, requireAdmin, validateSkillId, deleteSkill);

export default skillRoutes;
