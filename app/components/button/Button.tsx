import type { HeroIcon } from "~/components/types";
import { Spinner } from "~/components";
import { cn } from "~/utils/utils";
import type { ButtonTypes } from "../types";

type buttonProps = {
  type?: ButtonTypes;
  text: string;
  name?: string;
  className?: string;
  onClick?: () => void;
  Icon?: HeroIcon;
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  form?: string;
};

const Button = ({
  type = "button",
  text,
  name,
  className,
  onClick,
  Icon,
  disabled,
  isLoading = false,
  fullWidth = false,
  form,
}: buttonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      name={name}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-200",
        "border-slate-200 bg-white/90 text-slate-700 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)]",
        "hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:text-slate-950",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        isLoading ? "justify-center" : "justify-between",
        fullWidth ? "w-full" : "w-auto",
        Icon ? "pr-3" : "",
        className,
      )}
      onClick={onClick}
      form={form}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <span>{text}</span>
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
