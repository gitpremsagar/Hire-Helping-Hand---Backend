/**
 * One-time migration: UserAndRoleRelation.roleId + UserRole.name → role (AppRole enum string).
 * Run BEFORE `prisma db push` on DBs that still have the old UserRole model and roleId field.
 * Usage: npx tsx scripts/migrate-user-roles-to-enum.ts
 *
 * Idempotent: skips documents that already have `role` and no `roleId`.
 */
import "dotenv/config";
//# sourceMappingURL=migrate-user-roles-to-enum.d.ts.map