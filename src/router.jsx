import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AuthProvider from "./context/AuthProvider";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import UserLayout from "./layouts/UserLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import AdminLayout from "./layouts/AdminLayout";

// USER PAGES
import MyFiles from "./pages/user/MyFiles";
import Activity from "./pages/user/Activity";
import Shared from "./pages/user/Shared";
import Favorites from "./pages/user/Favorites";

// MANAGER PAGES
import ManagerHome from "./pages/manager/ManagerHome";
import TeamOverview from "./pages/manager/TeamOverview";
import Projects from "./pages/manager/Projects";
import Reports from "./pages/manager/Reports";
import ActivityLogs from "./pages/manager/ActivityLogs";

// ADMIN PAGES
import AdminOverview from "./pages/admin/AdminOverview";
import UsersManagement from "./pages/admin/UsersManagement";
import RolesPermissions from "./pages/admin/RolesPermissions";
import StorageControl from "./pages/admin/StorageControl";
import SystemLogs from "./pages/admin/SystemLogs";
import PlatformSettings from "./pages/admin/PlatformSettings";

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* USER DASHBOARD */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyFiles />} /> {/* DEFAULT PAGE */}
            <Route path="myFiles" element={<MyFiles />} />
            <Route path="activity" element={<Activity />} />
            <Route path="shared" element={<Shared />} />
            <Route path="favorites" element={<Favorites />} />
          </Route>

          {/* MANAGER DASHBOARD */}
          <Route
            path="/dashboard/manager"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerHome />} />
            <Route path="team" element={<TeamOverview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
          </Route>

          {/* ADMIN DASHBOARD */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="storage" element={<StorageControl />} />
            <Route path="system-logs" element={<SystemLogs />} />
            <Route path="settings" element={<PlatformSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
