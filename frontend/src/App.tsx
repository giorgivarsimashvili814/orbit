import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateWs from "./pages/CreateWs";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import IssuesPage from "./pages/IssuesPage";
import MembersPage from "./pages/MembersPage";
import ProjectsPage from "./pages/ProjectsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-new"
          element={
            <ProtectedRoute>
              <CreateWs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:slug"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="issues" replace />} />

          <Route path="issues" element={<IssuesPage />} />

          <Route path="projects">
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<ProjectsPage />} />
          </Route>

          <Route path="members" element={<MembersPage />} />
        </Route>

        <Route path="/404" element={<h1>404 Not Found</h1>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
