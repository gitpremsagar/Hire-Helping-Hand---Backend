import "dotenv/config";
import type { Request, Response } from "express";
import { prisma, withTransaction } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";

// Get freelancer profile
export const getFreelancerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };

    const freelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
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
        country: true,
        state: true,
        city: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        freelancerProfile: {
          select: {
            title: true,
            overview: true,
            experienceLevel: true,
          }
        },
        portfolioItems: {
          select: {
            id: true,
            title: true,
            description: true,
            mediaUrls: true,
            projectUrl: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 6
        },
        employments: {
          select: {
            id: true,
            company: true,
            role: true,
            startDate: true,
            endDate: true,
            description: true,
          },
          orderBy: {
            startDate: 'desc'
          }
        },
        educations: {
          select: {
            id: true,
            school: true,
            degree: true,
            field: true,
            startDate: true,
            endDate: true,
          },
          orderBy: {
            startDate: 'desc'
          }
        },
        certifications: {
          select: {
            id: true,
            name: true,
            issuer: true,
            issuedAt: true,
            expiresAt: true,
            credentialId: true,
            credentialUrl: true,
          },
          orderBy: {
            issuedAt: 'desc'
          }
        },
        freelancingServices: {
          where: {
            isActive: true,
            status: 'APPROVED'
          },
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            basePrice: true,
            currency: true,
            deliveryTime: true,
            rating: true,
            ratingCount: true,
            orderCount: true,
            tags: true,
            gallery: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 6
        },
        UserSkillRelation: {
          select: {
            Skill: {
              select: {
                id: true,
                name: true,
                description: true,
              }
            }
          }
        }
      }
    });

    if (!freelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    sendSuccess(res, "Freelancer profile retrieved successfully", freelancer);
  } catch (error) {
    handleError(error, res, "Failed to get freelancer profile");
  }
};

// Create or update freelancer profile
export const createOrUpdateFreelancerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { title, overview, experienceLevel } = req.body;


    // Check if user exists and is a freelancer
    const user = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!user) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    const result = await withTransaction(async (tx) => {
      // Check if profile already exists
      const existingProfile = await tx.freelancerProfile.findFirst({
        where: { freelancerId }
      });

      let profile;
      if (existingProfile) {
        // Update existing profile
        profile = await tx.freelancerProfile.update({
          where: { freelancerId },
          data: {
            title,
            overview,
            experienceLevel,
          },
          select: {
            id: true,
            title: true,
            overview: true,
            experienceLevel: true,
            createdAt: true,
            updatedAt: true,
          }
        });
      } else {
        // Create new profile
        profile = await tx.freelancerProfile.create({
          data: {
            freelancerId,
            title,
            overview,
            experienceLevel,
          },
          select: {
            id: true,
            title: true,
            overview: true,
            experienceLevel: true,
            createdAt: true,
            updatedAt: true,
          }
        });
      }

      return profile;
    });

    sendSuccess(res, "Freelancer profile updated successfully", result);
  } catch (error) {
    handleError(error, res, "Failed to create/update freelancer profile");
  }
};

// Get freelancer portfolio items
export const getFreelancerPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { page = 1, limit = 10 } = req.query;


    const skip = (Number(page) - 1) * Number(limit);

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        freelancerId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        mediaUrls: true,
        projectUrl: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });

    const total = await prisma.portfolioItem.count({
      where: {
        freelancerId,
      }
    });

    sendSuccess(res, "Portfolio items retrieved successfully", {
      portfolioItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    handleError(error, res, "Failed to get freelancer portfolio");
  }
};

