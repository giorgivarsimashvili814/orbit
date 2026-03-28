import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/auth/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateWs from "./pages/CreateWs";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import IssuesPage from "./pages/IssuesPage";
import MembersPage from "./pages/MembersPage";
import ProjectsPage from "./pages/ProjectsPage";
import { WorkspaceProvider } from "./context/workspace/WorkspaceProvider";
import { useWorkspace } from "./context/workspace/useWorkspace";
import { Spinner } from "./components/ui/spinner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function AppGate() {
  const { loading: authLoading } = useAuth();
  const { loading: wsLoading } = useWorkspace();

  if (authLoading || wsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
}

function AuthLayout() {
  return (
    <ProtectedRoute>
      <WorkspaceProvider>
        <AppGate />
      </WorkspaceProvider>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-new" element={<CreateWs />} />

          <Route path="/:slug" element={<DashboardLayout />}>
            <Route index element={<Navigate to="issues" replace />} />
            <Route path="issues" element={<IssuesPage />} />
            <Route path="projects">
              <Route index element={<Navigate to="all" replace />} />
              <Route path="all" element={<ProjectsPage />} />
            </Route>
            <Route path="members" element={<MembersPage />} />
          </Route>
        </Route>

        <Route path="/404" element={<h1>404 Not Found</h1>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
