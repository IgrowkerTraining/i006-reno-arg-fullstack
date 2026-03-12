import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { Calendar, HardHat, MapPin, User } from "lucide-react";
import { formatDate } from "@/src/utils/formateDate";
import { User as UserType } from "@/src/types";

interface CardObraProps {
  codigo: string;
  titulo: string;
  ubicacion: string;
  fechaInicio: string;
  artStatus: "vigente" | "warning" | "error" | "revisar";
  seguridadStatus: "vigente" | "warning" | "error" | "revisar";
  progreso: number;
  responsable: string;
  matricula: string;
  onDetalle: () => void;
  onRegistro: () => void;
  user: UserType;
}

export const CardObra = ({
  codigo,
  titulo,
  ubicacion,
  fechaInicio,
  artStatus,
  seguridadStatus,
  progreso,
  responsable,
  matricula,
  onDetalle,
  onRegistro,
  user
}: CardObraProps) => {


  return (
    <Card className="flex flex-col gap-6 w-[480px] h-[550px] flex-shrink-0 p-6 rounded-lg border-neutro-2">

      <div className="flex items-center justify-between">
        <span className="inline-block bg-yellow-200 text-sm px-4 py-2 rounded-full font-medium w-fit text-center">
          {codigo}
        </span>
          <HardHat className="text-primary w-10 h-10 bg-accent/50 rounded-full p-1.5" />
          </div>

      <h3 className="text-3xl font-semibold" >{titulo}</h3>
      <p className="text-md flex items-center"><MapPin className="inline mr-2 size-5" />{ubicacion}</p>
      <p className="text-sm"><Calendar className="inline mr-2 size-5" />Fecha de inicio: {formatDate(fechaInicio)}</p>

      {/* Estados */}
      <div className="flex gap-3 w-full">
        <StatusBadge label="Estado ART" status={artStatus} />
        <StatusBadge label="Seguridad" status={seguridadStatus} />
      </div>

      {/* Progreso */}
      <div >
        <div className="flex justify-between text-md mb-2">
          <span>Avance total</span>
          <span>{progreso}%</span>
        </div>
        <ProgressBar value={progreso} />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-start pt-2">
        <div className="flex gap-3">
          <span className="flex items-center justify-center bg-neutro-3 text-neutro-1 rounded-full w-10 h-10 "><User size={22} className="text-secondary" /></span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm">Arq. {responsable}</span>
            <span className="text-xs">{matricula}</span>
          </div>
        </div>       
          <Button variant="outline" className="text-sm" onClick={onDetalle}>
            Ver detalle →
          </Button>
            {user.idRol === 2  && ( 
          <Button variant="accent" className="text-sm" onClick={onRegistro}>
            Reportar registro
          </Button>
         )
          }
      </div>
    </Card>
  );
};