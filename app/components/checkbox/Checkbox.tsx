type CheckboxProps = {
  name?: string;
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        className={`flex items-center gap-2 cursor-pointer select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 rounded border-gray-300 text-violet-700 focus:ring-violet-600 ${className}`}
        />

        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Checkbox;
