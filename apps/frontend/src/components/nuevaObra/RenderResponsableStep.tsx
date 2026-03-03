import React from 'react'
import { Input } from '../common/Input'
import { AlertCircle, Building2, MapPin } from 'lucide-react'


interface RenderResponsableStepProps {
  formData: {
    managerName: string;
    licenseNumber: string;
  };
  handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}   

const RenderResponsableStep = ({ formData, handleInputChange }: RenderResponsableStepProps) => {
  return (
    <section className="space-y-4">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Responsable</h2>
        <p className="text-sm text-slate-500">
          Toda obra debe estar validada por un profesional matriculado.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Nombre del responsable
        </label>
        <Input
          icon={<Building2 size={16} />}
          value={formData.managerName}
          onChange={handleInputChange("managerName")}
          placeholder="Arq./ MMO Apellido y Nombre"
          className="rounded-md border-secondary bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Nro. de matricula
        </label>
        <Input
          icon={<MapPin size={16} />}
          value={formData.licenseNumber}
          onChange={handleInputChange("licenseNumber")}
          placeholder="CPAU/CAPBA Nro..."
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-700">
        <AlertCircle size={16} />
        <p>
          La informacion de la obra solo sera valida si cuenta con la validacion
          explicita de este responsable.
        </p>
      </div>
    </section>
  )
}

export default RenderResponsableStep