// Add portfolio item
export const addPortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { title, description, mediaUrls, projectUrl, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if freelancer exists
    const freelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!freelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        freelancerId,
        title,
        description,
        mediaUrls,
        projectUrl,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        mediaUrls: true,
        projectUrl: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Portfolio item added successfully", portfolioItem, 201);
  } catch (error) {
    handleError(error, res, "Failed to add portfolio item");
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, portfolioItemId } = req.params as { freelancerId: string; portfolioItemId: string };
    const { title, description, mediaUrls, projectUrl, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if portfolio item exists and belongs to freelancer
    const existingItem = await prisma.portfolioItem.findFirst({
      where: {
        id: portfolioItemId,
        freelancerId,
      }
    });

    if (!existingItem) {
      throw ErrorTypes.NOT_FOUND("Portfolio item");
    }

    const portfolioItem = await prisma.portfolioItem.update({
      where: { id: portfolioItemId },
      data: {
        title,
        description,
        mediaUrls,
        projectUrl,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        mediaUrls: true,
        projectUrl: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Portfolio item updated successfully", portfolioItem);
  } catch (error) {
    handleError(error, res, "Failed to update portfolio item");
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, portfolioItemId } = req.params as { freelancerId: string; portfolioItemId: string };


    // Check if portfolio item exists and belongs to freelancer
    const existingItem = await prisma.portfolioItem.findFirst({
      where: {
        id: portfolioItemId,
        freelancerId,
      }
    });

    if (!existingItem) {
      throw ErrorTypes.NOT_FOUND("Portfolio item");
    }

    await prisma.portfolioItem.delete({
      where: { id: portfolioItemId }
    });

    sendSuccess(res, "Portfolio item deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete portfolio item");
  }
};

// Get freelancer employment history
export const getFreelancerEmployment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };


    const employments = await prisma.employment.findMany({
      where: {
        freelancerId,
      },
      select: {
        id: true,
        company: true,
        role: true,
        startDate: true,
        endDate: true,
        description: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    sendSuccess(res, "Employment history retrieved successfully", employments);
  } catch (error) {
    handleError(error, res, "Failed to get employment history");
  }
};

// Add employment
export const addEmployment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { company, role, startDate, endDate, description, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if freelancer exists
    const freelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!freelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    const employment = await prisma.employment.create({
      data: {
        freelancerId,
        company,
        role,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        company: true,
        role: true,
        startDate: true,
        endDate: true,
        description: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Employment added successfully", employment, 201);
  } catch (error) {
    handleError(error, res, "Failed to add employment");
  }
};

// Update employment
export const updateEmployment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, employmentId } = req.params as { freelancerId: string; employmentId: string };
    const { company, role, startDate, endDate, description, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if employment exists and belongs to freelancer
    const existingEmployment = await prisma.employment.findFirst({
      where: {
        id: employmentId,
        freelancerId,
      }
    });

    if (!existingEmployment) {
      throw ErrorTypes.NOT_FOUND("Employment");
    }

    const employment = await prisma.employment.update({
      where: { id: employmentId },
      data: {
        company,
        role,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        company: true,
        role: true,
        startDate: true,
        endDate: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Employment updated successfully", employment);
  } catch (error) {
    handleError(error, res, "Failed to update employment");
  }
};

// Delete employment
export const deleteEmployment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, employmentId } = req.params as { freelancerId: string; employmentId: string };


    // Check if employment exists and belongs to freelancer
    const existingEmployment = await prisma.employment.findFirst({
      where: {
        id: employmentId,
        freelancerId,
      }
    });

    if (!existingEmployment) {
      throw ErrorTypes.NOT_FOUND("Employment");
    }

    await prisma.employment.delete({
      where: { id: employmentId }
    });

    sendSuccess(res, "Employment deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete employment");
  }
};

// Get freelancer education
export const getFreelancerEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };


    const educations = await prisma.education.findMany({
      where: {
        freelancerId,
      },
      select: {
        id: true,
        school: true,
        degree: true,
        field: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    sendSuccess(res, "Education retrieved successfully", educations);
  } catch (error) {
    handleError(error, res, "Failed to get education");
  }
};

// Add education
export const addEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { school, degree, field, startDate, endDate, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if freelancer exists
    const freelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!freelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    const education = await prisma.education.create({
      data: {
        freelancerId,
        school,
        degree,
        field,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        school: true,
        degree: true,
        field: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Education added successfully", education, 201);
  } catch (error) {
    handleError(error, res, "Failed to add education");
  }
};

// Update education
export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, educationId } = req.params as { freelancerId: string; educationId: string };
    const { school, degree, field, startDate, endDate, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if education exists and belongs to freelancer
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: educationId,
        freelancerId,
      }
    });

    if (!existingEducation) {
      throw ErrorTypes.NOT_FOUND("Education");
    }

    const education = await prisma.education.update({
      where: { id: educationId },
      data: {
        school,
        degree,
        field,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        school: true,
        degree: true,
        field: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Education updated successfully", education);
  } catch (error) {
    handleError(error, res, "Failed to update education");
  }
};

// Delete education
export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, educationId } = req.params as { freelancerId: string; educationId: string };


    // Check if education exists and belongs to freelancer
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: educationId,
        freelancerId,
      }
    });

    if (!existingEducation) {
      throw ErrorTypes.NOT_FOUND("Education");
    }

    await prisma.education.delete({
      where: { id: educationId }
    });

    sendSuccess(res, "Education deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete education");
  }
};

