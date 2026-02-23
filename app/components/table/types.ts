export type ColumnBase<T> = {
  header: React.ReactNode;
  className?: string;
};

export type AccessorColumn<T> = ColumnBase<T> & {
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode; // opcional override
};

export type DisplayColumn<T> = ColumnBase<T> & {
  id: string; // ✅ for columns like "actions"
  cell: (row: T) => React.ReactNode;
  accessorKey?: never;
};

export type columnType<T> = AccessorColumn<T> | DisplayColumn<T>;
