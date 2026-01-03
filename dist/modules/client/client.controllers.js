import "dotenv/config";
import { prisma, withTransaction } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
// Get client profile
export const getClientProfile = async (req, res) => {
    try {
        const { clientId } = req.params;
        const client = await prisma.user.findFirst({
            where: {
                id: clientId,
                isClient: true,
                isDeleted: false,
                isSuspended: false,
                isBlocked: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatar: true,
                website: true,
                phone: true,
                address: true,
                country: true,
                state: true,
                city: true,
                zip: true,
                latitude: true,
                longitude: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                createdAt: true,
                updatedAt: true,
                contracts: {
                    select: {
                        id: true,
                        type: true,
                        status: true,
                        totalFixedAmount: true,
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                        freelancer: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                freelancerProfile: {
                                    select: {
                                        title: true,
                                        experienceLevel: true,
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        if (!client) {
            throw ErrorTypes.NOT_FOUND("Client");
        }
        sendSuccess(res, "Client profile retrieved successfully", client);
    }
    catch (error) {
        handleError(error, res, "Failed to get client profile");
    }
};
// Get all clients (with pagination and filtering)
export const getAllClients = async (req, res) => {
    try {
        const { page = '1', limit = '10', search, country, state, city, isEmailVerified, isPhoneVerified, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {
            isClient: true,
            isDeleted: false,
            isSuspended: false,
            isBlocked: false
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (country)
            where.country = country;
        if (state)
            where.state = state;
        if (city)
            where.city = city;
        if (isEmailVerified !== undefined)
            where.isEmailVerified = isEmailVerified === 'true';
        if (isPhoneVerified !== undefined)
            where.isPhoneVerified = isPhoneVerified === 'true';
        // Build orderBy clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        const [clients, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    avatar: true,
                    website: true,
                    country: true,
                    state: true,
                    city: true,
                    isEmailVerified: true,
                    isPhoneVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            contracts: true
                        }
                    }
                },
                orderBy,
                skip,
                take: limitNum
            }),
            prisma.user.count({ where })
        ]);
        const totalPages = Math.ceil(total / limitNum);
        sendSuccess(res, "Clients retrieved successfully", {
            clients,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1
            }
        });
    }
    catch (error) {
        handleError(error, res, "Failed to get clients");
    }
};
// Update client profile
export const updateClientProfile = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { name, bio, website, phone, address, country, state, city, zip, latitude, longitude } = req.body;
        // Check if client exists
        const existingClient = await prisma.user.findFirst({
            where: {
                id: clientId,
                isClient: true,
                isDeleted: false
            }
        });
        if (!existingClient) {
            throw ErrorTypes.NOT_FOUND("Client");
        }
        // Update client profile
        const updatedClient = await prisma.user.update({
            where: { id: clientId },
            data: {
                ...(name && { name }),
                ...(bio !== undefined && { bio }),
                ...(website !== undefined && { website }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(country !== undefined && { country }),
                ...(state !== undefined && { state }),
                ...(city !== undefined && { city }),
                ...(zip !== undefined && { zip }),
                ...(latitude !== undefined && { latitude }),
                ...(longitude !== undefined && { longitude })
            },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatar: true,
                website: true,
                phone: true,
                address: true,
                country: true,
                state: true,
                city: true,
                zip: true,
                latitude: true,
                longitude: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                updatedAt: true
            }
        });
        sendSuccess(res, "Client profile updated successfully", updatedClient);
    }
    catch (error) {
        handleError(error, res, "Failed to update client profile");
    }
};
// Get client contracts
export const getClientContracts = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { page = '1', limit = '10', status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Check if client exists
        const client = await prisma.user.findFirst({
            where: {
                id: clientId,
                isClient: true,
                isDeleted: false
            }
        });
        if (!client) {
            throw ErrorTypes.NOT_FOUND("Client");
        }
        // Build where clause for contracts
        const where = {
            clientId
        };
        if (status) {
            where.status = status;
        }
        // Build orderBy clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        const [contracts, total] = await Promise.all([
            prisma.contract.findMany({
                where,
                select: {
                    id: true,
                    type: true,
                    status: true,
                    totalFixedAmount: true,
                    startDate: true,
                    endDate: true,
                    createdAt: true,
                    updatedAt: true,
                    freelancer: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            freelancerProfile: {
                                select: {
                                    title: true,
                                    experienceLevel: true,
                                }
                            }
                        }
                    }
                },
                orderBy,
                skip,
                take: limitNum
            }),
            prisma.contract.count({ where })
        ]);
        const totalPages = Math.ceil(total / limitNum);
        sendSuccess(res, "Client contracts retrieved successfully", {
            contracts,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1
            }
        });
    }
    catch (error) {
        handleError(error, res, "Failed to get client contracts");
    }
};
// Get client statistics
export const getClientStats = async (req, res) => {
    try {
        const { clientId } = req.params;
        // Check if client exists
        const client = await prisma.user.findFirst({
            where: {
                id: clientId,
                isClient: true,
                isDeleted: false
            }
        });
        if (!client) {
            throw ErrorTypes.NOT_FOUND("Client");
        }
        // Get contract statistics
        const [totalContracts, activeContracts, completedContracts, totalSpent, averageContractValue] = await Promise.all([
            prisma.contract.count({
                where: { clientId }
            }),
            prisma.contract.count({
                where: {
                    clientId,
                    status: 'ACTIVE'
                }
            }),
            prisma.contract.count({
                where: {
                    clientId,
                    status: 'COMPLETED'
                }
            }),
            prisma.contract.aggregate({
                where: {
                    clientId,
                    status: 'COMPLETED'
                },
                _sum: {
                    totalFixedAmount: true
                }
            }),
            prisma.contract.aggregate({
                where: {
                    clientId,
                    status: 'COMPLETED'
                },
                _avg: {
                    totalFixedAmount: true
                }
            })
        ]);
        const stats = {
            totalContracts,
            activeContracts,
            completedContracts,
            totalSpent: totalSpent._sum?.totalFixedAmount || 0,
            averageContractValue: averageContractValue._avg?.totalFixedAmount || 0,
            successRate: totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0
        };
        sendSuccess(res, "Client statistics retrieved successfully", stats);
    }
    catch (error) {
        handleError(error, res, "Failed to get client statistics");
    }
};
// Delete client (soft delete)
export const deleteClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        // Check if client exists
        const client = await prisma.user.findFirst({
            where: {
                id: clientId,
                isClient: true,
                isDeleted: false
            }
        });
        if (!client) {
            throw ErrorTypes.NOT_FOUND("Client");
        }
        // Soft delete the client
        await prisma.user.update({
            where: { id: clientId },
            data: {
                isDeleted: true,
                isActive: false
            }
        });
        sendSuccess(res, "Client deleted successfully");
    }
    catch (error) {
        handleError(error, res, "Failed to delete client");
    }
};
// Reactivate client
export const reactivateClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        // Check if client exists
        const client = await prisma.user.findFirst({
            where: {
                id: clientId,
                isClient: true,
                isDeleted: true
            }
        });
        if (!client) {
            throw ErrorTypes.NOT_FOUND("Deleted client");
        }
        // Reactivate the client
        const reactivatedClient = await prisma.user.update({
            where: { id: clientId },
            data: {
                isDeleted: false,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                isDeleted: true,
                updatedAt: true
            }
        });
        sendSuccess(res, "Client reactivated successfully", reactivatedClient);
    }
    catch (error) {
        handleError(error, res, "Failed to reactivate client");
    }
};
//# sourceMappingURL=client.controllers.js.map