// Get freelancer certifications
export const getFreelancerCertifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };


    const certifications = await prisma.certification.findMany({
      where: {
        freelancerId,
      },
      select: {
        id: true,
        name: true,
        issuer: true,
        issuedAt: true,
        expiresAt: true,
        credentialId: true,
        credentialUrl: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    });

    sendSuccess(res, "Certifications retrieved successfully", certifications);
  } catch (error) {
    handleError(error, res, "Failed to get certifications");
  }
};

// Add certification
export const addCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { name, issuer, issuedAt, expiresAt, credentialId, credentialUrl, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if freelancer exists
    const freelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!freelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    const certification = await prisma.certification.create({
      data: {
        freelancerId,
        name,
        issuer,
        issuedAt: issuedAt ? new Date(issuedAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        credentialId,
        credentialUrl,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        name: true,
        issuer: true,
        issuedAt: true,
        expiresAt: true,
        credentialId: true,
        credentialUrl: true,
        createdAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Certification added successfully", certification, 201);
  } catch (error) {
    handleError(error, res, "Failed to add certification");
  }
};

// Update certification
export const updateCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, certificationId } = req.params as { freelancerId: string; certificationId: string };
    const { name, issuer, issuedAt, expiresAt, credentialId, credentialUrl, serviceCategoryId, serviceSubCategoryId } = req.body;


    // Check if certification exists and belongs to freelancer
    const existingCertification = await prisma.certification.findFirst({
      where: {
        id: certificationId,
        freelancerId,
      }
    });

    if (!existingCertification) {
      throw ErrorTypes.NOT_FOUND("Certification");
    }

    const certification = await prisma.certification.update({
      where: { id: certificationId },
      data: {
        name,
        issuer,
        issuedAt: issuedAt ? new Date(issuedAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        credentialId,
        credentialUrl,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        name: true,
        issuer: true,
        issuedAt: true,
        expiresAt: true,
        credentialId: true,
        credentialUrl: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          }
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    sendSuccess(res, "Certification updated successfully", certification);
  } catch (error) {
    handleError(error, res, "Failed to update certification");
  }
};

// Delete certification
export const deleteCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId, certificationId } = req.params as { freelancerId: string; certificationId: string };


    // Check if certification exists and belongs to freelancer
    const existingCertification = await prisma.certification.findFirst({
      where: {
        id: certificationId,
        freelancerId,
      }
    });

    if (!existingCertification) {
      throw ErrorTypes.NOT_FOUND("Certification");
    }

    await prisma.certification.delete({
      where: { id: certificationId }
    });

    sendSuccess(res, "Certification deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete certification");
  }
};

