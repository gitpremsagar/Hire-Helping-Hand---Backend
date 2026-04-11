import { z } from "zod";
import { ServiceCategory, ServiceSubCategory } from "@prisma/client";
import { categoryAndSubcategoryMatch } from "./service-taxonomy.js";

export const serviceCategoryIdField = z.nativeEnum(ServiceCategory);
export const serviceSubCategoryIdField = z.nativeEnum(ServiceSubCategory);

/** When both category fields are present, ensure the pair is valid (covers create and partial updates). */
export function refineCategoryPair<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((data: unknown, ctx) => {
    const d = data as Record<string, unknown>;
    const cat = d.serviceCategoryId;
    const sub = d.serviceSubCategoryId;
    if (cat === undefined || sub === undefined) {
      return;
    }
    if (
      typeof cat === "string" &&
      typeof sub === "string" &&
      !categoryAndSubcategoryMatch(cat as ServiceCategory, sub as ServiceSubCategory)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Service subcategory must belong to the selected service category",
        path: ["serviceSubCategoryId"],
      });
    }
  });
}
