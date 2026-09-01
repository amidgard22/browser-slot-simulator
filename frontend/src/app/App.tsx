import { useEffect, useState } from "react";
import { LoginForm } from "../features/auth/LoginForm";
import { RegisterForm } from "../features/auth/RegisterForm";
import { getMe } from "../features/auth/auth.api";
import { clearToken, getToken } from "../features/auth/auth.storage";
import { SlotGame } from "../game/ui/SlotGame";

type Page = "login" | "register" | "game";

export const App = () => {
  const [page, setPage] = useState<Page>("login");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    getMe()
      .then(() => setPage("game"))
      .catch(() => clearToken())
      .finally(() => setIsCheckingAuth(false));
  }, []);

  if (isCheckingAuth) {
    return <main className="auth-page">Loading...</main>;
  }

  if (page === "login") {
    return (
      <LoginForm
        onSuccess={() => setPage("game")}
        onSwitchToRegister={() => setPage("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <>
        <RegisterForm onSuccess={() => setPage("login")} />
        <div className="auth-switch">
          <button type="button" onClick={() => setPage("login")}>
            Back to login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="auth-switch">
        <button
          type="button"
          onClick={() => {
            clearToken();
            setPage("login");
          }}
        >
          Logout
        </button>
      </div>
      <SlotGame />
    </>
  );
};
