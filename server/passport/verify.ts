import { Profile } from "passport";
import prisma from "../../database/prisma";

export default async function verify(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (error: any, user?: any, info?: any) => void
) {
  {
    try {
      if (!profile.emails) return done(new Error("Email not found"));

      const user = await prisma.user.findUnique({
        where: { email: profile.emails![0].value },
      });

      if (user) {
        const account = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              providerAccountId: profile.id,
              provider: profile.provider,
            },
            userId: user.id,
          },
        });

        if (!account) {
          await prisma.account.create({
            data: {
              providerAccountId: profile.id,
              provider: profile.provider,
              userId: user.id,
            },
          });
        }

        done(null, {
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
        });
      } else {
        const user = await prisma.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails![0].value,
              avatar: profile.photos?.[0].value,
            },
          });

          await tx.account.create({
            data: {
              providerAccountId: profile.id,
              provider: profile.provider,
              userId: newUser.id,
            },
          });

          return newUser;
        });

        done(null, {
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
        });
      }
    } catch (error) {
      done(error);
    }
  }
}
