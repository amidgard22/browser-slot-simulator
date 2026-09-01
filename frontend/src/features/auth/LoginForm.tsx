import { useState, type FormEvent } from "react";
import { loginUser } from "./auth.api";
import { setToken } from "./auth.storage";
import "./register.css";

type Props = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};

export const LoginForm = ({ onSuccess, onSwitchToRegister }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);
      setToken(result.token);
      setPassword("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Sign in to play</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              minLength={6}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        {onSwitchToRegister && (
          <p className="auth-link">
            No account?{" "}
            <button type="button" onClick={onSwitchToRegister}>
              Register
            </button>
          </p>
        )}
      </section>
    </main>
  );
};
