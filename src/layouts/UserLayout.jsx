import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function UserLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingShares = async () => {
      try {
        const res = await api.get("shared-with-me/");

        const pending = res.data.filter(
          (share) => share.status === "PENDING",
        ).length;

        setPendingCount(pending);
      } catch (err) {
        console.error("Error fetching pending shares:", err);
      }
    };

    // Premier appel immédiat
    fetchPendingShares();

    // Auto refresh toutes les 5 secondes
    const interval = setInterval(() => {
      fetchPendingShares();
    }, 5000);

    // Nettoyage propre
    return () => clearInterval(interval);
  }, []);

  const menu = [
    { label: "Dashboard", path: "/dashboard/user" },
    { label: "My Files", path: "/dashboard/user/myFiles" },
    { label: "Activity", path: "/dashboard/user/activity" },
    {
      label: "Shared With Me",
      path: "/dashboard/user/shared",
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { label: "Favorites", path: "/dashboard/user/favorites" },
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar menu={menu} title="User Panel" />}
      role="User"
    />
  );
}

export default UserLayout;
