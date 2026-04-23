import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { sendResetPasswordEmail } from "./brevo";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: { type: "string", required: false, input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  plugins: [
    tanstackStartCookies(),
    genericOAuth({
      config: [
        {
          providerId: "proconnect",
          clientId: process.env.PROCONNECT_CLIENT_ID ?? "",
          clientSecret: process.env.PROCONNECT_CLIENT_SECRET ?? "",
          discoveryUrl: process.env.PROCONNECT_DISCOVERY_URL ?? "",
          scopes: ["openid", "email", "given_name", "usual_name"],
          mapProfileToUser: (profile) => ({
            email: profile.email,
            name: `${profile.given_name ?? ""} ${profile.usual_name ?? ""}`.trim(),
            emailVerified: true,
          }),
        },
      ],
    }),
  ],
});
