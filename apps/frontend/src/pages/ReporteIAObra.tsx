import React, { useState, useEffect } from "react";
import { Card } from "../components/common/Card";
import { Download, Eye, FileText, Flower, HardHat, LayoutPanelTop, UserRoundCog } from "lucide-react";
import { Button } from "../components/common/Button";
import { useRef } from "react";
import { handleExportPDF } from "../utils/exportReport";
import { useLocation} from "react-router-dom";
import { formatDate } from "../utils/formateDate";

const ReporteIA: React.FC = () => {

  const [dataAnalysis, setDataAnalysis] = useState(null)

  const reportRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { analysis, month, year } = location.state || {};

  useEffect(() => {
    if (analysis) {
      setDataAnalysis(analysis.data.analysis.resultado)
    }
  }, [analysis])


  if (!analysis || !dataAnalysis ) {
    return <p>No hay análisis disponible</p>;
  }

  

  return (
    <div ref={reportRef}>
      <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-2xl"><Flower size={20} /> ANÁLISIS ASISTIDO POR IA</h3>
      <header className="flex items-end gap-6 mt-4">
        <div>
          <h2 className="font-bold text-2xl my-2">{dataAnalysis.proyecto}</h2>
          <h4 className="font-semibold">Periodo analizado: {month} | {year} | Fecha de generación: {dataAnalysis.fecha_de_generacion}</h4>
        </div>
        <Button variant="outline" className="ml-auto" onClick={() =>  handleExportPDF({ reportRef, dataAnalysis } ) } data-html2canvas-ignore="true"><Download size={20} className="mr-2" />Exportar PDF</Button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><FileText size={25} className="inline mr-2 text-secondary" />Resumen General</h4>
            <div className="border-l-4 border-secondary pl-4">          
          <p>{dataAnalysis.resumen_general_del_estado_de_la_obra}</p>
          </div>

        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><LayoutPanelTop size={25} className="inline mr-2 text-accent" />Ejecución y Planificación</h4>
          <div className="border-l-4 border-accent pl-4">
            <p >{dataAnalysis.ejecucion_y_planificacion}</p>
          </div>

        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><HardHat size={25} className="inline mr-2 text-primary" />Medidas de seguridad y cumplimiento</h4>
          <div className="border-l-4 border-primary pl-4">
            <p>{dataAnalysis.medidas_de_seguridad_y_cumplimiento}</p>
          </div>


        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><UserRoundCog size={25} className="inline mr-2 text-accent-2" />Validación técnica</h4>
          <div className="border-l-4 border-accent-2 pl-4">
            <p>{dataAnalysis.validaciones_tecnicas}</p>
          </div>

        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl bg-[#E5EAFA] border-[#5373DE] col-span-2 text-[#5373DE]" >
          <h4 className="font-bold text-xl"><Eye size={25} className="inline mr-2 " />Observación General</h4>
          <p>{dataAnalysis.observacion_general}</p>
        </Card>
      </section>
    </div>)
}



export default ReporteIA;

