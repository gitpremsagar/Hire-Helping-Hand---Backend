import express from "express";
import {
  getClientProfile,
  getAllClients,
  updateClientProfile,
  getClientContracts,
  getClientStats,
  deleteClient,
  reactivateClient
} from "./client.controllers.js";
import {
  validateUpdateClientProfile,
  validateGetClientsQuery,
  validateGetClientContractsQuery,
  validateClientIdParam
} from "./client.validation.middlewares.js";

const clientRoutes = express.Router();

// Client profile routes
clientRoutes.get("/:clientId", validateClientIdParam, getClientProfile);
clientRoutes.put("/:clientId", validateUpdateClientProfile, updateClientProfile);
clientRoutes.delete("/:clientId", validateClientIdParam, deleteClient);
clientRoutes.patch("/:clientId/reactivate", validateClientIdParam, reactivateClient);

// Client contracts routes
clientRoutes.get("/:clientId/contracts", validateGetClientContractsQuery, getClientContracts);

// Client statistics routes
clientRoutes.get("/:clientId/stats", validateClientIdParam, getClientStats);

// Get all clients route
clientRoutes.get("/", validateGetClientsQuery, getAllClients);

export default clientRoutes;

