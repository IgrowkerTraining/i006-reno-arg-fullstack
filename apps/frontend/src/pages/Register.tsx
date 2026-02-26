import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { getSecurityTip } from "../services/service";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [securityTip, setSecurityTip] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getSecurityTip();
      setSecurityTip(tip);
    };
    fetchTip();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError(null);
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    const newErrors: Record<string, string> = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Contraseñas no coinciden";
    }
    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.register({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      login(response.user);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Registro fallido. Por favor, intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#96C5CD]">
      <div className="w-full max-w-lg">
        <div className="bg-primary backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-1">
              Registrate
            </h1>
            <p className="text-slate-400"></p>
          </div>

          {serverError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
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
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <Input
                label="Nombre"
                name="name"
                placeholder="Juan"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Apellido"
                name="lastName"
                placeholder="Pérez"
                required
                disabled={isLoading}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              error={errors.password}
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              error={errors.confirmPassword}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div className="md:col-span-2 mt-4">
              <Button type="submit" variant="secondary" className="w-full mt-4" isLoading={isLoading}>
                Registrar
              </Button>
            </div>
          </form>

          {securityTip && (
            <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456-2.454L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                  <p className="text-sm text-indigo-300 p-2">
                    {securityTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-1 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              ¿Ya tenés cuenta?{" "}
              <Link
                to="/login"
                className="text-secondary hover:text-accent font-semibold transition-colors"
              >
                Iniciá sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
