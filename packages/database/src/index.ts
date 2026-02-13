type PrismaClientLike = {
  [key: string]: unknown;
};

type PrismaClientCtor = new (options?: { log?: string[] }) => PrismaClientLike;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientLike;
};

function getPrismaClientCtor(): PrismaClientCtor {
  const prismaClient = require("@prisma/client") as {
    PrismaClient?: PrismaClientCtor;
  };

  if (!prismaClient.PrismaClient) {
    throw new Error(
      "PrismaClient is unavailable. Run `pnpm --filter @repo/database run generate` first."
    );
  }

  return prismaClient.PrismaClient;
}

const PrismaClient = getPrismaClientCtor();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
