import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";

interface CardObraProps {
  codigo: string;
  titulo: string;
  ubicacion: string;
  artStatus: "ok" | "warning" | "error";
  seguridadStatus: "ok" | "warning" | "error";
  progreso: number;
  responsable: string;
  onDetalle: () => void;
}

export const CardObra = ({
  codigo,
  titulo,
  ubicacion,
  artStatus,
  seguridadStatus,
  progreso,
  responsable,
  onDetalle,
}: CardObraProps) => {
  return (
    <Card className="space-y-4">
      {/* Código */}
      <span className="inline-block bg-yellow-200 text-xs px-3 py-1 rounded-full font-medium">
        {codigo}
      </span>

      {/* Título */}
      <h3 className="text-lg font-semibold">{titulo}</h3>

      {/* Ubicación */}
      <p className="text-sm text-slate-500">{ubicacion}</p>

      {/* Estados */}
      <div className="flex gap-3">
        <StatusBadge label="Estado ART" status={artStatus} />
        <StatusBadge label="Seguridad" status={seguridadStatus} />
      </div>

      {/* Progreso */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Obra gruesa</span>
          <span>{progreso}%</span>
        </div>
        <ProgressBar value={progreso} />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-slate-500">{responsable}</span>
        <Button variant="ghost" onClick={onDetalle}>
          Ver detalle →
        </Button>
      </div>
    </Card>
  );
};