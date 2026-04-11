import { z } from "zod";
import { ServiceCategory, ServiceSubCategory } from "@prisma/client";
import { categoryAndSubcategoryMatch } from "./service-taxonomy.js";
export const serviceCategoryIdField = z.nativeEnum(ServiceCategory);
export const serviceSubCategoryIdField = z.nativeEnum(ServiceSubCategory);
/** When both category fields are present, ensure the pair is valid (covers create and partial updates). */
export function refineCategoryPair(schema) {
    return schema.superRefine((data, ctx) => {
        const d = data;
        const cat = d.serviceCategoryId;
        const sub = d.serviceSubCategoryId;
        if (cat === undefined || sub === undefined) {
            return;
        }
        if (typeof cat === "string" &&
            typeof sub === "string" &&
            !categoryAndSubcategoryMatch(cat, sub)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Service subcategory must belong to the selected service category",
                path: ["serviceSubCategoryId"],
            });
        }
    });
}
//# sourceMappingURL=taxonomy-zod.js.map