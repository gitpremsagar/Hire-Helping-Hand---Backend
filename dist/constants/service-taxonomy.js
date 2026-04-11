/**
 * Canonical service category / subcategory taxonomy (code-defined).
 * Matches Prisma enums `ServiceCategory` and `ServiceSubCategory` in schema.prisma.
 * Update enums and this file together.
 */
import { ServiceCategory as ServiceCategoryEnum, ServiceSubCategory as ServiceSubCategoryEnum, } from "@prisma/client";
export { ServiceCategoryEnum, ServiceSubCategoryEnum };
export const SERVICE_SUBCATEGORY_TO_CATEGORY = {
    // Programming & Tech
    WEB_DEVELOPMENT: "PROGRAMMING_AND_TECH",
    MOBILE_DEVELOPMENT: "PROGRAMMING_AND_TECH",
    DESKTOP_SOFTWARE: "PROGRAMMING_AND_TECH",
    DEVOPS_CLOUD: "PROGRAMMING_AND_TECH",
    QA_TESTING: "PROGRAMMING_AND_TECH",
    GAME_DEVELOPMENT: "PROGRAMMING_AND_TECH",
    // Design & Creative
    GRAPHIC_DESIGN: "DESIGN_AND_CREATIVE",
    UI_UX_DESIGN: "DESIGN_AND_CREATIVE",
    LOGO_BRANDING: "DESIGN_AND_CREATIVE",
    ILLUSTRATION: "DESIGN_AND_CREATIVE",
    PHOTOGRAPHY_EDITING: "DESIGN_AND_CREATIVE",
    // Digital Marketing
    SEO_SEM: "DIGITAL_MARKETING",
    SOCIAL_MEDIA_MARKETING: "DIGITAL_MARKETING",
    CONTENT_MARKETING: "DIGITAL_MARKETING",
    EMAIL_MARKETING: "DIGITAL_MARKETING",
    // Writing & Translation
    CONTENT_WRITING: "WRITING_AND_TRANSLATION",
    TECHNICAL_WRITING: "WRITING_AND_TRANSLATION",
    TRANSLATION: "WRITING_AND_TRANSLATION",
    PROOFREADING: "WRITING_AND_TRANSLATION",
    // Video & Animation
    VIDEO_EDITING: "VIDEO_AND_ANIMATION",
    MOTION_GRAPHICS: "VIDEO_AND_ANIMATION",
    ANIMATION_2D_3D: "VIDEO_AND_ANIMATION",
    // Music & Audio
    AUDIO_PRODUCTION: "MUSIC_AND_AUDIO",
    VOICE_OVER: "MUSIC_AND_AUDIO",
    MUSIC_COMPOSITION: "MUSIC_AND_AUDIO",
    // Business Support
    VIRTUAL_ASSISTANT: "BUSINESS_SUPPORT",
    PROJECT_MANAGEMENT: "BUSINESS_SUPPORT",
    DATA_ENTRY: "BUSINESS_SUPPORT",
    // Data & AI
    DATA_ANALYSIS: "DATA_AND_AI",
    MACHINE_LEARNING: "DATA_AND_AI",
    DATA_ENGINEERING: "DATA_AND_AI",
    DATA_VISUALIZATION: "DATA_AND_AI",
    // Legal & Finance
    LEGAL_CONSULTING: "LEGAL_AND_FINANCE",
    ACCOUNTING_BOOKKEEPING: "LEGAL_AND_FINANCE",
    FINANCIAL_MODELING: "LEGAL_AND_FINANCE",
    // Education & Training
    ONLINE_TUTORING: "EDUCATION_AND_TRAINING",
    COURSE_CREATION: "EDUCATION_AND_TRAINING",
    CORPORATE_TRAINING: "EDUCATION_AND_TRAINING",
};
const CAT = ServiceCategoryEnum;
const SUB = ServiceSubCategoryEnum;
export const SERVICE_CATEGORY_ORDER = [
    CAT.PROGRAMMING_AND_TECH,
    CAT.DESIGN_AND_CREATIVE,
    CAT.DIGITAL_MARKETING,
    CAT.WRITING_AND_TRANSLATION,
    CAT.VIDEO_AND_ANIMATION,
    CAT.MUSIC_AND_AUDIO,
    CAT.BUSINESS_SUPPORT,
    CAT.DATA_AND_AI,
    CAT.LEGAL_AND_FINANCE,
    CAT.EDUCATION_AND_TRAINING,
];
export const SERVICE_CATEGORY_METADATA = {
    PROGRAMMING_AND_TECH: {
        name: "Programming & Tech",
        description: "Software, apps, infrastructure, and quality engineering.",
        slug: "programming-and-tech",
        orderNumber: 0,
        icon: "Code",
        isNew: false,
    },
    DESIGN_AND_CREATIVE: {
        name: "Design & Creative",
        description: "Visual design, branding, and creative production.",
        slug: "design-and-creative",
        orderNumber: 1,
        icon: "Palette",
        isNew: false,
    },
    DIGITAL_MARKETING: {
        name: "Digital Marketing",
        description: "SEO, social, content distribution, and growth.",
        slug: "digital-marketing",
        orderNumber: 2,
        icon: "Megaphone",
        isNew: false,
    },
    WRITING_AND_TRANSLATION: {
        name: "Writing & Translation",
        description: "Copy, technical writing, localization, and editing.",
        slug: "writing-and-translation",
        orderNumber: 3,
        icon: "FileText",
        isNew: false,
    },
    VIDEO_AND_ANIMATION: {
        name: "Video & Animation",
        description: "Editing, motion design, and animation.",
        slug: "video-and-animation",
        orderNumber: 4,
        icon: "Video",
        isNew: false,
    },
    MUSIC_AND_AUDIO: {
        name: "Music & Audio",
        description: "Production, voice, and composition.",
        slug: "music-and-audio",
        orderNumber: 5,
        icon: "Music",
        isNew: false,
    },
    BUSINESS_SUPPORT: {
        name: "Business Support",
        description: "Operations, admin, and coordination.",
        slug: "business-support",
        orderNumber: 6,
        icon: "Briefcase",
        isNew: false,
    },
    DATA_AND_AI: {
        name: "Data & AI",
        description: "Analytics, ML, and data pipelines.",
        slug: "data-and-ai",
        orderNumber: 7,
        icon: "BarChart",
        isNew: true,
    },
    LEGAL_AND_FINANCE: {
        name: "Legal & Finance",
        description: "Legal, accounting, and financial services.",
        slug: "legal-and-finance",
        orderNumber: 8,
        icon: "Scale",
        isNew: false,
    },
    EDUCATION_AND_TRAINING: {
        name: "Education & Training",
        description: "Teaching, curriculum, and L&D.",
        slug: "education-and-training",
        orderNumber: 9,
        icon: "GraduationCap",
        isNew: false,
    },
};
export const SERVICE_SUBCATEGORY_METADATA = {
    WEB_DEVELOPMENT: {
        ...SERVICE_CATEGORY_METADATA.PROGRAMMING_AND_TECH,
        name: "Web Development",
        description: "Websites, web apps, and APIs.",
        slug: "web-development",
        orderNumber: 0,
        serviceCategoryId: CAT.PROGRAMMING_AND_TECH,
        icon: "Monitor",
        isNew: false,
    },
    MOBILE_DEVELOPMENT: {
        ...SERVICE_CATEGORY_METADATA.PROGRAMMING_AND_TECH,
        name: "Mobile Development",
        description: "iOS, Android, and cross-platform apps.",
        slug: "mobile-development",
        orderNumber: 1,
        serviceCategoryId: CAT.PROGRAMMING_AND_TECH,
        icon: "Smartphone",
        isNew: false,
    },
    DESKTOP_SOFTWARE: {
        ...SERVICE_CATEGORY_METADATA.PROGRAMMING_AND_TECH,
        name: "Desktop Software",
        description: "Native desktop applications.",
        slug: "desktop-software",
        orderNumber: 2,
        serviceCategoryId: CAT.PROGRAMMING_AND_TECH,
        icon: "Monitor",
        isNew: false,
    },
    DEVOPS_CLOUD: {
        ...SERVICE_CATEGORY_METADATA.PROGRAMMING_AND_TECH,
        name: "DevOps & Cloud",
        description: "CI/CD, cloud infrastructure, and SRE.",
        slug: "devops-cloud",
        orderNumber: 3,
        serviceCategoryId: CAT.PROGRAMMING_AND_TECH,
        icon: "Cloud",
        isNew: false,
    },
    QA_TESTING: {
        ...SERVICE_CATEGORY_METADATA.PROGRAMMING_AND_TECH,
        name: "QA & Testing",
        description: "Manual and automated testing.",
        slug: "qa-testing",
        orderNumber: 4,
        serviceCategoryId: CAT.PROGRAMMING_AND_TECH,
        icon: "Wrench",
        isNew: false,
    },
    GAME_DEVELOPMENT: {
        ...SERVICE_CATEGORY_METADATA.PROGRAMMING_AND_TECH,
        name: "Game Development",
        description: "Game design and engineering.",
        slug: "game-development",
        orderNumber: 5,
        serviceCategoryId: CAT.PROGRAMMING_AND_TECH,
        icon: "Play",
        isNew: false,
    },
    GRAPHIC_DESIGN: {
        ...SERVICE_CATEGORY_METADATA.DESIGN_AND_CREATIVE,
        name: "Graphic Design",
        description: "Visual assets and layouts.",
        slug: "graphic-design",
        orderNumber: 0,
        serviceCategoryId: CAT.DESIGN_AND_CREATIVE,
        icon: "Image",
        isNew: false,
    },
    UI_UX_DESIGN: {
        ...SERVICE_CATEGORY_METADATA.DESIGN_AND_CREATIVE,
        name: "UI/UX Design",
        description: "Product and interface design.",
        slug: "ui-ux-design",
        orderNumber: 1,
        serviceCategoryId: CAT.DESIGN_AND_CREATIVE,
        icon: "Layers",
        isNew: false,
    },
    LOGO_BRANDING: {
        ...SERVICE_CATEGORY_METADATA.DESIGN_AND_CREATIVE,
        name: "Logo & Branding",
        description: "Identity and brand systems.",
        slug: "logo-branding",
        orderNumber: 2,
        serviceCategoryId: CAT.DESIGN_AND_CREATIVE,
        icon: "PenTool",
        isNew: false,
    },
    ILLUSTRATION: {
        ...SERVICE_CATEGORY_METADATA.DESIGN_AND_CREATIVE,
        name: "Illustration",
        description: "Custom illustration work.",
        slug: "illustration",
        orderNumber: 3,
        serviceCategoryId: CAT.DESIGN_AND_CREATIVE,
        icon: "Brush",
        isNew: false,
    },
    PHOTOGRAPHY_EDITING: {
        ...SERVICE_CATEGORY_METADATA.DESIGN_AND_CREATIVE,
        name: "Photography & Editing",
        description: "Photo shoots and retouching.",
        slug: "photography-editing",
        orderNumber: 4,
        serviceCategoryId: CAT.DESIGN_AND_CREATIVE,
        icon: "Camera",
        isNew: false,
    },
    SEO_SEM: {
        ...SERVICE_CATEGORY_METADATA.DIGITAL_MARKETING,
        name: "SEO & SEM",
        description: "Search optimization and paid search.",
        slug: "seo-sem",
        orderNumber: 0,
        serviceCategoryId: CAT.DIGITAL_MARKETING,
        icon: "TrendingUp",
        isNew: false,
    },
    SOCIAL_MEDIA_MARKETING: {
        ...SERVICE_CATEGORY_METADATA.DIGITAL_MARKETING,
        name: "Social Media Marketing",
        description: "Organic and paid social.",
        slug: "social-media-marketing",
        orderNumber: 1,
        serviceCategoryId: CAT.DIGITAL_MARKETING,
        icon: "Users",
        isNew: false,
    },
    CONTENT_MARKETING: {
        ...SERVICE_CATEGORY_METADATA.DIGITAL_MARKETING,
        name: "Content Marketing",
        description: "Strategy and distribution.",
        slug: "content-marketing",
        orderNumber: 2,
        serviceCategoryId: CAT.DIGITAL_MARKETING,
        icon: "FileText",
        isNew: false,
    },
    EMAIL_MARKETING: {
        ...SERVICE_CATEGORY_METADATA.DIGITAL_MARKETING,
        name: "Email Marketing",
        description: "Campaigns and automation.",
        slug: "email-marketing",
        orderNumber: 3,
        serviceCategoryId: CAT.DIGITAL_MARKETING,
        icon: "Mail",
        isNew: false,
    },
    CONTENT_WRITING: {
        ...SERVICE_CATEGORY_METADATA.WRITING_AND_TRANSLATION,
        name: "Content Writing",
        description: "Articles, blogs, and web copy.",
        slug: "content-writing",
        orderNumber: 0,
        serviceCategoryId: CAT.WRITING_AND_TRANSLATION,
        icon: "Edit",
        isNew: false,
    },
    TECHNICAL_WRITING: {
        ...SERVICE_CATEGORY_METADATA.WRITING_AND_TRANSLATION,
        name: "Technical Writing",
        description: "Docs, manuals, and specs.",
        slug: "technical-writing",
        orderNumber: 1,
        serviceCategoryId: CAT.WRITING_AND_TRANSLATION,
        icon: "BookOpen",
        isNew: false,
    },
    TRANSLATION: {
        ...SERVICE_CATEGORY_METADATA.WRITING_AND_TRANSLATION,
        name: "Translation",
        description: "Localization and translation.",
        slug: "translation",
        orderNumber: 2,
        serviceCategoryId: CAT.WRITING_AND_TRANSLATION,
        icon: "Languages",
        isNew: false,
    },
    PROOFREADING: {
        ...SERVICE_CATEGORY_METADATA.WRITING_AND_TRANSLATION,
        name: "Proofreading",
        description: "Editing and proofreading.",
        slug: "proofreading",
        orderNumber: 3,
        serviceCategoryId: CAT.WRITING_AND_TRANSLATION,
        icon: "FileCheck",
        isNew: false,
    },
    VIDEO_EDITING: {
        ...SERVICE_CATEGORY_METADATA.VIDEO_AND_ANIMATION,
        name: "Video Editing",
        description: "Post-production and editing.",
        slug: "video-editing",
        orderNumber: 0,
        serviceCategoryId: CAT.VIDEO_AND_ANIMATION,
        icon: "Video",
        isNew: false,
    },
    MOTION_GRAPHICS: {
        ...SERVICE_CATEGORY_METADATA.VIDEO_AND_ANIMATION,
        name: "Motion Graphics",
        description: "Motion design and compositing.",
        slug: "motion-graphics",
        orderNumber: 1,
        serviceCategoryId: CAT.VIDEO_AND_ANIMATION,
        icon: "Zap",
        isNew: false,
    },
    ANIMATION_2D_3D: {
        ...SERVICE_CATEGORY_METADATA.VIDEO_AND_ANIMATION,
        name: "2D & 3D Animation",
        description: "Character and explainer animation.",
        slug: "animation-2d-3d",
        orderNumber: 2,
        serviceCategoryId: CAT.VIDEO_AND_ANIMATION,
        icon: "Layers",
        isNew: false,
    },
    AUDIO_PRODUCTION: {
        ...SERVICE_CATEGORY_METADATA.MUSIC_AND_AUDIO,
        name: "Audio Production",
        description: "Mixing, mastering, and sound design.",
        slug: "audio-production",
        orderNumber: 0,
        serviceCategoryId: CAT.MUSIC_AND_AUDIO,
        icon: "Headphones",
        isNew: false,
    },
    VOICE_OVER: {
        ...SERVICE_CATEGORY_METADATA.MUSIC_AND_AUDIO,
        name: "Voice Over",
        description: "Voice recording and narration.",
        slug: "voice-over",
        orderNumber: 1,
        serviceCategoryId: CAT.MUSIC_AND_AUDIO,
        icon: "Mic",
        isNew: false,
    },
    MUSIC_COMPOSITION: {
        ...SERVICE_CATEGORY_METADATA.MUSIC_AND_AUDIO,
        name: "Music Composition",
        description: "Original music and scoring.",
        slug: "music-composition",
        orderNumber: 2,
        serviceCategoryId: CAT.MUSIC_AND_AUDIO,
        icon: "Music",
        isNew: false,
    },
    VIRTUAL_ASSISTANT: {
        ...SERVICE_CATEGORY_METADATA.BUSINESS_SUPPORT,
        name: "Virtual Assistant",
        description: "Administrative and executive support.",
        slug: "virtual-assistant",
        orderNumber: 0,
        serviceCategoryId: CAT.BUSINESS_SUPPORT,
        icon: "User",
        isNew: false,
    },
    PROJECT_MANAGEMENT: {
        ...SERVICE_CATEGORY_METADATA.BUSINESS_SUPPORT,
        name: "Project Management",
        description: "Planning and delivery.",
        slug: "project-management",
        orderNumber: 1,
        serviceCategoryId: CAT.BUSINESS_SUPPORT,
        icon: "Briefcase",
        isNew: false,
    },
    DATA_ENTRY: {
        ...SERVICE_CATEGORY_METADATA.BUSINESS_SUPPORT,
        name: "Data Entry",
        description: "Spreadsheets and CRM hygiene.",
        slug: "data-entry",
        orderNumber: 2,
        serviceCategoryId: CAT.BUSINESS_SUPPORT,
        icon: "BarChart",
        isNew: false,
    },
    DATA_ANALYSIS: {
        ...SERVICE_CATEGORY_METADATA.DATA_AND_AI,
        name: "Data Analysis",
        description: "Analytics, reporting, and insights.",
        slug: "data-analysis",
        orderNumber: 0,
        serviceCategoryId: CAT.DATA_AND_AI,
        icon: "TrendingUp",
        isNew: false,
    },
    MACHINE_LEARNING: {
        ...SERVICE_CATEGORY_METADATA.DATA_AND_AI,
        name: "Machine Learning",
        description: "ML modeling and deployment.",
        slug: "machine-learning",
        orderNumber: 1,
        serviceCategoryId: CAT.DATA_AND_AI,
        icon: "Lightbulb",
        isNew: true,
    },
    DATA_ENGINEERING: {
        ...SERVICE_CATEGORY_METADATA.DATA_AND_AI,
        name: "Data Engineering",
        description: "Pipelines, warehousing, and ETL.",
        slug: "data-engineering",
        orderNumber: 2,
        serviceCategoryId: CAT.DATA_AND_AI,
        icon: "Database",
        isNew: false,
    },
    DATA_VISUALIZATION: {
        ...SERVICE_CATEGORY_METADATA.DATA_AND_AI,
        name: "Data Visualization",
        description: "Dashboards and BI.",
        slug: "data-visualization",
        orderNumber: 3,
        serviceCategoryId: CAT.DATA_AND_AI,
        icon: "PieChart",
        isNew: false,
    },
    LEGAL_CONSULTING: {
        ...SERVICE_CATEGORY_METADATA.LEGAL_AND_FINANCE,
        name: "Legal Consulting",
        description: "Contracts and legal research.",
        slug: "legal-consulting",
        orderNumber: 0,
        serviceCategoryId: CAT.LEGAL_AND_FINANCE,
        icon: "Scale",
        isNew: false,
    },
    ACCOUNTING_BOOKKEEPING: {
        ...SERVICE_CATEGORY_METADATA.LEGAL_AND_FINANCE,
        name: "Accounting & Bookkeeping",
        description: "Books, payroll, and compliance.",
        slug: "accounting-bookkeeping",
        orderNumber: 1,
        serviceCategoryId: CAT.LEGAL_AND_FINANCE,
        icon: "Calculator",
        isNew: false,
    },
    FINANCIAL_MODELING: {
        ...SERVICE_CATEGORY_METADATA.LEGAL_AND_FINANCE,
        name: "Financial Modeling",
        description: "Forecasts and valuation.",
        slug: "financial-modeling",
        orderNumber: 2,
        serviceCategoryId: CAT.LEGAL_AND_FINANCE,
        icon: "DollarSign",
        isNew: false,
    },
    ONLINE_TUTORING: {
        ...SERVICE_CATEGORY_METADATA.EDUCATION_AND_TRAINING,
        name: "Online Tutoring",
        description: "1:1 and small-group tutoring.",
        slug: "online-tutoring",
        orderNumber: 0,
        serviceCategoryId: CAT.EDUCATION_AND_TRAINING,
        icon: "GraduationCap",
        isNew: false,
    },
    COURSE_CREATION: {
        ...SERVICE_CATEGORY_METADATA.EDUCATION_AND_TRAINING,
        name: "Course Creation",
        description: "Curriculum and e-learning content.",
        slug: "course-creation",
        orderNumber: 1,
        serviceCategoryId: CAT.EDUCATION_AND_TRAINING,
        icon: "Book",
        isNew: false,
    },
    CORPORATE_TRAINING: {
        ...SERVICE_CATEGORY_METADATA.EDUCATION_AND_TRAINING,
        name: "Corporate Training",
        description: "Workshops and enablement.",
        slug: "corporate-training",
        orderNumber: 2,
        serviceCategoryId: CAT.EDUCATION_AND_TRAINING,
        icon: "Monitor",
        isNew: false,
    },
};
export function isValidServiceCategory(value) {
    return Object.values(ServiceCategoryEnum).includes(value);
}
export function isValidServiceSubCategory(value) {
    return Object.values(ServiceSubCategoryEnum).includes(value);
}
export function categoryAndSubcategoryMatch(category, subcategory) {
    return SERVICE_SUBCATEGORY_TO_CATEGORY[subcategory] === category;
}
export function getSubcategoriesForCategory(category) {
    return Object.keys(SERVICE_SUBCATEGORY_TO_CATEGORY).filter((s) => SERVICE_SUBCATEGORY_TO_CATEGORY[s] === category);
}
export function subcategoriesOrderedForCategory(category) {
    return getSubcategoriesForCategory(category).sort((a, b) => SERVICE_SUBCATEGORY_METADATA[a].orderNumber - SERVICE_SUBCATEGORY_METADATA[b].orderNumber);
}
export function categorySummary(cat) {
    const m = SERVICE_CATEGORY_METADATA[cat];
    return {
        id: cat,
        name: m.name,
        description: m.description,
        slug: m.slug,
        icon: m.icon,
        orderNumber: m.orderNumber,
        isNew: m.isNew,
    };
}
export function subcategorySummary(sub) {
    const m = SERVICE_SUBCATEGORY_METADATA[sub];
    return {
        id: sub,
        name: m.name,
        description: m.description,
        slug: m.slug,
        icon: m.icon,
        orderNumber: m.orderNumber,
        isNew: m.isNew,
        serviceCategoryId: m.serviceCategoryId,
    };
}
/** API compatibility: legacy `*Id` keys + nested summaries (matches former Prisma relation shape). */
export function enrichCategoryFields(row) {
    return {
        ...row,
        serviceCategoryId: row.serviceCategory,
        serviceSubCategoryId: row.serviceSubCategory,
        ServiceCategory: categorySummary(row.serviceCategory),
        ServiceSubCategory: subcategorySummary(row.serviceSubCategory),
    };
}
const TAXONOMY_FIXED_DATETIME = "2024-01-01T00:00:00.000Z";
/** Full category row for GET /service-categories (shape aligned with former Prisma response). */
export function buildServiceCategoryApiRow(cat, counts) {
    const m = SERVICE_CATEGORY_METADATA[cat];
    const subs = subcategoriesOrderedForCategory(cat).map((sub) => {
        const sm = SERVICE_SUBCATEGORY_METADATA[sub];
        return {
            id: sub,
            name: sm.name,
            description: sm.description,
            slug: sm.slug,
            orderNumber: sm.orderNumber,
            isNew: sm.isNew,
            icon: sm.icon,
            serviceCategoryId: cat,
            createdAt: TAXONOMY_FIXED_DATETIME,
            updatedAt: TAXONOMY_FIXED_DATETIME,
        };
    });
    return {
        id: cat,
        name: m.name,
        description: m.description,
        icon: m.icon,
        slug: m.slug,
        orderNumber: m.orderNumber,
        isNew: m.isNew,
        createdAt: TAXONOMY_FIXED_DATETIME,
        updatedAt: TAXONOMY_FIXED_DATETIME,
        ServiceSubCategory: subs,
        _count: {
            ServiceSubCategory: subs.length,
            FreelancingService: counts.freelancing,
            Job: counts.jobs,
        },
    };
}
export function findCategoryBySlug(slug) {
    return SERVICE_CATEGORY_ORDER.find((c) => SERVICE_CATEGORY_METADATA[c].slug.toLowerCase() === slug.toLowerCase());
}
export function findSubcategoryBySlug(slug) {
    return Object.keys(SERVICE_SUBCATEGORY_METADATA).find((s) => SERVICE_SUBCATEGORY_METADATA[s].slug.toLowerCase() === slug.toLowerCase());
}
//# sourceMappingURL=service-taxonomy.js.map