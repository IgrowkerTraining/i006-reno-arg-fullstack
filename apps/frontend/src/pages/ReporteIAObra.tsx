import React, { useState, useEffect } from "react";
import { Card } from "../components/common/Card";
import { CheckCircle, Download, Eye, FileText, Flower, HardHat, UserRoundCog } from "lucide-react";
import { ProgressBar } from "../components/common/ProgressBar";
import { Button } from "../components/common/Button";

import { useRef } from "react";
import { handleExportPDF } from "../utils/exportReport";
import { useLocation, useParams } from "react-router-dom";

const ReporteIA: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [dataAnalysis, setDataAnalysis] = useState(null)
  
  const reportRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { analysis, month, year } = location.state || {};

  useEffect(()=>{
    if (analysis){
      setDataAnalysis(analysis)
    }  
  },[])


  if (!analysis) {
    return <p>No hay análisis disponible</p>;
  }
  console.log({dataAnalysis});


  return (
    <div ref={reportRef}>
      <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-2xl"><Flower size={20} /> ANÁLISIS ASISTIDO POR IA</h3>
      <header className="flex items-end gap-6 mt-4">
        <div>
        <h2 className="font-bold text-2xl my-2">{}</h2>
        <h4 className="font-bold">{} - Periodo: {month} | {year}</h4>
        </div>
        <Button variant="outline" className="ml-auto" onClick={() =>""/*  handleExportPDF({ reportRef, analysis } ) */} data-html2canvas-ignore="true"><Download size={20} className="mr-2" />Exportar PDF</Button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><FileText size={25} className="inline mr-2 text-secondary" />Resumen General</h4>
          <p className="">{analysis.resumen_general}</p>

        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><FileText size={25} className="inline mr-2 text-accent" />Ejecución y Avance</h4>
          <div className="flex justify-between text-sm mt-2">
            <span>Avance de obra</span>
            <span>45%</span>
          </div>
          <ProgressBar value={45} color="bg-accent" />
          <p className="">{analysis.ejecucion_planificacion}</p>

        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><HardHat size={25} className="inline mr-2 text-primary" />Cumplimiento y seguridad</h4>
          <p className="bg-secondary p-2 rounded-lg text-white flex items-center justify-center">{analysis.cobertura_art === "Activa" ? <><CheckCircle className="inline mr-2" size={16} /> ART VIGENTE: Provincia ART</> : "Cobertura inactiva"}</p>
          <p className="">{analysis.seguridad_cumplimiento}</p>


        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
          <h4 className="font-bold text-xl"><UserRoundCog size={25} className="inline mr-2 text-accent-2" />Validación técnica</h4>
          <p className="">{analysis.validacion_tecnica}</p>
     
        </Card>
        <Card className="flex flex-col gap-4 p-8 rounded-xl bg-[#5373DE] border-primary col-span-2 text-white" >
          <h4 className="font-bold text-xl"><Eye size={25} className="inline mr-2 " />Observación General</h4>
          <p className="">{analysis.observacion_general}</p>
        </Card>
      </section>
    </div> )}
 


export default ReporteIA;

