import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import "./helpers/setup-integration";
import { adjCaller, caller, dcsCaller } from "./helpers/test-caller";

describe("auth guards (tRPC)", () => {
  describe("session absente", () => {
    it("user.list throws UNAUTHORIZED", async () => {
      await expect(caller.user.list()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("auditeur.list throws UNAUTHORIZED", async () => {
      await expect(caller.auditeur.list({ dcsId: "any-id" })).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("dashboard.stats throws UNAUTHORIZED", async () => {
      await expect(caller.dashboard.stats({ dcsId: "any-id" })).rejects.toBeInstanceOf(TRPCError);
    });
  });

  describe("session presente mais role insuffisant", () => {
    it("ADJ ne peut pas creer un auditeur (DCS-only)", async () => {
      await expect(
        adjCaller.auditeur.create({
          nom: "Test",
          prenom: "Test",
          email: "test@justice.fr",
          type: "ADJ",
          promotionId: "any-id",
        }),
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("session DCS valide", () => {
    it("user.list ne throw pas UNAUTHORIZED (auth ok)", async () => {
      await expect(dcsCaller.user.list()).resolves.toBeDefined();
    });
  });
});
