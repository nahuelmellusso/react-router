import axios, { type Method } from "axios";

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
    } catch (error) {
      console.log("Error fetching data: ", error);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error?.response?.status === 401) {
        window.location.href = "/logout";
      }

      throw error;
    }
  };
