import { Outlet } from "react-router";
export { loader } from "~/hooks/useI18n";

export default function LocaleLayout() {
  return (
    <div className="min-h-screen">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
