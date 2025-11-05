import { BaseConfig, defaultConfig } from "./config.base";
import { env } from "./config.env";

// TODO: replace placeholder API_URL and SIGNAL_R_URL with .env values at build time

export const Config: BaseConfig = {
  ...defaultConfig,
  API_URL: env.API_URL, // TODO: INSERT API URL HERE
  SIGNAL_R_URL: env.SIGNAL_R_URL, // TODO: INSERT SIGNALR URL HERE
  TIMEOUT: env.TIMEOUT,
};
