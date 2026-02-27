import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistroHeader from "../components/registro/RegistroHeader";
import FooterActions from "../components/registro/FooterActions";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";
import { getReportDraft, saveReportDraft } from "../utils/reportDraft";

interface SeguridadItem {
  id: number;
  label: string;
  value: boolean | null;
}

const FALLBACK_SEGURIDAD: Omit<SeguridadItem, "value">[] = [
  { id: 1, label: "Uso de casco/calzado" },
  { id: 2, label: "Uso de arnés de seguridad" },
  { id: 3, label: "Uso de gafas protectoras" },
  { id: 4, label: "Delimitación de zona de trabajo" },
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
      className={`h-8 w-8 rounded-full border-2 transition-colors ${
        value === false
          ? "border-red-500 bg-red-500 text-white"
          : "border-gray-300 text-gray-400 hover:border-red-400"
      }`}
    >
      ✕
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`h-8 w-8 rounded-full border-2 transition-colors ${
        value === true
          ? "border-green-500 bg-green-500 text-white"
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
    FALLBACK_SEGURIDAD.map((item) => ({ ...item, value: null })),
  );
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) return;

    const loadSetup = async () => {
      const draft = getReportDraft(obraId);
      const draftMap = new Map(draft.safetyItems.map((item) => [item.id, item.status]));

      try {
        const setup = await api.getReportSetup(obraId);
        const safetyCatalog = Array.isArray(setup?.safety) ? setup.safety : [];

        const mappedItems: SeguridadItem[] = (safetyCatalog.length
          ? safetyCatalog.map((item: any) => ({
              id: Number(item.id_safety_measure),
              label: item.name,
            }))
          : FALLBACK_SEGURIDAD
        ).map((item) => ({
          ...item,
          value: draftMap.has(item.id) ? Boolean(draftMap.get(item.id)) : null,
        }));

        setSeguridadItems(mappedItems);
      } catch {
        setSeguridadItems(
          FALLBACK_SEGURIDAD.map((item) => ({
            ...item,
            value: draftMap.has(item.id) ? Boolean(draftMap.get(item.id)) : null,
          })),
        );
        setSetupError("No se pudo cargar medidas de seguridad. Se usan opciones locales.");
      }
    };

    loadSetup();
  }, [obraId]);

  if (!obraId) return null;

  const allAnswered = seguridadItems.every((item) => item.value !== null);

  const handleSeguridadChange = (id: number, value: boolean) => {
    setSeguridadItems((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  const handleNext = () => {
    saveReportDraft(obraId, {
      safetyItems: seguridadItems
        .filter((item) => item.value !== null)
        .map((item) => ({ id: item.id, status: Boolean(item.value) })),
    });
    navigate(ROUTE_BUILDERS.obraRegistroFinalizar(obraId));
  };

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraRegistro(obraId));
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
        <div className="bg-primary px-8 py-6">
          <RegistroHeader
            obraNombre={`Obra ${obraId}`}
            fecha={new Date().toLocaleDateString()}
            porcentaje={45}
            pasoActual={2}
          />
        </div>

        <div className="bg-[#F5F5F7] p-8">
          <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
            {setupError ? <p className="text-sm text-amber-700">{setupError}</p> : null}

            <div>
              <h3 className="mb-2 text-md font-semibold">Checklist de Seguridad e Higiene</h3>
              <div className="divide-y divide-gray-100">
                {seguridadItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <BooleanToggle
                      value={item.value}
                      onChange={(val) => handleSeguridadChange(item.id, val)}
                    />
                  </div>
                ))}
              </div>
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
