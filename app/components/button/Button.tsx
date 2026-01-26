import type { HeroIcon } from "~/components/types";
import { Spinner } from "~/components";

type buttonProps = {
  type?: any;
  text: string;
  name?: string;
  className?: string;
  onClick?: () => void;
  Icon?: HeroIcon;
  disabled?: boolean;
  isLoading?: boolean;
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
}: buttonProps) => {
  const baseClasses = `flex items-center px-2 py-1 bg-white border-violet-800 border-2 text-gray-900 text-xs rounded-full w-full ${isLoading ? "justify-center" : "justify-between"} cursor-pointer`;
  return (
    <div className="flex items-center justify-center mt-4">
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
            {Icon && <Icon />}
          </>
        )}
      </button>
    </div>
  );
};

export default Button;