// Get all freelancers
export const getFreelancers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 100, search, experienceLevel, country, skills } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {
      isFreelancer: true,
      isDeleted: false,
      isSuspended: false,
      isBlocked: false
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } },
        { freelancerProfile: { title: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    if (experienceLevel) {
      where.freelancerProfile = {
        ...where.freelancerProfile,
        experienceLevel: experienceLevel as string
      };
    }

    if (country) {
      where.country = country as string;
    }

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      where.UserSkillRelation = {
        some: {
          Skill: {
            name: { in: skillArray as string[] }
          }
        }
      };
    }

    const freelancers = await prisma.user.findMany({
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
        freelancerProfile: {
          select: {
            title: true,
            overview: true,
            experienceLevel: true,
          }
        },
        portfolioItems: {
          select: {
            id: true,
            title: true,
            mediaUrls: true,
          },
          take: 3,
          orderBy: {
            createdAt: 'desc'
          }
        },
        UserSkillRelation: {
          select: {
            Skill: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        freelancingServices: {
          where: {
            isActive: true,
            status: 'APPROVED'
          },
          select: {
            id: true,
            title: true,
            basePrice: true,
            currency: true,
            rating: true,
            ratingCount: true,
          },
          take: 3,
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });

    const total = await prisma.user.count({ where });

    sendSuccess(res, "Freelancers retrieved successfully", {
      freelancers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    handleError(error, res, "Failed to get freelancers");
  }
};

// Get single freelancer
export const getFreelancer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };

    const freelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
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
        country: true,
        state: true,
        city: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        freelancerProfile: {
          select: {
            title: true,
            overview: true,
            experienceLevel: true,
          }
        },
        UserSkillRelation: {
          select: {
            Skill: {
              select: {
                id: true,
                name: true,
                description: true,
              }
            }
          }
        }
      }
    });

    if (!freelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    sendSuccess(res, "Freelancer retrieved successfully", freelancer);
  } catch (error) {
    handleError(error, res, "Failed to get freelancer");
  }
};

// Create freelancer
export const createFreelancer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, bio, avatar, website, country, state, city } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        isDeleted: false
      }
    });

    if (existingUser) {
      throw ErrorTypes.CONFLICT("User with this email already exists");
    }

    const result = await withTransaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password, // Note: In production, hash this password
          bio,
          avatar,
          website,
          country,
          state,
          city,
          isFreelancer: true,
        },
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
          isFreelancer: true,
          createdAt: true,
        }
      });

      return user;
    });

    sendSuccess(res, "Freelancer created successfully", result, 201);
  } catch (error) {
    handleError(error, res, "Failed to create freelancer");
  }
};

// Update freelancer
export const updateFreelancer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };
    const { name, bio, avatar, website, country, state, city } = req.body;

    // Check if freelancer exists
    const existingFreelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!existingFreelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    const freelancer = await prisma.user.update({
      where: { id: freelancerId },
      data: {
        name,
        bio,
        avatar,
        website,
        country,
        state,
        city,
      },
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
        isFreelancer: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    sendSuccess(res, "Freelancer updated successfully", freelancer);
  } catch (error) {
    handleError(error, res, "Failed to update freelancer");
  }
};

// Delete freelancer
export const deleteFreelancer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { freelancerId } = req.params as { freelancerId: string };

    // Check if freelancer exists
    const existingFreelancer = await prisma.user.findFirst({
      where: { 
        id: freelancerId,
        isFreelancer: true,
        isDeleted: false
      }
    });

    if (!existingFreelancer) {
      throw ErrorTypes.NOT_FOUND("Freelancer");
    }

    // Soft delete - mark as deleted instead of hard delete
    await prisma.user.update({
      where: { id: freelancerId },
      data: {
        isDeleted: true,
        updatedAt: new Date()
      }
    });

    sendSuccess(res, "Freelancer deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete freelancer");
  }
};