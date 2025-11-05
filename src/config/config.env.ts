import Constants from "expo-constants";
import { z } from "zod";

// TODO: add any new .env keys here
// NOTE: Do not hardcode values — read from .env

const envSchema = z.object({
  API_URL: z.string().url(),
  SIGNAL_R_URL: z.string().url(),
  TIMEOUT: z.string().transform(Number).optional().default("60000"),
});

const rawEnv = {
  API_URL: Constants.expoConfig?.extra?.API_URL || process.env.API_URL,
  SIGNAL_R_URL:
    Constants.expoConfig?.extra?.SIGNAL_R_URL || process.env.SIGNAL_R_URL,
  TIMEOUT: Constants.expoConfig?.extra?.TIMEOUT || process.env.TIMEOUT,
};

export const env = envSchema.parse(rawEnv);
