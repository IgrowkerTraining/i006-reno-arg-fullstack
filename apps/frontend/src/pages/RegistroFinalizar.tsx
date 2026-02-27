import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistroHeader from "../components/registro/RegistroHeader";
import FooterActions from "../components/registro/FooterActions";
import { ROUTE_BUILDERS } from "../constants/routes";

const RegistroFinalizar = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();
  const [observacion, setObservacion] = useState("");

  if (!obraId) return null;

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraRegistroSeguridad(obraId));
  };

  const handleFinalizar = () => {
    // TODO: enviar datos al backend
    navigate(ROUTE_BUILDERS.obraDetalle(obraId));
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="overflow-hidden rounded-3xl shadow-lg border border-slate-200">

        {/* HEADER */}
        <div className="bg-primary px-8 py-6">
          <RegistroHeader
            obraNombre={`Obra ${obraId}`}
            fecha={new Date().toLocaleDateString()}
            porcentaje={45}
            pasoActual={3}
          />
        </div>

        {/* BODY */}
        <div className="bg-[#F5F5F7] p-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">

            {/* Check + título */}
            <div className="flex flex-col items-center text-center space-y-3 py-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">¡Todo listo para enviar!</h3>
              <p className="text-sm text-gray-500">
                Se registrará el avance de hoy y se notificará al responsable.
              </p>
            </div>

            {/* Observaciones */}
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="¿Alguna observación extra? (Ej: El material llegó tarde)"
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <FooterActions
              onBack={handleBack}
              onNext={handleFinalizar}
              nextLabel="Finalizar →"
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroFinalizar;

