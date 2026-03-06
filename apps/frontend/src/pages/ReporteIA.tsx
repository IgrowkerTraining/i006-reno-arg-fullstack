import React, { useState, useEffect } from "react";
import { Card } from "../components/common/Card";
import { CheckCircle, Download, Eye, FileText, Flower, HardHat, UserRoundCog } from "lucide-react";
import { ProgressBar } from "../components/common/ProgressBar";
import { Button } from "../components/common/Button";

import { useRef } from "react";
import { handleExportPDF } from "../utils/exportReport";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

/* interface AnalysisReport {
 
      analisis_id: string,
      status: string,
      resultado: {
        Proyecto: {
          Código: string,
          Nombre: string,
          ResponsableTécnico: string
        },
        PeríodoAnalizado: string,
        Fechadegeneración: string,
        ResumenGeneralDelEstadoDeLaObra: string,
        "Ejecución y planificación": "Hasta la fecha de generación del informe, no se han seleccionado tareas ni oficios activos, lo que indica que no ha habido avance en la ejecución de la obra.",
        "Medidas de seguridad y cumplimiento": "Se han implementado medidas de seguridad que incluyen el uso de casco y calzado adecuado. La cobertura de ART está a cargo de Prevención ART y se encuentra activa.",
        "Validaciones técnicas": "La validación técnica correspondiente a la etapa de obra gruesa está pendiente, siendo Natasha la responsable de su gestión.",
        "Observación general": "Es fundamental que se inicien las tareas y oficios planificados para avanzar en la obra, así como llevar a cabo las validaciones técnicas necesarias para garantizar el cumplimiento de los estándares requeridos."
      }
    }
  }
}
} */

/* const data = {
  "data": {
    "success": true,
    "analysis": {
      "analisis_id": "0aafd44e-fc05-433b-a515-e648e11d2cc0",
      "status": "completed",
      "resultado": {
        "Proyecto": {
          "Código": "RENO-AR-2026-003",
          "Nombre": "Reforma vivienda",
          "Responsable Técnico": "Natasha"
        },
        "Período analizado": "02/2026",
        "Fecha de generación": "27/02/2026",
        "Resumen general del estado de la obra": "La obra se encuentra en la etapa de obra gruesa, actualmente en curso, con un avance estimado del 0%.",
        "Ejecución y planificación": "Hasta la fecha de generación del informe, no se han seleccionado tareas ni oficios activos, lo que indica que no ha habido avance en la ejecución de la obra.",
        "Medidas de seguridad y cumplimiento": "Se han implementado medidas de seguridad que incluyen el uso de casco y calzado adecuado. La cobertura de ART está a cargo de Prevención ART y se encuentra activa.",
        "Validaciones técnicas": "La validación técnica correspondiente a la etapa de obra gruesa está pendiente, siendo Natasha la responsable de su gestión.",
        "Observación general": "Es fundamental que se inicien las tareas y oficios planificados para avanzar en la obra, así como llevar a cabo las validaciones técnicas necesarias para garantizar el cumplimiento de los estándares requeridos."
      }
    }
  }
} */

const ReporteIA: React.FC = () => {

   const { obraId } = useParams<string>();
   const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!obraId) return;

    const analysisByProject = async () => {
      try {
        setLoading(true);

        const analysisGenerated = await api.generateAnalysis(obraId, 3, 2026 );
        setAnalysis(analysisGenerated);
      } catch {
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    analysisByProject();
  }, [obraId]);


  const reportRef = useRef<HTMLDivElement>(null);


  if (!obraId) return <p>Cargando...</p>;
  return (
     <div ref={reportRef}>
      <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-2xl"><Flower size={20} /> ANÁLISIS ASISTIDO POR IA</h3>
      <header className="flex items-end gap-6 mt-4">
        <div>
        <h2 className="font-bold text-2xl my-2">{analysis.codigo}</h2>
        <h4 className="font-bold">{analysis.proyecto} - Periodo: {analysis.periodo}</h4>
        </div>
        <Button variant="outline" className="ml-auto" onClick={() => ""/* handleExportPDF({ reportRef, analysis } )*/} data-html2canvas-ignore="true"><Download size={20} className="mr-2" />Exportar PDF</Button>
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
    </div>
  );
};

export default ReporteIA;

