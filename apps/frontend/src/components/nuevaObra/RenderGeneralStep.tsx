import React from 'react'
import { Input } from '../common/Input'
import { Building2, MapPin, Maximize2 } from 'lucide-react'

interface RenderGeneralStepProps {
  formData: {
    projectName: string;
    location: string;
    surface: string;
  };
  handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RenderGeneralStep = ({ formData, handleInputChange }: RenderGeneralStepProps) => {
  return (
    <section className="space-y-4">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Datos generales</h2>
        <p className="text-sm text-slate-500">
          Identifica el proyecto para el seguimiento diario.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Nombre del proyecto
        </label>
        <Input
          icon={<Building2 size={16} />}
          value={formData.projectName}
          onChange={handleInputChange("projectName")}
          placeholder="Ej. Reforma Casa Caballito"
          className="rounded-md border-secondary bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Ubicacion / direccion
        </label>
        <Input
          icon={<MapPin size={16} />}
          value={formData.location}
          onChange={handleInputChange("location")}
          placeholder="Calle, numero y localidad"
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Superficie estimada
        </label>
        <Input
          icon={<Maximize2 size={16} />}
          value={formData.surface}
          onChange={handleInputChange("surface")}
          placeholder="Superficie estimada (m2)"
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>
    </section>
  )
}

  export default RenderGeneralStep