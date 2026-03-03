import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistroHeader from "../components/registro/RegistroHeader";
import FooterActions from "../components/registro/FooterActions";
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
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
        <div className="bg-primary px-8 py-6">
          <RegistroHeader
            obraNombre={`Obra ${obraId}`}
            fecha={new Date().toLocaleDateString()}
            porcentaje={45}
            pasoActual={3}
          />
        </div>

        <div className="bg-[#F5F5F7] p-8">
          <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center space-y-3 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-500"
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
              <h3 className="text-lg font-semibold text-gray-800">¡Todo listo para enviar!</h3>
              <p className="text-sm text-gray-500">
                Se registrará el avance de hoy y se notificará al responsable.
              </p>
            </div>

            <textarea
              value={observacion}
              onChange={(event) => setObservacion(event.target.value)}
              placeholder="¿Alguna observación extra? (Ej: El material llegó tarde)"
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <FooterActions
              onBack={handleBack}
              onNext={() => {
                void handleFinalizar();
              }}
              nextLabel={isSubmitting ? "Finalizando..." : "Finalizar →"}
              disableNext={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroFinalizar;
