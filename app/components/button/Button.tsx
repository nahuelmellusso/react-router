import type { HeroIcon } from "~/components/types";
import { Spinner } from "~/components";
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
}: buttonProps) => {
  const baseClasses = ` ${fullWidth ? "w-full" : "w-auto"} inline-flex items-center px-2 py-1 bg-white border-violet-800 border-2 text-gray-900 text-xs rounded-full  ${isLoading ? "justify-center" : "justify-between"} cursor-pointer  whitespace-nowrap`;
  return (
    <button
      type={type}
      disabled={disabled}
      name={name}
      className={`${baseClasses} ${className ?? ""}`}
      onClick={onClick}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {text}
          {Icon && <Icon className="w-4 h-4 ml-2 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
