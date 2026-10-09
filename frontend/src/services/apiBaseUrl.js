const DEFAULT_API_BASE_URL = "/balai/bbwssumatera8";

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const API_BASE_URL = configuredBaseUrl
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");
