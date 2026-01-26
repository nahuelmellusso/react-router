// FormError.tsx
type FormErrorProps = {
  error?: { message?: string };
};

const FormError = ({ error }: FormErrorProps) => {
  if (!error?.message) return null;

  return <p className="mt-1 text-xs text-red-500">{error.message}</p>;
};

export default FormError;
