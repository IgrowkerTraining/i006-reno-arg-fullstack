import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistroHeader from "../components/registro/RegistroHeader";
import ChecklistGroup from "../components/registro/ChecklistGroup";
import FooterActions from "../components/registro/FooterActions";
import { ROUTE_BUILDERS } from "../constants/routes";

const TAREAS_OPTIONS = [
  { id: "tabique", label: "Levantamiento de tabique" },
  { id: "embutido", label: "Embutido" },
  { id: "canalizacion", label: "Canalización" },
  { id: "revoque", label: "Revoque fino" },
  { id: "carpeta", label: "Carpeta" },
  { id: "impermeabilizacion", label: "Impermeabilización" },
];

const OFICIOS_OPTIONS = [
  { id: "plomeria", label: "Plomería" },
  { id: "albanileria", label: "Albañilería" },
  { id: "techista", label: "Techista" },
  { id: "electricidad", label: "Electricidad" },
];

const RegistroTareas = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();

  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<string[]>([]);
  const [oficiosSeleccionados, setOficiosSeleccionados] = useState<string[]>([]);

  if (!obraId) return null;

  const handleNext = () => {
    navigate(ROUTE_BUILDERS.obraRegistroSeguridad(obraId));
  };

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraDetalle(obraId));
  };


   return (
  <div className="mx-auto w-full max-w-5xl pb-10">

    <div className="overflow-hidden rounded-3xl shadow-lg border border-slate-200">

      {/* HEADER AZUL COMPLETO */}
      <div className="bg-primary px-8 py-6">
        <RegistroHeader
          obraNombre={`Obra ${obraId}`}
          fecha={new Date().toLocaleDateString()}
          porcentaje={45}
          pasoActual={1}
        />
      </div>

      {/* BODY */}
      <div className="bg-[#F5F5F7] p-8">

        {/* Card blanca interna */}
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">

          <ChecklistGroup
            title="¿Qué tareas se realizaron?"
            options={TAREAS_OPTIONS}
            selected={tareasSeleccionadas}
            onChange={setTareasSeleccionadas}
          />

          <ChecklistGroup
            title="Oficios en obra"
            options={OFICIOS_OPTIONS}
            selected={oficiosSeleccionados}
            onChange={setOficiosSeleccionados}
          />

          <FooterActions
            onBack={handleBack}
            onNext={handleNext}
            disableNext={tareasSeleccionadas.length === 0}
          />

        </div>
      </div>
    </div>
  </div>
);}

export default RegistroTareas;

