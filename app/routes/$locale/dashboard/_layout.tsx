import { Outlet } from "react-router-dom";
import styles from "~/routes/$locale/dashboard/Dashboard.module.css";
import { Navbar } from "~/components/navbar/NavBar";

export default function DashboardLayout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.layout}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
