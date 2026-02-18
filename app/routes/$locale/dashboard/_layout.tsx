import { Outlet } from "react-router-dom";
import styles from "~/routes/$locale/dashboard/Dashboard.module.css";
import { Navbar } from "~/components/navbar/NavBar";
export default function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <main className={`flex items-center justify-center min-h-screen ${styles.layout}`}>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
