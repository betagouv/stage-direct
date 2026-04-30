import { execSync } from "node:child_process";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "~/generated/prisma/client";

const DATABASE_URL_TEST =
  process.env.DATABASE_URL_TEST ?? "postgresql://test:test@localhost:6001/stage_direct_test";

let testPrisma: PrismaClient | null = null;

export function getTestDb(): PrismaClient {
  if (!testPrisma) {
    const adapter = new PrismaPg({ connectionString: DATABASE_URL_TEST });
    testPrisma = new PrismaClient({ adapter });
  }
  return testPrisma;
}

export async function waitForDb(maxAttempts = 30) {
  const db = getTestDb();
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await db.$queryRawUnsafe("SELECT 1");
      return;
    } catch {
      if (i === maxAttempts - 1) throw new Error("Test database not reachable");
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

export function syncSchema() {
  const webRoot = path.resolve(import.meta.dirname, "../../..");
  execSync(`npx prisma db push --accept-data-loss --url=${DATABASE_URL_TEST}`, {
    cwd: webRoot,
    stdio: "inherit",
  });
}

export async function cleanTables() {
  const db = getTestDb();
  await db.$queryRawUnsafe(`
    TRUNCATE TABLE
      "relance",
      "evaluation",
      "evaluation_crf",
      "alerte",
      "stage",
      "auditeur",
      "mds",
      "dcs",
      "crf",
      "promotion",
      "circulaire",
      "session",
      "account",
      "verification",
      "user",
      "juridiction"
    RESTART IDENTITY CASCADE
  `);
}

export async function teardownTestDb() {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
}
