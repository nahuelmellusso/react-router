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

    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const urlSearchParams = queryParams ? new URLSearchParams(queryParams) : null;

    try {
      const response = await axios({
        method,
        url: `${baseURL}/${url}${queryParams ? `?${urlSearchParams}` : ""}`,
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
