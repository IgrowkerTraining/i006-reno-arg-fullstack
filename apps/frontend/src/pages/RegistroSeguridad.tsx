import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";
import { getReportDraft, saveReportDraft } from "../utils/reportDraft";

interface SeguridadItem {
  id: number;
  label: string;
  value: boolean | null;
}

const UX_SEGURIDAD: Omit<SeguridadItem, "value">[] = [
  { id: 1, label: "Uso de casco/calzado" },
  { id: 2, label: "Zona señalizada" },
  { id: 3, label: "Protección de aberturas" },
  { id: 4, label: "Limpieza del área" },
  { id: 5, label: "ART VIGENTES" },
];

const normalizeSafetyLabel = (label: string) => {
  const normalized = label.trim().toLowerCase();

  if (
    normalized.includes("casco") ||
    normalized.includes("calzado")
  ) {
    return "Uso de casco/calzado";
  }

  if (
    normalized.includes("zona señal") ||
    normalized.includes("zona senal") ||
    normalized.includes("señalizada") ||
    normalized.includes("senalizada")
  ) {
    return "Zona señalizada";
  }

  if (
    normalized.includes("protección de aberturas") ||
    normalized.includes("proteccion de aberturas") ||
    normalized.includes("aberturas")
  ) {
    return "Protección de aberturas";
  }

  if (
    normalized.includes("limpieza") ||
    normalized.includes("área") ||
    normalized.includes("area")
  ) {
    return "Limpieza del área";
  }

  if (normalized.includes("art")) {
    return "ART VIGENTES";
  }

  return label;
};

const BooleanToggle = ({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (val: boolean) => void;
}) => {
  const buttonBase =
    "flex h-7 w-7 items-center justify-center rounded-full border text-xs transition";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`${buttonBase} ${
          value === false
            ? "border-red-500 bg-red-50 text-red-500"
            : "border-red-400 text-red-400 hover:border-red-500 hover:text-red-500"
        }`}
      >
        ✕
      </button>

      <button
        type="button"
        onClick={() => onChange(true)}
        className={`${buttonBase} ${
          value === true
            ? "border-green-500 bg-green-50 text-green-500"
            : "border-green-500 text-green-500 hover:bg-green-50"
        }`}
      >
        ✓
      </button>
    </div>
  );
};

const RegistroSeguridad = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();

  const [seguridadItems, setSeguridadItems] = useState<SeguridadItem[]>(
    UX_SEGURIDAD.map((item) => ({ ...item, value: null }))
  );
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) return;

    const loadSetup = async () => {
      const draft = getReportDraft(obraId);
      const draftMap = new Map(
        (draft.safetyItems || []).map((item) => [Number(item.id), item.status])
      );

      try {
        const setup = await api.getReportSetup(obraId);

        const backendItems = Array.isArray(setup?.safety) ? setup.safety : [];

        const normalizedBackendLabels = backendItems.map((item: any) =>
          normalizeSafetyLabel(item.name)
        );

        const finalItems = UX_SEGURIDAD.map((uxItem) => {
          const matchedBackend = backendItems.find(
            (item: any) => normalizeSafetyLabel(item.name) === uxItem.label
          );

          const backendId = matchedBackend
            ? Number(matchedBackend.id_safety_measure)
            : uxItem.id;

          return {
            id: backendId,
            label: uxItem.label,
            value: draftMap.has(backendId) ? draftMap.get(backendId)! : null,
          };
        });

        setSeguridadItems(finalItems);
        setSetupError(null);

        if (!backendItems.length) {
          console.warn("API respondió vacío, usando estructura UX");
        } else {
          console.log("Medidas backend detectadas:", normalizedBackendLabels);
        }
      } catch (error) {
        console.error(error);
        setSetupError("No se pudo cargar el formulario.");
        setSeguridadItems(
          UX_SEGURIDAD.map((item) => ({
            ...item,
            value: draftMap.has(item.id) ? draftMap.get(item.id)! : null,
          }))
        );
      }
    };

    loadSetup();
  }, [obraId]);

  if (!obraId) return null;

  const allAnswered = seguridadItems.every((item) => item.value !== null);

  const handleSeguridadChange = (id: number, value: boolean) => {
    setSeguridadItems((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item))
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
    <div className="w-full px-4 py-6 lg:px-2">
      <div className="w-full">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div className="flex items-start justify-between bg-primary px-8 py-6 text-white md:px-12">
            <div>
              <h1 className="text-3xl font-semibold leading-tight">
                Reforma Vivienda Familiar
              </h1>
              <p className="mt-1 text-sm opacity-95">
                Registro diario de obra 13/02/26
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-semibold leading-none">45%</p>
              <p className="mt-2 text-sm uppercase opacity-95">Avance actual</p>
            </div>
          </div>

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

              <div className="h-[2px] w-16 bg-gray-200 md:w-24" />

              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-base text-gray-500">
                  3
                </div>
                <span>Finalizar</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F7] px-8 pb-8 pt-6 md:px-12 md:pb-10">
            <div className="rounded-[24px] bg-white p-8 shadow-sm">
              {setupError ? (
                <p className="mb-5 text-sm text-red-600">{setupError}</p>
              ) : null}

              <div className="max-w-5xl">
                <h2 className="mb-6 text-[22px] font-semibold text-slate-900 md:text-[24px]">
                  Checklist de Seguridad e Higiene
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {seguridadItems.map((item, index) => {
                    const isLastSingle = index === seguridadItems.length - 1;

                    const stateClass =
                      item.value === true
                        ? "border border-green-200 bg-green-50/60"
                        : item.value === false
                        ? "border border-red-200 bg-red-50/60"
                        : "bg-[#F3F3F3] border border-transparent";

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between rounded-xl px-4 py-4 ${stateClass} ${
                          isLastSingle ? "md:col-span-2" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium text-slate-700 ${
                            isLastSingle ? "font-semibold uppercase" : ""
                          }`}
                        >
                          {item.label}
                        </span>

                        <BooleanToggle
                          value={item.value}
                          onChange={(val) => handleSeguridadChange(item.id, val)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-14 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[28px] font-normal text-slate-500 transition hover:text-slate-700"
                >
                  ← Atrás
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!allAnswered}
                  className="rounded-xl bg-primary px-8 py-4 text-xl font-semibold text-white shadow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroSeguridad;