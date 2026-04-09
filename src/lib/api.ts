const API_BASE = "http://localhost:8080";

/**
 * Standard headers for all API calls.
 * Since we now use HttpOnly cookies for auth, we no longer need the Authorization header.
 */
function defaultHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
  };
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: defaultHeaders(),
      credentials: "include", // send HttpOnly cookies
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      if (res.status === 401 && !path.includes("/auth/")) {
        window.location.href = "/auth";
      }
      const text = await res.text();
      let errorMsg = "Request failed";
      try {
        const data = JSON.parse(text);
        errorMsg = data.message || data.error || errorMsg;
      } catch {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.message !== "Request failed") {
      throw err;
    }
    console.error(`[API POST ERROR] ${path}:`, err);
    throw err;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: defaultHeaders(),
      credentials: "include", // send HttpOnly cookies
    });
    if (!res.ok) {
      if (res.status === 401 && !path.includes("/auth/")) {
        window.location.href = "/auth";
      }
      const text = await res.text();
      let errorMsg = "Request failed";
      try {
        const data = JSON.parse(text);
        errorMsg = data.message || data.error || errorMsg;
      } catch {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.message !== "Request failed") {
      throw err;
    }
    console.error(`[API GET ERROR] ${path}:`, err);
    throw err;
  }
}
