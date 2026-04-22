import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanTables, syncSchema, teardownTestDb, waitForDb } from "./test-db";

beforeAll(async () => {
  await waitForDb();
  syncSchema();
});

afterEach(async () => {
  await cleanTables();
});

afterAll(async () => {
  await teardownTestDb();
});
