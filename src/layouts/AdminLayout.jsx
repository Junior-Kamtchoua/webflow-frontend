import DashboardLayout from "./DashboardLayout";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  const menu = [
    { label: "Overview", path: "/dashboard/admin" },
    { label: "Users Management", path: "/dashboard/admin/users" },
    { label: "Roles & Permissions", path: "/dashboard/admin/roles" },
    { label: "Storage Control", path: "/dashboard/admin/storage" },
    { label: "System Logs", path: "/dashboard/admin/system-logs" },
    { label: "Platform Settings", path: "/dashboard/admin/settings" },
  ];
  return (
    <DashboardLayout
      sidebar={<Sidebar menu={menu} title="Admin Panel" />}
      role="Admin"
    />
  );
}

export default AdminLayout;
