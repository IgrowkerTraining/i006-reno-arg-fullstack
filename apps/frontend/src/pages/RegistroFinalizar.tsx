import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_BUILDERS } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { clearReportDraft, getReportDraft } from "../utils/reportDraft";

const RegistroFinalizar = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [observacion, setObservacion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!obraId) return null;

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraRegistroSeguridad(obraId));
  };

  const handleFinalizar = async () => {
    if (!user?.id) {
      setError("No se pudo identificar el usuario.");
      return;
    }

    const reportDraft = getReportDraft(obraId);

    if (!reportDraft.selectedTasks.length) {
      setError("Debes seleccionar al menos una tarea para finalizar.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createDailyReport({
        idSupervisor: Number(user.id),
        idProject: Number(obraId),
        progressPercentage: 45,
        comment: observacion.trim(),
        selectedTasks: reportDraft.selectedTasks,
        selectedTrades: reportDraft.selectedTrades,
        safetyItems: reportDraft.safetyItems.map((item) => ({
          id_medida_seg: Number(item.id),
          cumple: Boolean(item.status),
        })),
      });

      clearReportDraft(obraId);
      navigate(ROUTE_BUILDERS.obraDetalle(obraId));
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar el registro diario.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-6 lg:px-2">
      <div className="w-full">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="flex items-start justify-between bg-primary px-8 py-6 text-white md:px-12">
            <div>
              <h1 className="text-3xl font-semibold leading-tight">
                Registro diario de obra
              </h1>
              <p className="mt-1 text-sm opacity-95">
                {new Date().toLocaleDateString('es-AR')}
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-semibold leading-none">45%</p>
              <p className="mt-2 text-sm uppercase opacity-95">Avance actual</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="px-8 pt-5 md:px-12">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold uppercase md:gap-6">
              <div className="flex items-center gap-3 text-cyan-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-base text-white">
                  1
                </div>
                <span>Tareas</span>
              </div>

              <div className="h-[2px] w-16 bg-cyan-500 md:w-24" />

              <div className="flex items-center gap-3 text-cyan-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-base text-white">
                  2
                </div>
                <span>Seguridad y ART</span>
              </div>

              <div className="h-[2px] w-16 bg-cyan-500 md:w-24" />

              <div className="flex items-center gap-3 text-cyan-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-base text-white">
                  3
                </div>
                <span>Finalizar</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-[#F5F5F7] px-8 pb-8 pt-6 md:px-12 md:pb-10">
            <div className="rounded-[24px] bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center space-y-4 py-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-10 w-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-slate-800">
                  ¡Todo listo para enviar!
                </h3>

                <p className="max-w-md text-sm text-slate-500">
                  Se registrará el avance de hoy y se notificará al responsable.
                </p>
              </div>

              <div className="flex justify-center">
                <textarea
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="¿Alguna observación extra? (Ej: El material llegó tarde)"
                  rows={4}
                  className="w-full max-w-xl resize-none rounded-xl border border-slate-200 bg-[#F3F3F3] p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {error ? (
                <p className="mt-4 text-center text-sm text-red-600">{error}</p>
              ) : null}

              <div className="mt-14 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[26px] font-normal text-slate-500 transition hover:text-slate-700"
                >
                  ← Atrás
                </button>

                <button
                  type="button"
                  onClick={() => void handleFinalizar()}
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Finalizando..." : "Finalizar →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroFinalizar;