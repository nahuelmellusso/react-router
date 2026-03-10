export function getApiErrorMessage(err: unknown, fallback: string) {
  let msg = fallback;

  if (axios.isAxiosError(err)) {
    const dataMsg = err.response?.data?.message;

    if (Array.isArray(dataMsg)) {
      msg = dataMsg.join(", ");
    } else if (typeof dataMsg === "string") {
      msg = dataMsg;
    }
  }

  return msg;
}
