import "server-only";

import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { updateTag } from "next/cache";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const betterAuthUrl = process.env.BETTER_AUTH_URL;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to .env so BetterAuth can store readers.",
  );
}

if (!betterAuthUrl) {
  throw new Error(
    "BETTER_AUTH_URL is not set. Add it to .env so API JWTs have a stable issuer.",
  );
}

const databaseName = process.env.MONGODB_DB ?? "booknook";

// Reuse the Mongo client across hot reloads in development instead of opening a
// new connection on every module evaluation.
const globalForMongo = globalThis as unknown as {
  booknookMongoClient?: MongoClient;
};

const mongoClient = globalForMongo.booknookMongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.booknookMongoClient = mongoClient;
}

const db = mongoClient.db(databaseName);

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
export const googleAuthConfigured = Boolean(
  googleClientId && googleClientSecret,
);

// The books and borrows created before BetterAuth was wired up were stamped
// with the demo reader. The first real account claims them so the existing
// shelf is not orphaned. Later accounts start with a clean shelf.
const LEGACY_DEMO_EMAIL = "tahsin@booknook.demo";

async function claimLegacyDemoData(user: {
  name: string;
  email: string;
}): Promise<void> {
  const email = user.email.trim().toLowerCase();

  if (!email || email === LEGACY_DEMO_EMAIL) {
    return;
  }

  try {
    const userCount = await db.collection("user").countDocuments();

    if (userCount > 1) {
      return;
    }

    const books = await db.collection("books").updateMany(
      { "addedBy.email": LEGACY_DEMO_EMAIL },
      { $set: { "addedBy.name": user.name, "addedBy.email": email } },
    );
    const borrows = await db.collection("borrows").updateMany(
      { email: LEGACY_DEMO_EMAIL },
      { $set: { email, name: user.name } },
    );

    if (books.modifiedCount > 0 || borrows.modifiedCount > 0) {
      console.log(
        `[booknook] Claimed ${books.modifiedCount} legacy book(s) and ${borrows.modifiedCount} loan(s) for ${email}.`,
      );
    }

    // The catalogue and loan caches may have been filled before the migration.
    updateTag("books");
    updateTag("borrows");
  } catch (error) {
    // Never block account creation because the legacy claim failed.
    console.error("[booknook] Could not claim the legacy demo shelf.", error);
  }
}

export const auth = betterAuth({
  baseURL: betterAuthUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // The registration form asks for 6 characters; BetterAuth defaults to 8.
    minPasswordLength: 6,
    // Registration should land on the Login page, not sign the reader in.
    autoSignIn: false,
  },
  session: {
    // Keep a short-lived signed copy of the session in the cookie so every
    // server render does not round-trip to MongoDB just to read the reader.
    // Five minutes matches BetterAuth's default and keeps profile edits and
    // sign-out responsive enough for this app.
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: { alg: "EdDSA" },
      },
      jwt: {
        audience: process.env.JWT_AUDIENCE ?? "booknook-api",
        expirationTime: "10m",
        issuer: betterAuthUrl,
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
      },
      disableSettingJwtHeader: true,
    }),
    nextCookies(),
  ],
  user: {
    additionalFields: {
      location: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      favoriteCategory: {
        type: "string",
        required: false,
        defaultValue: "Fiction",
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const body = ctx.body as { password?: unknown } | undefined;
      const password = typeof body?.password === "string" ? body.password : "";

      if (password.length < 6) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must be at least 6 characters long.",
        });
      }

      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one uppercase letter.",
        });
      }

      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one lowercase letter.",
        });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await claimLegacyDemoData({
            name: user.name,
            email: user.email,
          });
        },
      },
    },
  },
});

export const authDatabase = db;
