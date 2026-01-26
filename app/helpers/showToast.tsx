import toast from "react-hot-toast";

export type AppToastType = "success" | "error" | "info" | "loading";

export type AppToastProps = {
  type: AppToastType;
  message: string;
  description?: string;
};

export function showToast({ type, message, description }: AppToastProps) {
  const content = description ? `${message} — ${description}` : message;

  switch (type) {
    case "success":
      toast.success(content);
      break;
    case "error":
      toast.error(content);
      break;
    case "loading":
      toast.loading(content);
      break;
    case "info":
    default:
      toast(content);
      break;
  }
}
