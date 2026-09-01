import { useState, type FormEvent } from "react";
import { registerUser } from "./auth.api";
import "./register.css";

type Props = {
  onSuccess?: () => void;
};

export const RegisterForm = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const result = await registerUser(email, password);
      setMessage(result.message);
      setPassword("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Register</h1>
        <p className="auth-subtitle">Create an account to play</p>

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
              placeholder="Min 6 characters"
              minLength={6}
              required
              autoComplete="new-password"
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}
      </section>
    </main>
  );
};
