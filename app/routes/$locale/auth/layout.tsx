import { Outlet } from "react-router-dom";
import styles from "~/routes/$locale/auth/Home.module.css";

export default function AuthLayout() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className={styles.backgroundContainer}>
        <Outlet />
      </div>
    </main>
  );
}
