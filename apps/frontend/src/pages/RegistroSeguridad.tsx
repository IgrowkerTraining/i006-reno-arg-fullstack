import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistroHeader from "../components/registro/RegistroHeader";
import FooterActions from "../components/registro/FooterActions";
import { ROUTE_BUILDERS } from "../constants/routes";

interface SeguridadItem {
  id: string;
  label: string;
  value: boolean | null;
}

const SEGURIDAD_ITEMS: Omit<SeguridadItem, "value">[] = [
  { id: "casco", label: "Uso de casco/calzado" },
  { id: "zona_senalizada", label: "Zona señalizada" },
  { id: "proteccion_aberturas", label: "Protección de aberturas" },
  { id: "limpieza", label: "Limpieza del área" },
];

const ART_ITEMS: Omit<SeguridadItem, "value">[] = [
  { id: "art_vigentes", label: "ART Vigentes" },
];

const BooleanToggle = ({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
        value === false
          ? "bg-red-500 border-red-500 text-white"
          : "border-gray-300 text-gray-400 hover:border-red-400"
      }`}
    >
      ✕
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
        value === true
          ? "bg-green-500 border-green-500 text-white"
          : "border-gray-300 text-gray-400 hover:border-green-400"
      }`}
    >
      ✓
    </button>
  </div>
);

const RegistroSeguridad = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();

  const [seguridadItems, setSeguridadItems] = useState<SeguridadItem[]>(
    SEGURIDAD_ITEMS.map((item) => ({ ...item, value: null }))
  );

  const [artItems, setArtItems] = useState<SeguridadItem[]>(
    ART_ITEMS.map((item) => ({ ...item, value: null }))
  );

  if (!obraId) return null;

  const allAnswered =
    seguridadItems.every((i) => i.value !== null) &&
    artItems.every((i) => i.value !== null);

  const handleSeguridadChange = (id: string, val: boolean) => {
    setSeguridadItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: val } : item))
    );
  };

  const handleArtChange = (id: string, val: boolean) => {
    setArtItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: val } : item))
    );
  };

  const handleNext = () => {
    navigate(ROUTE_BUILDERS.obraRegistroFinalizar(obraId));
  };

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraRegistro(obraId));
  };

  const renderItems = (
    items: SeguridadItem[],
    onChange: (id: string, val: boolean) => void
  ) => (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-700">{item.label}</span>
          <BooleanToggle
            value={item.value}
            onChange={(val) => onChange(item.id, val)}
          />
        </div>
      ))}
    </div>
  );
 console.log("seguridadItems:", seguridadItems);
  console.log("artItems:", artItems);
  console.log("allAnswered:", allAnswered);
  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="overflow-hidden rounded-3xl shadow-lg border border-slate-200">

        {/* HEADER */}
        <div className="bg-primary px-8 py-6">
          <RegistroHeader
            obraNombre={`Obra ${obraId}`}
            fecha={new Date().toLocaleDateString()}
            porcentaje={45}
            pasoActual={2}
          />
        </div>

        {/* BODY */}
        <div className="bg-[#F5F5F7] p-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">

            {/* Seguridad e Higiene */}
            <div>
              <h3 className="text-md font-semibold mb-2">Checklist de Seguridad e Higiene</h3>
              {renderItems(seguridadItems, handleSeguridadChange)}
            </div>

            {/* ART */}
            <div>
              <h3 className="text-md font-semibold mb-2">ART Vigentes</h3>
              {renderItems(artItems, handleArtChange)}
            </div>

            <FooterActions
              onBack={handleBack}
              onNext={handleNext}
              disableNext={!allAnswered}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroSeguridad;

