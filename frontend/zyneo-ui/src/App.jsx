import { useEffect, useMemo, useState } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./assets/services/authApi";

function getCurrentPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("zyneo_token") || "");
  const [user, setUser] = useState(null);
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const navigate = nextPath => {
    if (window.location.pathname === nextPath) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

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
        navigate("/login");
      });
  }, [token]);

  useEffect(() => {
    if (!token && path === "/") {
      navigate("/login");
    }

    if (token && (path === "/login" || path === "/register")) {
      navigate("/");
    }
  }, [token, path]);

  const authActions = useMemo(
    () => ({
      async login(payload) {
        const response = await loginUser(payload);
        localStorage.setItem("zyneo_token", response.token);
        setToken(response.token);
        setUser(response.user);
        navigate("/");
      },
      async register(payload) {
        const response = await registerUser(payload);
        localStorage.setItem("zyneo_token", response.token);
        setToken(response.token);
        setUser(response.user);
        navigate("/");
      },
      async logout() {
        if (token) {
          await logoutUser(token).catch(() => null);
        }
        localStorage.removeItem("zyneo_token");
        setToken("");
        setUser(null);
        navigate("/login");
      },
      toLogin() {
        navigate("/login");
      },
      toRegister() {
        navigate("/register");
      },
    }),
    [token],
  );

  if (!token && path === "/register") {
    return <RegisterPage onRegister={authActions.register} onGotoLogin={authActions.toLogin} />;
  }

  if (!token) {
    return <LoginPage onLogin={authActions.login} onGotoRegister={authActions.toRegister} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar user={user} onLogout={authActions.logout} />
      <Home user={user} />
    </div>
  );
}

export default App;
