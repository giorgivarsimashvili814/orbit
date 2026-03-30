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

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

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
            <Route path="team" element={<Navigate to="/" replace />} />
            <Route path="my-issues">
              <Route index element={<Navigate to="assigned" replace />} />
              <Route path=":filter" element={<IssuesPage />} />
            </Route>
            <Route path="members" element={<MembersPage />} />
            <Route path="projects">
              <Route index element={<Navigate to="all" replace />} />
              <Route path=":filter" element={<ProjectsPage />} />
            </Route>

            <Route path="team/:key">
              <Route index element={<Navigate to="issues/active" replace />} />
              <Route path="issues">
                <Route index element={<Navigate to="active" replace />} />
                <Route path=":filter" element={<IssuesPage />} />
              </Route>
              <Route path="projects">
                <Route index element={<Navigate to="all" replace />} />
                <Route path=":filter" element={<ProjectsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="/404" element={<h1>404 Not Found</h1>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
