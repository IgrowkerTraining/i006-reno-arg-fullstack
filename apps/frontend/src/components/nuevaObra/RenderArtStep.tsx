import { CalendarDays, CircleUserRound, FileText, MapPin, Maximize2, ShieldCheck, Upload } from 'lucide-react'
import React, {useRef, useState} from 'react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

interface RenderArtStepProps {
  formData: {
    projectName: string;        
    location: string;
    surface: string;
    managerName: string;    
    licenseNumber: string;
    artProvider: string;
    artCoverageConfirmed: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    projectName: string;        
    location: string;   
    surface: string;
    managerName: string;    
    licenseNumber: string;
    artProvider: string;
    artCoverageConfirmed: boolean;
  }>>;
  creationDate: string;
  artProviders: { id: string; name: string }[];
}   

const RenderArtStep = ({ formData, setFormData, creationDate, artProviders }: RenderArtStepProps ) => {

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
   const handleArtProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((previous) => ({ ...previous, artProvider: event.target.value }));
  };

    const handleArtCoverageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((previous) => ({
        ...previous,
        artCoverageConfirmed: event.target.checked,
      }));
    };

    
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedList = event.target.files ? Array.from(event.target.files) : [];
    if (!selectedList.length) return;

    setUploadedFiles((previous) => [...previous, ...selectedList]);
    event.target.value = "";
  };

   const fileInputRef = useRef<HTMLInputElement>(null);

     const handleOpenFileSelector = () => {
       fileInputRef.current?.click();
     };
   
    return (
      <section className="space-y-5">
      <h2 className="text-4xl font-bold text-neutro-1">
        {formData.projectName.trim() || "Nueva obra"}
      </h2>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          {formData.location.trim() || "Ubicacion sin definir"}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          Fecha de inicio: {creationDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Maximize2 size={14} />
          Superficie: {formData.surface.trim() || "-"} m2
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutro-1">
        <CircleUserRound size={16} className="text-secondary-plus" />
        <span>
          {formData.managerName.trim() || "Responsable sin asignar"} - Matricula{" "}
          {formData.licenseNumber.trim() || "-"}
        </span>
      </div>

      <Card className="border-secondary bg-[#D9ECF1] p-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-secondary bg-white/50 p-4 text-center">
            <Upload size={20} className="mx-auto text-primary" />
            <h3 className="mt-2 text-lg font-semibold text-primary">Cargar documentacion</h3>
            <p className="mt-1 text-xs text-slate-600">
              Certificado de cobertura o constancia de no repeticion.
            </p>
            <div className="mt-3 flex justify-center">
              <Button type="button" variant="outline" onClick={handleOpenFileSelector}>
                <FileText size={16} className="mr-1" />
                Adjuntar
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadedFiles.length ? (
              <p className="mt-2 text-xs text-slate-600">
                {uploadedFiles.length} archivo(s) cargado(s)
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-neutro-1">
              Seguridad e Higiene y ART
            </h3>
            <p className="text-xs text-slate-600">Aseguradora</p>
            <select
              value={formData.artProvider}
              onChange={handleArtProviderChange}
              className="w-full rounded-md border border-[#B8D8E3] bg-white px-3 py-2.5 text-sm text-neutro-1 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona ART</option>
              {artProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-neutro-1">
              <input
                type="checkbox"
                checked={formData.artCoverageConfirmed}
                onChange={handleArtCoverageChange}
                className="h-4 w-4 rounded border-slate-300 accent-primary"
              />
              Declaro cobertura vigente para todo el personal.
            </label>

            <div className="flex items-start gap-2 rounded-md bg-white/60 px-3 py-2 text-xs text-slate-600">
              <ShieldCheck size={14} className="mt-0.5 text-primary" />
              <p>
                Verifica la cobertura antes de crear la obra para habilitar el
                seguimiento diario.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default RenderArtStep
