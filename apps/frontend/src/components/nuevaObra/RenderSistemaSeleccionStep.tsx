import { Check } from 'lucide-react';
import React from 'react'


type SistemaConstructivo = "tradicional" | "seco" | "mixto";

const SYSTEM_OPTIONS: Array<{
  id: SistemaConstructivo;
  title: string;
  description: string;
}> = [
    {
      id: "tradicional",
      title: "Tradicional",
      description: "Ladrillos, revoque humedo, hormigon.",
    },
    {
      id: "seco",
      title: "En seco (Durlock)",
      description: "Placas de yeso y perfiles de acero",
    },
    {
      id: "mixto",
      title: "Mixto",
      description: "Ambos",
    },
  ];

interface RenderSistemaSeleccionStepProps {
  formData: {
    systemType: SistemaConstructivo | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    systemType: SistemaConstructivo | null;
  }>>;
}

const RenderSistemaSeleccionStep = ({ formData, setFormData }: RenderSistemaSeleccionStepProps) => {
  return (
   <section className="space-y-5">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Sistema Constructivo</h2>
        <p className="text-sm text-slate-500">
          Selecciona el metodo predominante de la intervencion.
        </p>
      </div>

      <div className="space-y-2">
        {SYSTEM_OPTIONS.map((option) => {
          const isSelected = formData.systemType === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setFormData((previous) => ({ ...previous, systemType: option.id }))
              }
              className={`w-full rounded-md border px-4 py-3 text-left transition-colors ${isSelected
                  ? "border-[#BAC1D8] bg-[#EEF0F7]"
                  : "border-[#D8DCEA] bg-white hover:border-[#BAC1D8]"
                }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{option.title}</h3>
                  <p className="text-base text-neutro-1">{option.description}</p>
                </div>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isSelected
                      ? "border-primary text-primary"
                      : "border-primary text-transparent"
                    }`}
                >
                  <Check size={18} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  )
}

export default RenderSistemaSeleccionStep
