import React, { type ReactNode } from "react";

interface InputProps {
  children?: ReactNode; // Especifica que children puede ser de tipo ReactNode
  className?: string; // Clases adicionales del contenedor
  // Otras props como type, name, id, placeholder, required, minLength
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ children, className = "", ...rest }: InputProps) => {
  return (
    <div className={`relative ${className}`}>
      {children && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-900 pointer-events-none">
          {children}
        </div>
      )}
      <input
        className="block w-full bg-transparent border-b border-gray-200 py-2 px-3 text-sm placeholder-gray-400 outline-none text-gray-900 pl-8"
        {...rest}
      />
    </div>
  );
};

export default Input;
