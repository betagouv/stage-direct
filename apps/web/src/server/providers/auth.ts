import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { sendEmail } from "./brevo";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    tanstackStartCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: [{ email }],
          subject: "Votre lien de connexion Stage Direct",
          htmlContent: `
            <p>Bonjour,</p>
            <p>Cliquez sur le lien ci-dessous pour vous connecter a Stage Direct :</p>
            <p><a href="${url}">Se connecter</a></p>
            <p>Ce lien est valable 10 minutes.</p>
            <p>L'equipe Stage Direct</p>
          `,
        });
      },
    }),
  ],
});
