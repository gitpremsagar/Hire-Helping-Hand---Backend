import { SERVICE_CATEGORY_ICONS, isValidIcon } from '../constants/lucide-icons.js';
/**
 * Validates if the provided icon name is a valid Lucide React icon
 * @param iconName - The icon name to validate
 * @returns boolean indicating if the icon is valid
 */
export const validateLucideIcon = (iconName) => {
    return isValidIcon(iconName);
};
/**
 * Gets a list of recommended icons for a service category type
 * @param categoryType - The type of service category
 * @returns Array of recommended icon names
 */
export const getRecommendedIcons = (categoryType) => {
    const recommendations = {
        'technology': ['Code', 'Terminal', 'Monitor', 'Database', 'Cloud'],
        'design': ['Palette', 'PenTool', 'Brush', 'Image', 'Layers'],
        'writing': ['FileText', 'Type', 'BookOpen', 'Edit', 'Quote'],
        'marketing': ['Megaphone', 'TrendingUp', 'BarChart', 'Target', 'Users'],
        'business': ['Briefcase', 'Building', 'Users', 'Target', 'TrendingUp'],
        'education': ['GraduationCap', 'Book', 'Lightbulb', 'Calculator', 'Globe'],
        'health': ['Heart', 'Activity', 'Shield', 'Stethoscope', 'Zap'],
        'photography': ['Camera', 'Image', 'Eye', 'Crop', 'Filter'],
        'music': ['Music', 'Headphones', 'Microphone', 'Play', 'Pause'],
        'finance': ['DollarSign', 'CreditCard', 'Calculator', 'Scale', 'FileCheck'],
    };
    return recommendations[categoryType.toLowerCase()] || [];
};
/**
 * Sanitizes and validates an icon name
 * @param iconName - The icon name to sanitize
 * @returns The sanitized icon name or null if invalid
 */
export const sanitizeIconName = (iconName) => {
    if (!iconName || typeof iconName !== 'string') {
        return null;
    }
    // Remove any whitespace and convert to PascalCase
    const sanitized = iconName.trim().replace(/\s+/g, '');
    // Check if it's a valid Lucide icon
    if (isValidIcon(sanitized)) {
        return sanitized;
    }
    return null;
};
//# sourceMappingURL=icon-validator.js.map