/**
 * Validates if the provided icon name is a valid Lucide React icon
 * @param iconName - The icon name to validate
 * @returns boolean indicating if the icon is valid
 */
export declare const validateLucideIcon: (iconName: string) => boolean;
/**
 * Gets a list of recommended icons for a service category type
 * @param categoryType - The type of service category
 * @returns Array of recommended icon names
 */
export declare const getRecommendedIcons: (categoryType: string) => string[];
/**
 * Sanitizes and validates an icon name
 * @param iconName - The icon name to sanitize
 * @returns The sanitized icon name or null if invalid
 */
export declare const sanitizeIconName: (iconName: string) => string | null;
//# sourceMappingURL=icon-validator.d.ts.map