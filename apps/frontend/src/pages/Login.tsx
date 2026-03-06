import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { validateLogin } from "../utils/validation";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateLogin({ email: email.trim(), password: password.trim() });
    if (!validation.isValid) {
      const mappedErrors = validation.errors.reduce<Record<string, string>>((acc, current) => {
        acc[current.field.toLowerCase()] = current.message;
        return acc;
      }, {});
      setFieldErrors(mappedErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await api.login({ email: email.trim(), password });
      login(response.user);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error. Intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    if (!fieldErrors[field]) return;
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#96C5CD]">
      <div className="w-full max-w-md">
        <div className="bg-primary backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Bienvenid@</h1>
            <p className="text-slate-400">Ingresá tus credenciales para acceder.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {error}
              </div>
            )}

            <Input
              label="Email"
              placeholder="ejemplo@gmail.com"
              type="email"
              required
              disabled={isLoading}
              value={email}
              error={fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
                clearFieldError("email");
              }}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              type="password"
              required
              disabled={isLoading}
              value={password}
              error={fieldErrors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
                clearFieldError("password");
              }}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded focus:ring-accent focus:ring-offset-secondary"
                />
                <span className="text-sm text-neutro-3">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm text-secondary hover:text-accent font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button type="submit" variant="secondary" className="w-full mt-4" isLoading={isLoading}>
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutro-2 text-center">
            <p className="text-neutro-2 text-sm">
              ¿Aún no tenés cuenta?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-secondary hover:text-accent font-semibold transition-colors"
              >
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
