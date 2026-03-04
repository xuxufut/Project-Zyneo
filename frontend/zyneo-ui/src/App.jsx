import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./assets/services/authApi";

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("zyneo_token") || "");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    getCurrentUser(token)
      .then(response => {
        setUser(response.user);
      })
      .catch(() => {
        localStorage.removeItem("zyneo_token");
        setToken("");
        setUser(null);
      });
  }, [token]);

  const authActions = useMemo(
    () => ({
      async login(payload) {
        const response = await loginUser(payload);
        localStorage.setItem("zyneo_token", response.token);
        setToken(response.token);
        setUser(response.user);
        navigate("/", { replace: true });
      },
      async register(payload) {
        const response = await registerUser(payload);
        localStorage.setItem("zyneo_token", response.token);
        setToken(response.token);
        setUser(response.user);
        navigate("/", { replace: true });
      },
      async logout() {
        if (token) {
          await logoutUser(token).catch(() => null);
        }
        localStorage.removeItem("zyneo_token");
        setToken("");
        setUser(null);
        navigate("/login", { replace: true });
      },
    }),
    [navigate, token],
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Routes>
        <Route
          path="/login"
          element={<LoginPage isAuthenticated={Boolean(token)} onLogin={authActions.login} />}
        />
        <Route
          path="/register"
          element={<RegisterPage isAuthenticated={Boolean(token)} onRegister={authActions.register} />}
        />
        <Route
          path="/"
          element={(
            <ProtectedRoute isAuthenticated={Boolean(token)}>
              <Navbar user={user} onLogout={authActions.logout} />
              <Home user={user} />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </div>
  );
}

export default App;
