interface RegistroHeaderProps {
  obraNombre: string;
  fecha: string;
  porcentaje: number;
  pasoActual: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: "Tareas" },
  { id: 2, label: "Seguridad y ART" },
  { id: 3, label: "Finalizar" },
];

const RegistroHeader = ({
  obraNombre,
  fecha,
  porcentaje,
  pasoActual,
}: RegistroHeaderProps) => {
  return (
    <div className="text-white space-y-4">

      {/* Título y porcentaje */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{obraNombre}</h2>
          <p className="text-sm opacity-90">
            Registro diario - {fecha}
          </p>
        </div>
        <div className="text-lg font-semibold">
          {porcentaje}%
          <p className="text-xs opacity-80 text-right">AVANCE ACTUAL</p>
        </div>
      </div>

      {/* Barra progreso */}
      <div className="w-full bg-white/30 h-2 rounded-full">
        <div
          className="bg-white h-2 rounded-full transition-all"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      {/* Stepper */}
      <div className="flex justify-between mt-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-sm"
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${
                pasoActual === step.id
                  ? "bg-white text-primary"
                  : "bg-white/30 text-white"
              }`}
            >
              {step.id}
            </div>
            <span className="mt-1 text-xs">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistroHeader;