/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "https://mate.academy/students-api";

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json; charset=UTF-8",
    };
  }

  await wait(300);

  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    let message = `Request failed: ${response.status} ${response.statusText}`;

    try {
      const errorBody = await response.json();
      if (typeof errorBody === "string") message = errorBody;
      if (errorBody?.message) message = errorBody.message;
    } catch {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch {
        // ignore
      }
    }

    throw new Error(message);
  }
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, "POST", data),
  patch: <T>(url: string, data: any) => request<T>(url, "PATCH", data),
  delete: (url: string) => request<void>(url, "DELETE"),
};
