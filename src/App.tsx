import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AllPackagesPage from "./pages/packages/all-packages";
import MyLoggedPackagesPage from "./pages/packages/my-logged-packages";
import MyPackagesPage from "./pages/packages/my-packages";
import UsersPage from "./pages/users/index";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/packages" element={<AllPackagesPage />} />
          <Route path="/packages/my-logged" element={<MyLoggedPackagesPage />} />
          <Route path="/packages/my" element={<MyPackagesPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
