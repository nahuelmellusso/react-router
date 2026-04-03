import axios, { type Method } from "axios";
import { HttpError } from "~/helpers/HttpError";

export type QueryParams = string | URLSearchParams | string[][] | Record<string, string>;
export type ApiFetchProps = {
  method?: Method;
  url: string;
  queryParams?: QueryParams;
  headers?: Record<string, string>;
  data?: any;
  isFile?: boolean;
  beforeResponse?: () => void;
  onResponse?: () => void;
};

function getResolvedBaseURL() {
  const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configuredBaseURL || configuredBaseURL === "same-origin") {
    return "";
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

    if (!isLocalHost && configuredBaseURL.includes("localhost")) {
      return "";
    }
  }

  return configuredBaseURL.replace(/\/+$/, "");
}

function getApiRoot() {
  const baseURL = getResolvedBaseURL();

  if (!baseURL) {
    return "/api/v1";
  }

  if (baseURL.endsWith("/api/v1")) {
    return baseURL;
  }

  if (baseURL.endsWith("/api")) {
    return `${baseURL}/v1`;
  }

  return `${baseURL}/api/v1`;
}

export const apiFetch =
  ({
    method = "GET",
    url,
    queryParams,
    headers,
    data,
    isFile = false,
    beforeResponse,
    onResponse,
  }: ApiFetchProps) =>
  async () => {
    if (beforeResponse) {
      beforeResponse();
    }

    const apiRoot = getApiRoot();
    const normalizedUrl = url.replace(/^\/+/, "");
    const urlSearchParams = queryParams ? new URLSearchParams(queryParams) : null;
    const requestUrl = `${apiRoot}/${normalizedUrl}${queryParams ? `?${urlSearchParams}` : ""}`;

    try {
      const response = await axios({
        method,
        url: requestUrl,
        withCredentials: true,
        headers: {
          Accept: "application/json",
          ...(isFile
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
          ...headers,
        },
        data,
      });

      if (onResponse) {
        onResponse();
      }

      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? 500;
        const message = err.response?.data?.message ?? err.message ?? "Unexpected error";

        throw new HttpError(status, message);
      }

      throw new HttpError(500, "Unknown error");
    }
  };
