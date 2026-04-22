import { appRouter } from "~/server/router";
import { getTestDb } from "./test-db";

type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
  };
};

function makeSession(overrides: { id: string; email: string; name: string }): Session {
  const now = new Date();
  return {
    user: {
      id: overrides.id,
      email: overrides.email,
      name: overrides.name,
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    session: {
      id: `session-${overrides.id}`,
      token: `token-${overrides.id}`,
      expiresAt: new Date(Date.now() + 86400000),
      userId: overrides.id,
      createdAt: now,
      updatedAt: now,
      ipAddress: null,
      userAgent: null,
    },
  };
}

function createCaller(session: Session | null) {
  return appRouter.createCaller({
    prisma: getTestDb(),
    session,
  });
}

export const caller = createCaller(null);

export const dcsSession = makeSession({
  id: "dcs-test-id",
  email: "dcs.test@justice.fr",
  name: "DCS Test",
});
export const dcsCaller = createCaller(dcsSession);

export const crfSession = makeSession({
  id: "crf-test-id",
  email: "crf.test@justice.fr",
  name: "CRF Test",
});
export const crfCaller = createCaller(crfSession);

export const adjSession = makeSession({
  id: "adj-test-id",
  email: "adj.test@enm.justice.fr",
  name: "ADJ Test",
});
export const adjCaller = createCaller(adjSession);

export const adminSession = makeSession({
  id: "admin-test-id",
  email: "admin@stage-direct.beta.gouv.fr",
  name: "Admin Test",
});
export const adminCaller = createCaller(adminSession);
