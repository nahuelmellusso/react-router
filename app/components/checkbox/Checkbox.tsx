import type { ChangeEvent } from "react";

type CheckboxProps = {
  name?: string;
  label?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
};

const Checkbox = ({
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  error,
}: CheckboxProps) => {
  const id = name ?? "checkbox";

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={`flex cursor-pointer select-none items-center gap-2 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/30 ${className}`}
        />

        {label && <span className="text-sm text-slate-700">{label}</span>}
      </label>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Checkbox;
