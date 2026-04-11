/**
 * One-time migration: UserAndRoleRelation.roleId + UserRole.name → role (AppRole enum string).
 * Run BEFORE `prisma db push` on DBs that still have the old UserRole model and roleId field.
 * Usage: npx tsx scripts/migrate-user-roles-to-enum.ts
 *
 * Idempotent: skips documents that already have `role` and no `roleId`.
 */
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

/** Map legacy UserRole.name (any case) → Prisma AppRole string stored in MongoDB */
function legacyNameToAppRole(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (normalized === "admin") return "ADMIN";
  throw new Error(`Unknown UserRole.name "${name}" — add a mapping or extend AppRole in schema.prisma`);
}

async function main(): Promise<void> {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db();

  const relCol = db.collection("UserAndRoleRelation");
  const roleCol = db.collection("UserRole");

  const relations = await relCol.find({}).toArray();
  let updated = 0;
  let skipped = 0;

  for (const doc of relations) {
    const d = doc as Record<string, unknown> & { _id: ObjectId };
    if (d.roleId == null || d.roleId === undefined) {
      if (typeof d.role === "string" && d.role.length > 0) {
        skipped++;
        continue;
      }
      throw new Error(`UserAndRoleRelation ${d._id.toString()} has no roleId and no role`);
    }

    const roleId =
      d.roleId instanceof ObjectId ? d.roleId : new ObjectId(String(d.roleId));
    const roleDoc = await roleCol.findOne({ _id: roleId });
    if (!roleDoc || typeof roleDoc.name !== "string") {
      throw new Error(`UserRole not found for roleId ${roleId.toString()} (relation ${d._id.toString()})`);
    }
    const appRole = legacyNameToAppRole(roleDoc.name);
    await relCol.updateOne(
      { _id: d._id },
      { $set: { role: appRole }, $unset: { roleId: "" } }
    );
    updated++;
  }

  const all = await relCol.find({}).sort({ createdAt: 1 }).toArray();
  const seen = new Set<string>();
  let deduped = 0;
  for (const doc of all) {
    const d = doc as Record<string, unknown> & { _id: ObjectId; userId?: unknown; role?: unknown };
    const uid = d.userId instanceof ObjectId ? d.userId.toString() : String(d.userId);
    const role = String(d.role ?? "");
    const key = `${uid}:${role}`;
    if (seen.has(key)) {
      await relCol.deleteOne({ _id: d._id });
      deduped++;
      continue;
    }
    seen.add(key);
  }

  await roleCol.drop().catch(() => {
    /* collection may already be gone */
  });

  console.log(
    `Migration done: updated ${updated}, skipped (already migrated) ${skipped}, duplicates removed ${deduped}`
  );
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
