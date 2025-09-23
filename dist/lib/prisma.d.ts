import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const disconnectPrisma: () => Promise<void>;
export declare const withTransaction: <T>(callback: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">) => Promise<T>) => Promise<T>;
export declare const checkDatabaseConnection: () => Promise<boolean>;
//# sourceMappingURL=prisma.d.ts.map