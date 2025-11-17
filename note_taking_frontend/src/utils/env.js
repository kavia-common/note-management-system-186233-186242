export function parseFeatureFlags() {
  try {
    const raw = process.env.REACT_APP_FEATURE_FLAGS || "{}";
    if (typeof raw === "string") {
      return JSON.parse(raw);
    }
    return raw || {};
  } catch (e) {
    console.warn("Failed to parse REACT_APP_FEATURE_FLAGS, defaulting to {}", e);
    return {};
  }
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the API base URL for the backend.
   * Order of precedence:
   * - REACT_APP_API_BASE
   * - REACT_APP_BACKEND_URL
   * - If neither provided and mock flag is not true, returns undefined
   */
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "";
  return base || undefined;
}
