// TODO: adjust default environment if needed
// This file merges runtime env with static defaults.

export interface BaseConfig {
  env: string;
  API_URL: string;
  SIGNAL_R_URL: string;
  TIMEOUT: number;
}

export const defaultConfig: BaseConfig = {
  env: "INT", // TODO: adjust default environment if needed
  API_URL: "https://e-voucher-merchant.zaho.ly:6443/",
  SIGNAL_R_URL: "https://e-voucher-merchant.zaho.ly:6443/balanceHub",
  TIMEOUT: 60000,
};
